using API.DataModel.Entities;
using API.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IEnumerable<OrderDescriptionDto> ToOrderDescriptionsDto(this IEnumerable<Order> orders)
        {
            if (orders.Any())
            {
                List<OrderDescriptionDto> odl = new List<OrderDescriptionDto>();
                foreach (Order o in orders)
                    odl.Add(o.ToOrderDescriptionDto());
                return odl;
            }
            else
                return Enumerable.Empty<OrderDescriptionDto>();
        }
        public static OrderDescriptionDto ToOrderDescriptionDto(this Order order)
        {

            if (order != null)
            {
                return new OrderDescriptionDto
                {
                    OrderId = order.OrderId,
                    ServiceDate = order.ServiceDate,
                    City = order.City,
                    Address = order.Address,
                    Area = order.Area,
                    TotalPrice = order.TotalPrice,
                    OrderStatus = order.OrderStatus,
                    Employee = order.Employee.ToEmployeeDto(),
                    Client = order.Client.ToClientDto(),
                    Services = order.ServicePrices.Select(x => new ServicePriceDto
                    {
                        Id = x.Id,
                        Description = x.Description
                    })
                };
            }
            else
                return null;
        }
    }
}
