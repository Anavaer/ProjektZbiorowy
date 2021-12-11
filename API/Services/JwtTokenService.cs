using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using API.DataModel.Entities.AspNetIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Linq;
using System;

namespace API.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly SymmetricSecurityKey securityKey;
        private readonly UserManager<User> userManager;

        public JwtTokenService(UserManager<User> userManager)
        {
            this.userManager = userManager;
            this.securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("FQjjBTpMCmaK2QYK8VRP"));
        }

        public async Task<string> NewJwtToken(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var roles = await this.userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var jwtHandler = new JwtSecurityTokenHandler();
            return jwtHandler.WriteToken(jwtHandler.CreateToken(new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512Signature),
                Expires = DateTime.Now.AddMinutes(15)
            }));
        }
    }
}