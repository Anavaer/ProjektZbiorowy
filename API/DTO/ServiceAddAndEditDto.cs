using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class ServiceAddAndEditDto
    {
        [Required]
        [MaxLength(50)]
        public string Description { get; set; }
        [Required]
        public float UnitPrice { get; set; }
        [Required]
        public float PriceRatio { get; set; }
    }
}