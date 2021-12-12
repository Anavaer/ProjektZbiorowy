using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class SignUpDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        public string CompanyName { get; set; }
        public string NIP { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
    }
}