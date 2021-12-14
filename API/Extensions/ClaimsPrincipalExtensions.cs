using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int GetId(this ClaimsPrincipal claimsPrincipal)
        {
            int id;
            if (int.TryParse(claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value, out id))
            {
                return id;
            }
            else
            {
                throw new System.FormatException("Invalid user's Id found in claims. Please verify if the user is authenticated.");
            }

        }
    }
}