using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Controllers;
using API.DataModel;
using API.DataModel.Entities;
using API.DataModel.Entities.AspNetIdentity;
using API.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
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
            Assert.AreEqual("Wszystkie wybrane usługi są nieprawidłowe.", result.Value);
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
            Assert.AreEqual("Wystąpił błąd podczas tworzenia zamówienia.", result.Value);
        }

        [Test]
        public async Task CancelOrder_Returns_BadRequest_When_OrderStatus_Not_New_Or_Confirmed()
        {
            // Arrange
            var orderMock = new Mock<Order>();
            orderMock.SetupGet(o => o.OrderStatus).Returns(new Mock<OrderStatus>().Object);

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                        It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock.Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CancelOrder(It.IsAny<int>()) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Tylko nowe i potwierdzone zamowienia mogą być anulowane.", result.Value);
        }

        [Test]
        public async Task CancelOrder_Returns_BadRequest_When_Current_User_Is_Not_Client()
        {
            // Arrange
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "CONFIRMED" }, ClientId = 1 };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(), null))
                         .Returns(Task.FromResult<User>(new User { Id = 2 }));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CancelOrder(It.IsAny<int>()) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Zamówienie może być anulowane tylko przez zamawiającego.", result.Value);
        }

        [Test]
        public async Task CancelOrder_Returns_NoContent_When_Order_Is_Cancelled_Successfully()
        {
            // Arrange
            var userMock = new User { Id = 1 };
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "NEW" }, ClientId = userMock.Id };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(), null))
                         .Returns(Task.FromResult<User>(userMock));

            var statusesRepo = new Mock<IGenericRepo<OrderStatus>>();
            statusesRepo.Setup(u => u.Get(It.IsAny<Expression<System.Func<OrderStatus, bool>>>(), null))
                        .Returns(Task.FromResult<OrderStatus>(new Mock<OrderStatus>().Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<OrderStatus>()).Returns(statusesRepo.Object);
            unitOfWorkMock.Setup(m => m.Save()).Returns(Task.FromResult<bool>(true));

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CancelOrder(It.IsAny<int>()) as NoContentResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.NoContent, result.StatusCode);
        }

        [Test]
        public async Task StartOrder_Returns_BadRequest_When_OrderStatus_Not_Confirmed()
        {
            // Arrange
            var orderMock = new Mock<Order>();
            orderMock.SetupGet(o => o.OrderStatus).Returns(new Mock<OrderStatus>().Object);

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock.Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.StartOrder(It.IsAny<int>()) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Tylko potwierdzone zamówienia mogą być rozpoczęte.", result.Value);
        }

        [Test]
        public async Task CompleteOrder_Returns_BadRequest_When_OrderStatus_Not_Ongoing()
        {
            // Arrange
            var orderMock = new Mock<Order>();
            orderMock.SetupGet(o => o.OrderStatus).Returns(new Mock<OrderStatus>().Object);

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock.Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CompleteOrder(It.IsAny<int>()) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Tylko rozpoczęte zamówienia mogą być zakończone.", result.Value);
        }

        [Test]
        public async Task AssignOrder_Returns_BadRequest_When_OrderStatus_Not_New()
        {
            // Arrange
            var orderMock = new Mock<Order>();
            orderMock.SetupGet(o => o.OrderStatus).Returns(new Mock<OrderStatus>().Object);

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock.Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.AssignOrder(It.IsAny<int>()) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Tylko nowe zamowienia mogą być przypisane.", result.Value);
        }

        [Test]
        public async Task StartOrder_Returns_BadRequest_When_Current_User_Is_Not_Assigned_Employee()
        {
            // Arrange
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "CONFIRMED" }, EmployeeId = 1 };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(), null))
                         .Returns(Task.FromResult<User>(new User { Id = 2 }));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.StartOrder(It.IsAny<int>()) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Zamówienie może być rozpoczęte tylko przez przypisanego pracownika.", result.Value);
        }

        [Test]
        public async Task AssignOrder_Returns_BadRequest_When_Employee_Equals_Client()
        {
            // Arrange
            var userMock = new User { Id = 1 };
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "NEW" }, ClientId = userMock.Id };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.AssignOrder(It.IsAny<int>(), userMock.Id) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Zamawiający nie może zostać przypisany jako pracownik.", result.Value);
        }

        [Test]
        public async Task AssignOrder_Returns_NoContent_For_Admin_When_Order_Is_Assigned_Successfully()
        {
            // Arrange
            var userRolesMock = new List<UserRole>() { new UserRole { Role = new Role { Name = "Worker" } } };
            var userMock = new User { Id = 1, UserRoles = userRolesMock };
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "NEW" }, ClientId = 2 };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(),
                                           It.IsAny<Func<IQueryable<User>, IIncludableQueryable<User, object>>>()))
                         .Returns(Task.FromResult<User>(userMock));

            var statusesRepo = new Mock<IGenericRepo<OrderStatus>>();
            statusesRepo.Setup(u => u.Get(It.IsAny<Expression<System.Func<OrderStatus, bool>>>(), null))
                        .Returns(Task.FromResult<OrderStatus>(new Mock<OrderStatus>().Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<OrderStatus>()).Returns(statusesRepo.Object);
            unitOfWorkMock.Setup(m => m.Save()).Returns(Task.FromResult<bool>(true));

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);
            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.SetupGet(x => x.User).Returns(NewClaims("Administrator"));
            ordersController.ControllerContext.HttpContext = httpContextMock.Object;

            // Act
            var result = await ordersController.AssignOrder(It.IsAny<int>(), userMock.Id) as NoContentResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.NoContent, result.StatusCode);
        }

        [Test]
        public async Task AssignOrder_Returns_NoContent_For_Worker_When_Order_Is_Assigned_Successfully()
        {
            // Arrange
            //var userRolesMock = new List<UserRole>() { new UserRole { Role = new Role { Name = "Worker" } } };
            var userMock = new User { Id = 1 };
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "NEW" }, ClientId = 2 };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(),
                                           null))
                         .Returns(Task.FromResult<User>(userMock));

            var statusesRepo = new Mock<IGenericRepo<OrderStatus>>();
            statusesRepo.Setup(u => u.Get(It.IsAny<Expression<System.Func<OrderStatus, bool>>>(), null))
                        .Returns(Task.FromResult<OrderStatus>(new Mock<OrderStatus>().Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<OrderStatus>()).Returns(statusesRepo.Object);
            unitOfWorkMock.Setup(m => m.Save()).Returns(Task.FromResult<bool>(true));

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);
            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.SetupGet(x => x.User).Returns(NewClaims("Worker"));
            ordersController.ControllerContext.HttpContext = httpContextMock.Object;

            // Act
            var result = await ordersController.AssignOrder(It.IsAny<int>(), userMock.Id) as NoContentResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.NoContent, result.StatusCode);
        }

        [Test]
        public async Task CompleteOrder_Returns_BadRequest_When_Current_User_Is_Not_Assigned_Employee()
        {
            // Arrange
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "ONGOING" }, EmployeeId = 1 };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(), null))
                         .Returns(Task.FromResult<User>(new User { Id = 2 }));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CompleteOrder(It.IsAny<int>()) as BadRequestObjectResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.AreEqual("Zamówienie może być zakończone tylko przez przypisanego pracownika.", result.Value);
        }

        [Test]
        public async Task StartOrder_Returns_NoContent_When_Order_Is_Started_Successfully()
        {
            // Arrange
            var userMock = new User { Id = 1 };
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "CONFIRMED" }, EmployeeId = userMock.Id };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(), null))
                         .Returns(Task.FromResult<User>(userMock));

            var statusesRepo = new Mock<IGenericRepo<OrderStatus>>();
            statusesRepo.Setup(u => u.Get(It.IsAny<Expression<System.Func<OrderStatus, bool>>>(), null))
                        .Returns(Task.FromResult<OrderStatus>(new Mock<OrderStatus>().Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<OrderStatus>()).Returns(statusesRepo.Object);
            unitOfWorkMock.Setup(m => m.Save()).Returns(Task.FromResult<bool>(true));

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.StartOrder(It.IsAny<int>()) as NoContentResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.NoContent, result.StatusCode);
        }

        [Test]
        public async Task CompleteOrder_Returns_NoContent_When_Order_Is_Completed_Successfully()
        {
            // Arrange
            var userMock = new User { Id = 1 };
            var orderMock = new Order { OrderStatus = new OrderStatus { Description = "ONGOING" }, EmployeeId = userMock.Id };

            var ordersRepoMock = new Mock<IGenericRepo<Order>>();
            ordersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<Order, bool>>>(),
                                            It.IsAny<Func<IQueryable<Order>, IIncludableQueryable<Order, object>>>()))
                          .Returns(Task.FromResult<Order>(orderMock));

            var usersRepoMock = new Mock<IGenericRepo<User>>();
            usersRepoMock.Setup(u => u.Get(It.IsAny<Expression<System.Func<User, bool>>>(), null))
                         .Returns(Task.FromResult<User>(userMock));

            var statusesRepo = new Mock<IGenericRepo<OrderStatus>>();
            statusesRepo.Setup(u => u.Get(It.IsAny<Expression<System.Func<OrderStatus, bool>>>(), null))
                        .Returns(Task.FromResult<OrderStatus>(new Mock<OrderStatus>().Object));

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock.Setup(m => m.Repo<Order>()).Returns(ordersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<User>()).Returns(usersRepoMock.Object);
            unitOfWorkMock.Setup(m => m.Repo<OrderStatus>()).Returns(statusesRepo.Object);
            unitOfWorkMock.Setup(m => m.Save()).Returns(Task.FromResult<bool>(true));

            OrdersController ordersController = new OrdersController(unitOfWorkMock.Object);

            // Act
            var result = await ordersController.CompleteOrder(It.IsAny<int>()) as NoContentResult;

            // Assert
            Assert.AreEqual((int)HttpStatusCode.NoContent, result.StatusCode);
        }

        private ClaimsPrincipal NewClaims(string role)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Role, role)
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            return claimsPrincipal;
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