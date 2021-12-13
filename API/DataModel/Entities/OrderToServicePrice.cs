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
        [Column(Order = 0)]
        public int OrderId { get; set; }       
        [Column(Order = 1)]
        public int ServicePriceId {get;set;}
        //--------------------------------Navigation-------------------------
        public virtual Order Order { get; set;}
        public virtual ServicePrice ServicePrice { get; set; }
    }
}
