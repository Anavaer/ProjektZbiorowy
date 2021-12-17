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
        public async Task<ActionResult> GetOrders()
        {
            // admin wszystkie
            // worker wolne do wziecia lub przypisane do siebie 
            // klient tylko swoje
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetOrder(int id)
        {
            // admin wszystkie
            // worker wolne do wziecia lub przypisane do siebie 
            // klient tylko swoje
            return Ok();
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
        public async Task<ActionResult> CancelOrder(int id)
        {
            // Zamowienie moze byc anulowane tylko przez klienta
            // Zamowienie moze byc anulowane tylko jesli jest NEW lub CONFIRMED
            // trzeba ustawic status na CANCELLED
            return await SaveAndReturnActionResult("Error has occurred when changing status to CANCELLED.");
        }

        [HttpPut("start/{id}")]
        public async Task<ActionResult> StartOrder(int id)
        {
            // Zamowienie moze byc wystartowane tylko przez przypisanego workera
            // Zamowienie moze byc wystartowane tylko jesli jest CONFIRMED
            // trzeba ustawic status na ONGOING
            return await SaveAndReturnActionResult("Error has occurred when changing status to ONGOING.");
        }

        [HttpPut("complete/{id}")]
        public async Task<ActionResult> CompleteOrder(int id)
        {
            // Zamowienie moze byc wystartowane tylko przez przypisanego workera
            // Zamowienie moze byc wystartowane tylko jesli jest ONGOING
            // trzeba ustawic status na COMPLETED
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