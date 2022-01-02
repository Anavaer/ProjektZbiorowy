using System.Collections.Generic;
using API.DataModel.Entities;

namespace API.DataModel.SeedData
{
    public static class ServicePrices
    {
        public static List<ServicePrice> All
        {
            get
            {
                return new List<ServicePrice>
                {
                    new ServicePrice { Description = "Window Cleaning", PriceRatio = 2.0F },
                    new ServicePrice { Description = "Floors", PriceRatio = 1.8F },
                    new ServicePrice { Description = "Dusting", PriceRatio = 1.2F },
                    new ServicePrice { Description = "Washing Dishes", PriceRatio = 0.4F },
                    new ServicePrice { Description = "Laundry", PriceRatio = 0.3F },
                    new ServicePrice { Description = "Ironing", PriceRatio = 0.5F },
                    new ServicePrice { Description = "Bathroom Cleaning", PriceRatio = 0.80F },
                    new ServicePrice { Description = "Kitchen Cleaning", PriceRatio = 0.90F }
                };
            }
        }
    }
}