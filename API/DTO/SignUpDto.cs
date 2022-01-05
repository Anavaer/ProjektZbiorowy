using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class SignUpDto
    {
        [Required(ErrorMessage = "Nazwa użytkownika jest wymagana.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Hasło jest wymagane.")]
        [MinLength(8, ErrorMessage = "Minimalna długość hasła to 8 znaków.")]
        public string Password { get; set; }

        public string CompanyName { get; set; }
        public string NIP { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
    }
}