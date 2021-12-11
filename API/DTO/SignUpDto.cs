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
    }
}