using System.Collections.Generic;
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
        }

        private static async Task SeedServicePrices(DataContext dataContext)
        {
            if (!(await dataContext.ServicePrices.AnyAsync()))
            {
                var servicePrices = new List<ServicePrice>
                {
                    new ServicePrice { Description = "Dummy Service 01", PriceRatio = 2.0F },
                    new ServicePrice { Description = "Dummy Service 02", PriceRatio = 1.8F },
                    new ServicePrice { Description = "Dummy Service 03", PriceRatio = 0.75F }
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
                var client = new User { UserName = "client" };
                await userManager.CreateAsync(client, "P@ssw0rd");
                await userManager.AddToRoleAsync(client, "Client");

                var worker = new User { UserName = "worker" };
                await userManager.CreateAsync(worker, "P@ssw0rd");
                await userManager.AddToRolesAsync(worker, new[] { "Client", "Worker" });

                var admin = new User { UserName = "admin" };
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
    }
}