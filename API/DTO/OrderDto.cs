using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using API.Utils;
using API.Utils.CustomValidation;

namespace API.DTO
{
    public class OrderDto
    {
        [Required]
        [DatesNotEmptyAndNotBeforeNow(ErrorMessage = "ServiceDates cannot be empty and all dates must be later than now.")]
        public IList<DateTime> ServiceDates { get; set; }
        [MaxLength(30)]
        [Required]
        public string City { get; set; }
        [MaxLength(75)]
        [Required]
        public string Address { get; set; }
        [Required]
        [IntGreaterOrEqualTo(2)]
        public int Area { get; set; }
        [ListRequiredAndNotEmpty(ErrorMessage = "ServicePriceIds cannot be empty.")]
        public IList<int> ServicePriceIds { get; set; }
    }
}