using System.Collections.Generic;
using API.DataModel.Entities.AspNetIdentity;

namespace API.DataModel.SeedData
{
    public static class Roles
    {
        public static List<Role> All
        {
            get
            {
                return new List<Role>
                {
                    new Role { Name = "Client" },
                    new Role { Name = "Worker" },
                    new Role { Name = "Administrator" }
                };
            }
        }
    }
}