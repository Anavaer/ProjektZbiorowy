using System.Collections.Generic;
using System.Threading.Tasks;
using API.DataModel.Entities.AspNetIdentity;
using Microsoft.AspNetCore.Identity;

namespace API.DataModel
{
    public class DataSeeder
    {
        public static async Task Seed(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            await SeedRoles(roleManager);
            await SeedUsers(userManager);
        }

        private static async Task SeedUsers(UserManager<User> userManager)
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

        private static async Task SeedRoles(RoleManager<Role> roleManager)
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