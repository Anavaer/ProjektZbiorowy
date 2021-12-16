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

            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Error has occurred when creating order.");
            }

            return NoContent();
        }

        [HttpPut("{id}/assign/{employeeId}")]
        public async Task<ActionResult> AssignOrder(int id, int? employeeId = null)
        {
            // Admin moze podac employeeId
            // Worker jest automatycznie ustawiany jak zawola ta metode, niezaleznie od podanego employeeId?
            // Zamowienie nie moze zostac przypisane do Workera, jesli tez jest klientem danego zamowienia
            // Zamowienie moze byc przypisane tylko jezeli jest NEW
            // trzeba ustawic status na CONFIRMED przy przypisaniu
            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Error has occurred when changing status to CONFIRMED.");
            }

            return NoContent();
        }

        [HttpPut("cancel/{id}")]
        public async Task<ActionResult> CancelOrder(int id)
        {
            // Zamowienie moze byc anulowane tylko przez klienta
            // Zamowienie moze byc anulowane tylko jesli jest NEW lub CONFIRMED
            // trzeba ustawic status na CANCELLED
            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Error has occurred when changing status to CANCELLED.");
            }

            return NoContent();
        }

        [HttpPut("start/{id}")]
        public async Task<ActionResult> StartOrder(int id)
        {
            // Zamowienie moze byc wystartowane tylko przez przypisanego workera
            // Zamowienie moze byc wystartowane tylko jesli jest CONFIRMED
            // trzeba ustawic status na ONGOING
            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Error has occurred when changing status to ONGOING.");
            }

            return NoContent();
        }

        [HttpPut("complete/{id}")]
        public async Task<ActionResult> CompleteOrder(int id)
        {
            // Zamowienie moze byc wystartowane tylko przez przypisanego workera
            // Zamowienie moze byc wystartowane tylko jesli jest ONGOING
            // trzeba ustawic status na COMPLETED
            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Error has occurred when changing status to COMPLETED.");
            }

            return NoContent();
        }


        private float calculateTotalPrice(int area, IEnumerable<ServicePrice> services)
        {
            float totalPrice = 0;
            foreach (var service in services)
            {
                totalPrice += ((area * service.PriceRatio) * service.UnitPrice);
            }
            return totalPrice;
        }
    }
}