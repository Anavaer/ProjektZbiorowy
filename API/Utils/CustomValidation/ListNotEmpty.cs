using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace API.Utils.CustomValidation
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class ListNotEmpty : ValidationAttribute
    {

        public ListNotEmpty() { }

        public override bool IsValid(object value)
        {
            var list = value as IList;

            if (list == null || list.Count < 1)
            {
                return false;
            }

            return true;
        }
    }
}