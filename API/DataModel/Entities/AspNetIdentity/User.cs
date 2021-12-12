using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.DataModel.Entities.AspNetIdentity
{
    public class User : IdentityUser<int>
    {
        public string CompanyName { get; set; }
        public string NIP { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }
    }
}