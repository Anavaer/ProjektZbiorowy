using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class EmployeeDto
    {
        public int    Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }                
        public virtual string PhoneNumber { get; set; }       
        public virtual string Email { get; set; }
    }
}
