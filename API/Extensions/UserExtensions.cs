using API.DataModel.Entities.AspNetIdentity;
using API.DTO;
using System.Security.Claims;

namespace API.Extensions
{
    public static class UserExtensions
    {
        public static EmployeeDto ToEmployeeDto(this User user)
        {            
            if (user!=null)
            {
                return new EmployeeDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Email = user.Email
                };    
            }
            else            
                return null;            
        }
        public static ClientDto ToClientDto(this User user)
        {
            if (user != null)
            {
                return new ClientDto
                {
                    Id = user.Id,
                    CompanyName = user.CompanyName,
                    NIP = user.NIP,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    City=user.City,
                    Address=user.Address,
                    PhoneNumber = user.PhoneNumber,
                    Email = user.Email
                };
            }
            else            
                return null;
        }
    }
}