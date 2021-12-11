using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities.AspNetIdentity;
using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IJwtTokenService jwtTokenService;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, IJwtTokenService jwtTokenService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.jwtTokenService = jwtTokenService;
        }

        [HttpPost("sign-up")]
        public async Task<ActionResult<IdentityDto>> SignUp(SignUpDto signUpDto)
        {
            if (await this.userManager.FindByNameAsync(signUpDto.Username) != null)
            {
                return BadRequest("This username is already taken.");
            }

            var user = new User
            {
                UserName = signUpDto.Username
            };

            var signUpResult = await this.userManager.CreateAsync(user, signUpDto.Password);
            if (!signUpResult.Succeeded)
            {
                return BadRequest(signUpResult.Errors);
            }

            var addToDefaultRoleResult = await this.userManager.AddToRoleAsync(user, "Client");
            if (!addToDefaultRoleResult.Succeeded)
            {
                return BadRequest(addToDefaultRoleResult.Errors);
            }

            return Ok(new IdentityDto
            {
                Username = user.UserName,
                Token = await this.jwtTokenService.NewJwtToken(user)
            });
        }

        // [HttpPost("sign-in")]
        // public async Task<ActionResult<IdentityDto>> SignIn()
        // {
        //     return Ok();
        // }
    }
}