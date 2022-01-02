using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using API.DataModel.Entities;
using API.DataModel.Entities.AspNetIdentity;
using API.DataModel.SeedData;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.DataModel
{
    public class DataSeeder
    {
        public static async Task Seed(UserManager<User> userManager, RoleManager<Role> roleManager, DataContext dataContext)
        {
            await SeedRoles(roleManager);
            await SeedUsers(userManager);
            await SeedServicePrices(dataContext);
            await SeedOrders(userManager, dataContext, amount: 30);
        }

        private static async Task SeedOrders(UserManager<User> userManager, DataContext dataContext, int amount)
        {
            if (!(await dataContext.Orders.AnyAsync()))
            {
                for (int i = 0; i < amount; i++)
                {
                    await dataContext.Orders.AddAsync(await NewOrder(dataContext, userManager, i));
                }

                await dataContext.SaveChangesAsync();
            }
        }

        private static async Task SeedServicePrices(DataContext dataContext)
        {
            if (!(await dataContext.ServicePrices.AnyAsync()))
            {
                foreach (var servicePrice in ServicePrices.All)
                {
                    await dataContext.ServicePrices.AddAsync(servicePrice);
                }

                await dataContext.SaveChangesAsync();
            }
        }

        private static async Task SeedUsers(UserManager<User> userManager)
        {
            if (!(await userManager.Users.AnyAsync()))
            {
                foreach (var client in Users.Clients)
                {
                    await userManager.CreateAsync(client, "P@ssw0rd");
                    await userManager.AddToRoleAsync(client, "Client");
                }

                foreach (var worker in Users.Workers)
                {
                    await userManager.CreateAsync(worker, "P@ssw0rd");
                    await userManager.AddToRolesAsync(worker, new[] { "Client", "Worker" });
                }

                foreach (var admin in Users.Admins)
                {
                    await userManager.CreateAsync(admin, "P@ssw0rd");
                    await userManager.AddToRolesAsync(admin, new[] { "Client", "Worker", "Administrator" });
                }
            }
        }

        private static async Task SeedRoles(RoleManager<Role> roleManager)
        {
            if (!(await roleManager.Roles.AnyAsync()))
            {
                foreach (var role in Roles.All)
                {
                    await roleManager.CreateAsync(role);
                }
            }
        }

        private static async Task<Order> NewOrder(DataContext dataContext, UserManager<User> userManager, int number)
        {
            var order = new Order();
            order.City = $"Test City #{number}";
            order.Address = $"Test Address #{number}";
            order.Area = new Random().Next(4, 80);
            order.ServiceDate = DateTime.Now.AddDays(new Random().Next(1, 300));

            var status = await dataContext.OrderStatuses.SingleAsync(s => s.Description == "NEW");
            order.OrderStatus = status;
            order.OrderStatusId = status.OrderStatusId;

            var clients = await userManager.GetUsersInRoleAsync("Client");
            var client = clients[new Random().Next(0, clients.Count - 1)];

            order.Client = client;
            order.ClientId = client.Id;

            order.ServicePrices = await dataContext.ServicePrices.ToListAsync();
            order.TotalPrice = OrdersController.CalculateTotalPrice(order.Area, order.ServicePrices);

            return order;
        }
    }
}