using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class ClientDto
    {
        public int    Id { get; set; }
        public string CompanyName { get; set; }
        public string NIP { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public virtual string PhoneNumber { get; set; }       
        public virtual string Email { get; set; }
    }
}
