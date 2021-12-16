using System;
using System.ComponentModel.DataAnnotations;

namespace API.Utils.CustomValidation
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class IntGreaterOrEqualTo : ValidationAttribute
    {
        private readonly int number;

        public IntGreaterOrEqualTo(int number)
        {
            this.number = number;
        }

        public override bool IsValid(object value)
        {
            return (int)value > number;
        }
    }
}