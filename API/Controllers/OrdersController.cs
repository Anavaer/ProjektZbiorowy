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
            var currentUserId = User.GetId();

            if ((await ordersRepo.GetAll()).Any())
            {
                if (User.IsInRole("Administrator"))
                {
                    return Ok((await ordersRepo.GetAll(
                                                    orderBy: x => x.OrderByDescending(x => x.ServiceDate),
                                                    includes: x => x.Include(x => x.OrderStatus)
                                                                    .Include(x => x.Employee)
                                                                    .Include(x => x.Client)
                                                                    .Include(x => x.ServicePrices)))
                                                                    .ToOrderDescriptionsDto());
                }

                if (User.IsInRole("Worker"))
                {
                    return Ok((await ordersRepo.GetAll(
                                                    filter: x => x.EmployeeId == currentUserId
                                                                || (x.EmployeeId == null && x.OrderStatus.OrderStatusId == 1)
                                                                || x.ClientId == currentUserId,
                                                    orderBy: x => x.OrderByDescending(x => x.ServiceDate),
                                                    includes: x => x.Include(x => x.OrderStatus)
                                                                     .Include(x => x.Employee)
                                                                     .Include(x => x.Client)
                                                                     .Include(x => x.ServicePrices)))
                                                                     .ToOrderDescriptionsDto());
                }

                return Ok((await ordersRepo.GetAll(
                                                filter: x => x.ClientId == currentUserId,
                                                orderBy: x => x.OrderByDescending(x => x.ServiceDate),
                                                includes: x => x.Include(x => x.OrderStatus)
                                                                .Include(x => x.Employee)
                                                                .Include(x => x.Client)
                                                                .Include(x => x.ServicePrices)))
                                                                .ToOrderDescriptionsDto());
            }

            return BadRequest("Nie znaleziono ??adnych zam??wie??.");
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator,Worker,Client")]
        public async Task<ActionResult> GetOrder(int id)
        {
            var order = await ordersRepo.Get(filter: x => x.OrderId == id,
                                             includes: x => x.Include(x => x.OrderStatus)
                                                             .Include(x => x.Employee)
                                                             .Include(x => x.Client)
                                                             .Include(x => x.ServicePrices));
            if (order == null)
                return BadRequest("Zam??wienie nie istnieje.");

            var currentUserId = User.GetId();

            if (User.IsInRole("Administrator"))
            {
                return Ok(order.ToOrderDescriptionDto());
            }

            if (User.IsInRole("Worker"))
            {
                if (order.EmployeeId == currentUserId
                    || (order.EmployeeId == null && order.OrderStatus.OrderStatusId == 1)
                    || order.ClientId == currentUserId)
                {
                    return Ok(order.ToOrderDescriptionDto());
                }
            }

            if (User.IsInRole("Client") && order.ClientId == currentUserId)
            {
                return Ok(order.ToOrderDescriptionDto());
            }

            return BadRequest($"Brak uprawnie??, aby wy??wietli?? zam??wienie {id}");
        }

        [HttpPost("create")]
        [Authorize(Roles = "Client")]
        public async Task<ActionResult> CreateOrder(OrderDto orderDto)
        {
            var services = await servicesRepo.GetAll(service => orderDto.ServicePriceIds.Contains(service.Id));
            if (services.Count() < 1)
            {
                return BadRequest("Wszystkie wybrane us??ugi s?? nieprawid??owe.");
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
                    TotalPrice = CalculateTotalPrice(orderDto.Area, services),
                    ServicePrices = (ICollection<ServicePrice>)services
                });
            }

            return await SaveAndReturnActionResult("Wyst??pi?? b????d podczas tworzenia zam??wienia.");
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
                return BadRequest("Nieprawid??owe Id zam??wienia.");
            }
            if (order.OrderStatus.Description != "NEW")
            {
                return BadRequest("Tylko nowe zamowienia mog?? by?? przypisane.");
            }
            if (order.ClientId == employeeId)
            {
                return BadRequest("Zamawiaj??cy nie mo??e zosta?? przypisany jako pracownik.");
            }

            if (User.IsInRole("Administrator"))
            {
                employeeId ??= User.GetId();

                var employee = await usersRepo.Get(filter: u => u.Id == employeeId,
                                                   includes: u => u.Include(r => r.UserRoles)
                                                                   .ThenInclude(r => r.Role));

                if (employee == null || employee.UserRoles.FirstOrDefault(r => r.Role.Name == "Worker") == null)
                {
                    return BadRequest("Nieprawid??owe Id pracownika.");
                }

                order.Employee = employee;
            }
            else if (User.IsInRole("Worker"))
            {
                var currentUser = await usersRepo.Get(u => u.Id == User.GetId());
                if (order.ClientId == currentUser.Id)
                {
                    return BadRequest("Zamawiaj??cy nie mo??e zosta?? przypisany jako pracownik.");
                }

                order.Employee = currentUser;
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "CONFIRMED");

            return await SaveAndReturnActionResult("Wyst??pi?? b????d podczas potwierdzania zam??wienia.");
        }

        [HttpPut("cancel/{id}")]
        [Authorize(Roles = "Client")]
        public async Task<ActionResult> CancelOrder(int id)
        {
            var order = await ordersRepo.Get(filter: o => o.OrderId == id,
                                             includes: o => o.Include(s => s.OrderStatus));
            if (order == null)
            {
                return BadRequest("Nieprawid??owe Id zam??wienia.");
            }
            if (!(order.OrderStatus.Description == "NEW" || order.OrderStatus.Description == "CONFIRMED"))
            {
                return BadRequest("Tylko nowe i potwierdzone zamowienia mog?? by?? anulowane.");
            }

            var currentUser = await usersRepo.Get(u => u.Id == User.GetId());

            if (order.ClientId != currentUser.Id)
            {
                return BadRequest("Zam??wienie mo??e by?? anulowane tylko przez zamawiaj??cego.");
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "CANCELED");

            return await SaveAndReturnActionResult("Wyst??pi?? b????d podczas anulowania zam??wienia.");
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
                return BadRequest("Nieprawid??owe Id zam??wienia.");
            }
            if (order.OrderStatus.Description != "CONFIRMED")
            {
                return BadRequest("Tylko potwierdzone zam??wienia mog?? by?? rozpocz??te.");
            }

            var currentUser = await usersRepo.Get(u => u.Id == User.GetId());

            if (order.EmployeeId != currentUser.Id)
            {
                return BadRequest("Zam??wienie mo??e by?? rozpocz??te tylko przez przypisanego pracownika.");
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "ONGOING");

            return await SaveAndReturnActionResult("Wyst??pi?? b????d podczas rozpoczynania zam??wienia.");
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
                return BadRequest("Nieprawid??owe Id zam??wienia.");
            }
            if (order.OrderStatus.Description != "ONGOING")
            {
                return BadRequest("Tylko rozpocz??te zam??wienia mog?? by?? zako??czone.");
            }

            var currentUser = await usersRepo.Get(u => u.Id == User.GetId());

            if (order.EmployeeId != currentUser.Id)
            {
                return BadRequest("Zam??wienie mo??e by?? zako??czone tylko przez przypisanego pracownika.");
            }

            order.OrderStatus = await statusesRepo.Get(s => s.Description == "COMPLETED");

            return await SaveAndReturnActionResult("Wyst??pi?? b????d podczas zako??czania zam??wienia.");
        }


        private async Task<ActionResult> SaveAndReturnActionResult(string errorMessageOnFail)
        {
            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest(errorMessageOnFail);
            }

            return NoContent();
        }

        public static float CalculateTotalPrice(int area, IEnumerable<ServicePrice> services)
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