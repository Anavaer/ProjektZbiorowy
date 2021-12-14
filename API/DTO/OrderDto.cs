using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class OrderDto
    {
        [Required]
        public List<DateTime> ServiceDates { get; set; }
        [MaxLength(30)]
        [Required]
        public string City { get; set; }
        [MaxLength(75)]
        [Required]
        public string Address { get; set; }
        [Required]
        public int Area { get; set; }
    }
}