using System.Threading.Tasks;
using API.DataModel.Entities.AspNetIdentity;
using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
                return BadRequest("Wybrana nazwa użytkownika jest zajęta.");
            }

            var user = new User
            {
                UserName = signUpDto.Username,
                CompanyName = signUpDto.CompanyName,
                NIP = signUpDto.NIP,
                FirstName = signUpDto.FirstName,
                LastName = signUpDto.LastName,
                City = signUpDto.City,
                Address = signUpDto.Address
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
                Token = await this.jwtTokenService.NewJwtToken(user),
                Id = user.Id
            });
        }

        [HttpPost("sign-in")]
        public async Task<ActionResult<IdentityDto>> SignIn(SignInDto signInDto)
        {
            var user = await this.userManager.FindByNameAsync(signInDto.Username);

            if (user == null)
            {
                return Unauthorized("Użytkownik o wybranej nazwie nie istnieje.");
            }

            if (!(await this.signInManager.CheckPasswordSignInAsync(user, signInDto.Password, lockoutOnFailure: false)).Succeeded)
            {
                return Unauthorized("Nieprawidłowe hasło.");
            }

            return Ok(new IdentityDto
            {
                Username = user.UserName,
                Token = await this.jwtTokenService.NewJwtToken(user),
                Id = user.Id
            });
        }
    }
}