using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.DataModel.Entities
{
    public class ServicePrice
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Description { get; set; }
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public float UnitPrice { get; set; }
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public float PriceRatio { get; set; }

        public virtual ICollection<OrderToServicePrice> OrderToServicePrice { get; set; }
    }
}