using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataModel.Entities.AspNetIdentity
{
    public class OrderToServicePrice
    {
        [Key]
        [Column(Order = 0)]
        public int OrderId { get; set; }
        [Key]
        [Column(Order = 1)]
        public int ServicePriceId {get;set;}
    }
}
