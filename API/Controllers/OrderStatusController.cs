using API.DataModel;
using API.DataModel.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderStatusController : Controller
    {
        private IUnitOfWork unitOfWork;
        private IGenericRepo<OrderStatus> repo;
        public OrderStatusController(IUnitOfWork _unitOfWork){
            unitOfWork = _unitOfWork;
            repo = unitOfWork.Repo<OrderStatus>();
        }


        [HttpGet("orderstatuses")]
        public async Task<ActionResult> GetOrderStatuses()
        {
            return Ok((await repo.GetAll()).ToList());
            
        }

        [HttpGet("orderstatuses/{id}")]
        public async Task<ActionResult> GetOrderStatus(int id)
        {
            var os = await repo.Get(x => x.OrderStatusId == id);
            
            if (os==null)
                return (NotFound("No order status found."));
            else
                return Ok((await repo.Get(x => x.OrderStatusId == id)));

        }

    }
}
