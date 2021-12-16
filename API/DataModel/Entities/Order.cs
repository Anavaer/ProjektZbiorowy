using API.DataModel.Entities.AspNetIdentity;
using API.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.DataModel.Entities
{
    public class Order
    {
        // TODO: Add relation to ServicePrices and TotalPrice property
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }
        [ForeignKey("User")]
        public int ClientId { get; set; }
        [Range(1930, 2050, ErrorMessage = "Value for the year must be between 1930 and 2050")]
        public DateTime ServiceDate { get; set; }
        public int OrderStatusId { get; set; }
        [MaxLength(30)]
        public string City { get; set; }
        [MaxLength(75)]
        public string Address { get; set; }
        [Required]
        public int Area { get; set; }
        [ForeignKey("User")]
        public int? EmployeeId { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public float TotalPrice { get; set; }

        // Navigation Properties
        public virtual User Client { get; set; }
        public virtual OrderStatus OrderStatus { get; set; }
        public virtual User Employee { get; set; }
        public virtual ICollection<OrderToServicePrice> OrderToServicePrice { get; set; }
    }
}
