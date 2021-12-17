using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace API.Utils
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class DatesNotEmptyAndNotBeforeNow : ValidationAttribute
    {
        public DatesNotEmptyAndNotBeforeNow() { }

        public override bool IsValid(object value)
        {
            var dates = value as IList;

            if (dates == null || dates.Count < 1)
            {
                return false;
            }

            foreach (var date in dates)
            {
                if ((DateTime)date < DateTime.Now)
                {
                    return false;
                }
            }

            return true;
        }
    }
}