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
                    new ServicePrice { Description = "Mycie okien", PriceRatio = 2.0F },
                    new ServicePrice { Description = "Podłogi", PriceRatio = 1.8F },
                    new ServicePrice { Description = "Ścieranie kurzy", PriceRatio = 1.2F },
                    new ServicePrice { Description = "Zmywanie naczyń", PriceRatio = 0.4F },
                    new ServicePrice { Description = "Pranie", PriceRatio = 0.3F },
                    new ServicePrice { Description = "Prasowanie", PriceRatio = 0.5F },
                    new ServicePrice { Description = "Czyszczenie łazienki", PriceRatio = 0.80F },
                    new ServicePrice { Description = "Czyszczenie kuchni", PriceRatio = 0.90F }
                };
            }
        }
    }
}