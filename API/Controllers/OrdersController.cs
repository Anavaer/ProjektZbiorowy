using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities;
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

    }
}