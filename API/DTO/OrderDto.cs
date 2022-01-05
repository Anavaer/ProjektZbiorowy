using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using API.Utils;
using API.Utils.CustomValidation;

namespace API.DTO
{
    public class OrderDto
    {
        [Required(ErrorMessage = "Pole Daty Realizacji są wymagane.")]
        [DatesNotEmptyAndNotBeforeNow(ErrorMessage = "Daty Realizacji nie mogą być puste i muszą być późniejsze niż obecna data.")]
        public IList<DateTime> ServiceDates { get; set; }
        [MaxLength(30, ErrorMessage = "Maksymalna długość dla pola Miasto to 30 znaków.")]
        [Required(ErrorMessage = "Pole Miasto jest wymagane.")]
        public string City { get; set; }
        [MaxLength(75, ErrorMessage = "Maksymalna długość dla pola Adres to 75 znaków.")]
        [Required(ErrorMessage = "Pole Adres jest wymagane.")]
        public string Address { get; set; }
        [Required(ErrorMessage = "Pole Metraż jest wymagane.")]
        [IntGreaterOrEqualTo(1, ErrorMessage = "Metraż musi być większy od 0.")]
        public int Area { get; set; }
        [ListRequiredAndNotEmpty(ErrorMessage = "Pole Usługi jest wymagane.")]
        public IList<int> ServicePriceIds { get; set; }
    }
}