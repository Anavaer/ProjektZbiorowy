using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using API.Controllers;
using API.DataModel;
using API.DataModel.Entities;
using API.DataModel.Entities.AspNetIdentity;
using API.DTO;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace Tests
{
    public class OrdersControllerTests
    {
        [Test]
        public async Task CreateOrder_Returns_BadRequest_When_All_Services_Are_Invalid()
        {
            // Arrange
            var servicesRepo = new Mock<IGenericRepo<ServicePrice>>();
            servicesRepo.Setup(s => s.GetAll(It.IsAny<Expression<System.Func<ServicePrice, bool>>>(), null, null))
                        .Returns(Task.FromResult<IEnumerable<ServicePrice>>(new ServicePrice[] { }));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<ServicePrice>())
                          .Returns(servicesRepo.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CreateOrder(new Mock<OrderDto>().Object) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("All selected services are invalid.", result.Value);
        }

        [Test]
        public async Task CreateOrder_Returns_NoContent_When_Order_Is_Created_Successfully()
        {
            // Arrange
            var unitOfWorkMock = SetupMocksForCreateOrder();
            unitOfWorkMock.Setup(m => m.Save()).Returns(Task.FromResult<bool>(true));

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CreateOrder(
                new OrderDto() { ServiceDates = new List<DateTime> { DateTime.Now.AddDays(7) } }) as NoContentResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.NoContent, result.StatusCode);
        }

        [Test]
        public async Task CreateOrder_Returns_BadRequest_When_Error_Occurs_On_Save()
        {
            // Arrange
            var unitOfWorkMock = SetupMocksForCreateOrder();
            unitOfWorkMock.Setup(m => m.Save()).Returns(Task.FromResult<bool>(false));

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CreateOrder(
                new OrderDto() { ServiceDates = new List<DateTime> { DateTime.Now.AddDays(7) } }) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Error has occurred when creating order.", result.Value);
        }


        private static Mock<IUnitOfWork> SetupMocksForCreateOrder()
        {
            var servicesRepo = new Mock<IGenericRepo<ServicePrice>>();
            servicesRepo.Setup(s => s.GetAll(It.IsAny<Expression<System.Func<ServicePrice, bool>>>(), null, null))
                        .Returns(Task.FromResult<IEnumerable<ServicePrice>>(new[] { new Mock<ServicePrice>().Object }));

            var usersRepo = new Mock<IGenericRepo<User>>();
            usersRepo.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(), null))
                     .Returns(Task.FromResult<User>(new Mock<User>().Object));

            var statusesRepo = new Mock<IGenericRepo<OrderStatus>>();
            statusesRepo.Setup(u => u.Get(It.IsAny<Expression<System.Func<OrderStatus, bool>>>(), null))
                        .Returns(Task.FromResult<OrderStatus>(new Mock<OrderStatus>().Object));

            var ordersRepo = new Mock<IGenericRepo<Order>>();
            ordersRepo.Setup(o => o.Insert(It.IsAny<Order>())).Returns(Task.CompletedTask);

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<ServicePrice>()).Returns(servicesRepo.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepo.Object);
            unitOfWorkMock.Setup(m => m.Repo<OrderStatus>()).Returns(statusesRepo.Object);
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepo.Object);

            return unitOfWorkMock;
        }
    }
}