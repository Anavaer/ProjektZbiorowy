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

            var admin = new User { UserName = "admin" };
            await userManager.CreateAsync(admin, "P@ssw0rd");
            await userManager.AddToRoleAsync(admin, "Administrator");
        }
    }
}