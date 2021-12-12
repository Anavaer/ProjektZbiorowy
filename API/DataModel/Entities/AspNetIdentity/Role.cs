using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.DataModel.Entities.AspNetIdentity
{
    public class Role : IdentityRole<int>
    {
        public ICollection<UserRole> UserRoles { get; set; }
    }
}