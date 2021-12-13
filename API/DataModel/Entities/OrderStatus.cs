using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataModel.Entities
{
    public class OrderStatus
    {
        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderStatusId { get; set;}
        [MaxLength(50)]
        [Required]
        public string Description { get; set;}              
    }
}
