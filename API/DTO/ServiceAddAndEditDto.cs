using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class ServiceAddAndEditDto
    {
        [Required(ErrorMessage = "Pole Opis jest wymagane.")]
        [MaxLength(50, ErrorMessage = "Maksymalna długość dla pola Opis to 50 znaków.")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Pole opis jest wymagane.")]
        public float PriceRatio { get; set; }
    }
}