using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using API.DataModel.Entities.AspNetIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System;
using Microsoft.Extensions.Configuration;

namespace API.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly SymmetricSecurityKey key;
        private readonly UserManager<User> userManager;

        public JwtTokenService(UserManager<User> userManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtToken"]));
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
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature),
                Expires = DateTime.Now.AddMinutes(15)
            }));
        }
    }
}