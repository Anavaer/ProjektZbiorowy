using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DataModel.Entities;
using API.DataModel.Entities.AspNetIdentity;
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
            for (int i = 0; i < 20; i++)
            {
                await dataContext.Orders.AddAsync(await NewOrder(dataContext, userManager));
            }

            await dataContext.SaveChangesAsync();
        }

        private static async Task SeedServicePrices(DataContext dataContext)
        {
            if (!(await dataContext.ServicePrices.AnyAsync()))
            {
                var servicePrices = new List<ServicePrice>
                {
                    new ServicePrice { Description = "Window Cleaning", PriceRatio = 2.0F },
                    new ServicePrice { Description = "Floors", PriceRatio = 1.8F },
                    new ServicePrice { Description = "Dusting", PriceRatio = 1.2F },
                    new ServicePrice { Description = "Washing Dishes", PriceRatio = 0.4F },
                    new ServicePrice { Description = "Laundry", PriceRatio = 0.3F },
                    new ServicePrice { Description = "Ironing", PriceRatio = 0.5F },
                    new ServicePrice { Description = "Bathroom Cleaning", PriceRatio = 0.80F },
                    new ServicePrice { Description = "Kitchen Cleaning", PriceRatio = 0.90F }
                };

                foreach (var servicePrice in servicePrices)
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
                var clients = new List<User>
                {
                    new User
                    {
                        FirstName = "John",
                        LastName = "Snow",
                        City = "Winterfell",
                        Address = "Somewhere St. 69",
                        CompanyName = null,
                        NIP = null,
                        UserName = "john_snow",
                    },
                    new User
                    {
                        FirstName = "Greta",
                        LastName = "Green",
                        City = "Alabama",
                        Address = "Kinder garden 123",
                        CompanyName = null,
                        NIP = null,
                        UserName = "greta_green",
                    },
                    new User
                    {
                        FirstName = "Andrew",
                        LastName = "Kloc",
                        City = "Northshire",
                        Address = "Route 66",
                        CompanyName = "Build Me Up",
                        NIP = "1122344550",
                        UserName = "a_kloc",
                    },
                    new User
                    {
                        FirstName = "Andrew",
                        LastName = "Golota",
                        City = "Warsaw",
                        Address = "Zlote Tarasy 23",
                        CompanyName = "Punch me Sp. z o.o.",
                        NIP = "5567788900",
                        UserName = "a_golota",
                    },
                    new User
                    {
                        FirstName = "Client",
                        LastName = "Lorem",
                        City = "Rome",
                        Address = "Bellisima 21",
                        CompanyName = null,
                        NIP = null,
                        UserName = "client",
                    },
                };

                foreach (var client in clients)
                {
                    await userManager.CreateAsync(client, "P@ssw0rd");
                    await userManager.AddToRoleAsync(client, "Client");
                }

                var workers = new List<User>
                {
                    new User
                    {
                        FirstName = "Arkadiusz",
                        LastName = "Polaczek",
                        City = "Warsaw",
                        Address = "Biedna 69A",
                        CompanyName = null,
                        NIP = null,
                        UserName = "areczek",
                    },
                    new User
                    {
                        FirstName = "Worker",
                        LastName = "Ipsum",
                        City = "Mexico City",
                        Address = "Tacos 66",
                        CompanyName = null,
                        NIP = null,
                        UserName = "worker",
                    },
                };

                foreach (var worker in workers)
                {
                    await userManager.CreateAsync(worker, "P@ssw0rd");
                    await userManager.AddToRolesAsync(worker, new[] { "Client", "Worker" });
                }

                var admin = new User
                {
                    FirstName = "Janusz",
                    LastName = "Wyzyskiwacz",
                    City = "Pcim Dolny",
                    Address = "Sasanki 69",
                    CompanyName = "Uslugi Sprzatajace Janusz Wyzyskiwacz",
                    NIP = "8104022666",
                    UserName = "admin",
                };

                await userManager.CreateAsync(admin, "P@ssw0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Client", "Worker", "Administrator" });
            }
        }

        private static async Task SeedRoles(RoleManager<Role> roleManager)
        {
            if (!(await roleManager.Roles.AnyAsync()))
            {
                var roles = new List<Role>
                {
                    new Role { Name = "Client" },
                    new Role { Name = "Worker" },
                    new Role { Name = "Administrator" }
                };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }
        }

        private static async Task<Order> NewOrder(DataContext dataContext, UserManager<User> userManager)
        {
            var order = new Order();
            order.City = RandomString(25);
            order.Address = RandomString(40);
            order.Area = new Random().Next(4, 80);
            order.ServiceDate = RandomDatetime();

            var status = await dataContext.OrderStatuses.SingleAsync(s => s.Description == "NEW");
            order.OrderStatus = status;
            order.OrderStatusId = status.OrderStatusId;

            var clients = await userManager.GetUsersInRoleAsync("Client");
            var client = clients[new Random().Next(0, clients.Count - 1)];

            order.Client = client;
            order.ClientId = client.Id;

            order.ServicePrices = await dataContext.ServicePrices.ToListAsync();
            order.TotalPrice = CalculateTotalPrice(order.Area, order.ServicePrices);

            return order;
        }

        private static string RandomString(int length)
        {
            Random random = new Random();

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private static DateTime RandomDatetime()
        {
            DateTime start = DateTime.Now;
            return start.AddDays(new Random().Next(1, 300));
        }

        private static float CalculateTotalPrice(int area, IEnumerable<ServicePrice> services)
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