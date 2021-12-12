using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class SignInDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}