using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities;
using API.DataModel.Entities.AspNetIdentity;
using API.DTO;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    // TODO: Add Authorize attributes according to Roles
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepo<Order> ordersRepo;
        private readonly IGenericRepo<User> usersRepo;
        private readonly IGenericRepo<OrderStatus> statusesRepo;
        private readonly IGenericRepo<ServicePrice> servicesRepo;

        public OrdersController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.ordersRepo = this.unitOfWork.Repo<Order>();
            this.usersRepo = this.unitOfWork.Repo<User>();
            this.statusesRepo = this.unitOfWork.Repo<OrderStatus>();
            this.servicesRepo = this.unitOfWork.Repo<ServicePrice>();
        }

        [HttpGet]
        [Authorize(Roles = "Administrator,Worker,Client")]
        public async Task<ActionResult> GetOrders()
        {
            if (User.IsInRole("Worker"))
                return Ok(await ordersRepo.GetAll(filter:x=>x.EmployeeId==User.GetId() || x.OrderStatus.OrderStatusId==1,
                                                  orderBy:x=>x.OrderByDescending(x=>x.ServiceDate),
                                                 includes:x => x.Include(x => x.OrderStatus)
                                                                .Include(x => x.Employee)));
            else if (User.IsInRole("Client"))
                return Ok(await ordersRepo.GetAll(filter:  x => x.ClientId == User.GetId(),
                                                  orderBy: x => x.OrderByDescending(x => x.ServiceDate),
                                                 includes: x => x.Include(x => x.OrderStatus)
                                                                 .Include(x => x.Employee)));      
            else if (User.IsInRole("Administrator"))
                return Ok(await ordersRepo.GetAll(
                     orderBy: x => x.OrderByDescending(x => x.ServiceDate),
                    includes: x => x.Include(x => x.OrderStatus)
                                    .Include(x => x.Employee)));
            else
                return BadRequest("User must be authorized to see orders.");
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator,Worker,Client")]
        public async Task<ActionResult> GetOrder(int id)
        {
          var order = await ordersRepo.Get(filter: x => x.OrderId ==id,                                               
                                           includes: x => x.Include(x => x.OrderStatus)
                                                                 .Include(x => x.Employee));
          if (order != null)
            {
                if (User.IsInRole("Worker"))
                    if (order.EmployeeId == User.GetId() || order.OrderStatus.OrderStatusId == 1)
                        return Ok(order);
                    else
                        return BadRequest("Either the order is not assigned to the user or its status is different from 'NEW'");
                else if (User.IsInRole("Client"))                        
                        if (order.ClientId == User.GetId())
                             return Ok(order);
                        else
                            return BadRequest("Order does not belong to the specific client.");
                else if (User.IsInRole("Administrator"))
                        return Ok(order); 
                else
                    return BadRequest("User must be authorized to see the order.");
            }
            else
                return BadRequest("Order not found.");
        }

        [HttpPost("create")]
        [Authorize(Roles = "Client")]
        public async Task<ActionResult> CreateOrder(OrderDto orderDto)
        {
            var services = await servicesRepo.GetAll(service => orderDto.ServicePriceIds.Contains(service.Id));
            if (services.Count() < 1)
            {
                return BadRequest("All selected services are invalid.");
            }

            var client = await usersRepo.Get(u => u.Id == User.GetId());
            var statusNew = await statusesRepo.Get(s => s.Description == "NEW");

            foreach (var date in orderDto.ServiceDates)
            {
                await this.ordersRepo.Insert(new Order
                {
                    Client = client,
                    ClientId = client.Id,
                    ServiceDate = date,
                    OrderStatus = statusNew,
                    OrderStatusId = statusNew.OrderStatusId,
                    City = orderDto.City,
                    Address = orderDto.Address,
                    Area = orderDto.Area,
                    TotalPrice = calculateTotalPrice(orderDto.Area, services),
                    ServicePrices = (ICollection<ServicePrice>)services
                });
            }

            return await SaveAndReturnActionResult("Error has occurred when creating order.");
        }

        [HttpPut("assign/{id}")]
        [Authorize(Roles = "Worker,Administrator")]
        public async Task<ActionResult> AssignOrder(int id, [FromQuery] int? employeeId = null)
        {
            var order = await ordersRepo.Get(filter: o => o.OrderId == id,
                                             includes: o => o.Include(s => s.OrderStatus)
                                                             .Include(s => s.Employee));
            if (order == null)
            {
                return BadRequest("Invalid OrderId.");
            }
            if (order.OrderStatus.Description != "NEW")
            {
                return BadRequest("Only orders in status 'NEW' can be assigned.");
            }
            if (order.ClientId == employeeId)
            {
                return BadRequest("Order's client cannot be assigned as a worker.");
            }

            if (User.IsInRole("Administrator"))
            {
                var employee = await usersRepo.Get(filter: u => u.Id == employeeId,
                                                   includes: u => u.Include(r => r.UserRoles)
                                                                   .ThenInclude(r => r.Role));

                if (employee == null || employee.UserRoles.FirstOrDefault(r => r.Role.Name == "Worker") == null)
                {
                    return BadRequest("Invalid EmployeeId.");
                }

                order.Employee = employee;
            }
            else if (User.IsInRole("Worker"))
            {
                var currentUser = await usersRepo.Get(u => u.Id == User.GetId());
                if (order.ClientId == currentUser.Id)
                {
                    return BadRequest("Order's client cannot be assigned as a worker.");
                }

                order.Employee = currentUser;
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "CONFIRMED");

            return await SaveAndReturnActionResult("Error has occurred when changing status to CONFIRMED.");
        }

        [HttpPut("cancel/{id}")]
        [Authorize(Roles = "Client")]
        public async Task<ActionResult> CancelOrder(int id)
        {
            var order = await ordersRepo.Get(filter: o => o.OrderId == id,
                                             includes: o => o.Include(s => s.OrderStatus));
            if (order == null)
            {
                return BadRequest("Invalid OrderId.");
            }
            if (order.OrderStatus.Description != "NEW" || order.OrderStatus.Description != "CONFIRMED")
            {
                return BadRequest("Only orders in status 'NEW' or 'CONFIRMED' can be cancelled.");
            }

            var currentUser = await usersRepo.Get(u => u.Id == User.GetId());

            if (order.ClientId != currentUser.Id)
            {
                return BadRequest("Order can be cancelled only by the client.");
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "CANCELLED");

            return await SaveAndReturnActionResult("Error has occurred when changing status to CANCELLED.");
        }

        [HttpPut("start/{id}")]
        [Authorize(Roles = "Worker")]
        public async Task<ActionResult> StartOrder(int id)
        {
            var order = await ordersRepo.Get(filter: o => o.OrderId == id,
                                             includes: o => o.Include(s => s.OrderStatus)
                                                             .Include(s => s.Employee));
            if (order == null)
            {
                return BadRequest("Invalid OrderId.");
            }
            if (order.OrderStatus.Description != "CONFIRMED")
            {
                return BadRequest("Only orders in status 'CONFIRMED' can be started.");
            }

            var currentUser = await usersRepo.Get(u => u.Id == User.GetId());

            if (order.EmployeeId != currentUser.Id)
            {
                return BadRequest("Order can be started only by assigned employee.");
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "ONGOING");

            return await SaveAndReturnActionResult("Error has occurred when changing status to ONGOING.");
        }

        [HttpPut("complete/{id}")]
        [Authorize(Roles = "Worker")]
        public async Task<ActionResult> CompleteOrder(int id)
        {
            var order = await ordersRepo.Get(filter: o => o.OrderId == id,
                                             includes: o => o.Include(s => s.OrderStatus)
                                                             .Include(s => s.Employee));
            if (order == null)
            {
                return BadRequest("Invalid OrderId.");
            }
            if (order.OrderStatus.Description != "ONGOING")
            {
                return BadRequest("Only orders in status 'ONGOING' can be started.");
            }

            var currentUser = await usersRepo.Get(u => u.Id == User.GetId());

            if (order.EmployeeId != currentUser.Id)
            {
                return BadRequest("Order can be completed only by assigned employee.");
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "COMPLETED");

            return await SaveAndReturnActionResult("Error has occurred when changing status to COMPLETED.");
        }


        private async Task<ActionResult> SaveAndReturnActionResult(string errorMessageOnFail)
        {
            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest(errorMessageOnFail);
            }

            return NoContent();
        }

        private float calculateTotalPrice(int area, IEnumerable<ServicePrice> services)
        {
            float totalPrice = 0;
            foreach (var service in services)
            {
                totalPrice += (area * service.PriceRatio);
            }

            return totalPrice;
        }
    }
}