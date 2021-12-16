using System.ComponentModel.DataAnnotations.Schema;

namespace API.DataModel.Entities
{
    public class OrderToServicePrice
    {
        [Column(Order = 0)]
        public int OrderId { get; set; }
        [Column(Order = 1)]
        public int ServicePriceId { get; set; }

        // Navigation Properties
        public virtual Order Order { get; set; }
        public virtual ServicePrice ServicePrice { get; set; }
    }
}
