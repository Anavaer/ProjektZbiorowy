using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class SignInDto
    {
        [Required(ErrorMessage = "Nazwa użytkownika jest wymagana.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Hasło jest wymagane.")]
        public string Password { get; set; }
    }
}