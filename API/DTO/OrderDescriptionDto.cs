using API.DataModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class OrderDescriptionDto
    {
        public int OrderId { get; set; }
        public DateTime ServiceDate { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public int Area { get; set; }
        public float TotalPrice { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public EmployeeDto Employee { get; set; }
        public ClientDto Client { get; set; }
        public IEnumerable<ServicePriceDto> Services { get; set; }

    }
}
