using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities;
using API.DTO;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepo<Order> ordersRepo;

        public OrdersController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.ordersRepo = this.unitOfWork.Repo<Order>();
        }

        // GetOrders
        [HttpGet("orders")]
        public async Task<ActionResult> GetOrders()
        {
            // admin wszystkie
            // worker wolne do wziecia lub przypisane do siebie 
            // klient tylko swoje
            return Ok();
        }

        [HttpGet("orders/{id}")]
        public async Task<ActionResult> GetOrder(int id)
        {
            // admin wszystkie
            // worker wolne do wziecia lub przypisane do siebie 
            // klient tylko swoje
            return Ok();
        }

        [HttpPost("orders/create")]
        public async Task<ActionResult> CreateOrder(OrderDto orderDto)
        {
            // Zalogowany uzytkownik powinien byc automatycznie ustawiany jako klient w zamowieniu
            var clientId = User.GetId();
            // trzeba ustawic status na NEW przy tworzeniu 

            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Error has occurred when creating order.");
            }

            return NoContent();
        }

        [HttpPut("orders/{id}/assign/{employeeId}")]
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

        [HttpPut("orders/{id}/cancel")]
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

        [HttpPut("orders/{id}/start")]
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

        [HttpPut("orders/{id}/complete")]
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
    }
}