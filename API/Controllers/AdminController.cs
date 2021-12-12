using System.Linq;
using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities.AspNetIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> userManager;
        private readonly DataContext dataContext;

        public AdminController(UserManager<User> userManager, DataContext dataContext)
        {
            this.userManager = userManager;
            this.dataContext = dataContext;
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetUsers()
        {
            return Ok(await this.userManager.Users.Include(r => r.UserRoles)
                                                  .ThenInclude(r => r.Role)
                                                  .Select(u => new
                                                  {
                                                      u.Id,
                                                      u.FirstName,
                                                      u.LastName,
                                                      u.CompanyName,
                                                      Roles = u.UserRoles.Select(r => r.Role.Name).ToList()

                                                  })
                                                  .ToListAsync());
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult> GetUser(int id)
        {
            return Ok(await this.userManager.Users.Where(u => u.Id == id)
                                                  .Include(r => r.UserRoles)
                                                  .ThenInclude(r => r.Role)
                                                  .Select(u => new
                                                  {
                                                      u.Id,
                                                      u.FirstName,
                                                      u.LastName,
                                                      u.City,
                                                      u.Address,
                                                      u.CompanyName,
                                                      u.NIP,
                                                      Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                                                  })
                                                  .SingleAsync());
        }


        [HttpPost("edit-role/{id}")]
        public async Task<ActionResult> EditRole(int userId, [FromQuery] string roles)
        {
            var user = await this.userManager.FindByIdAsync(userId.ToString());

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var rolesToSet = roles?.Split(",").ToList();

            if (rolesToSet.Count == 0)
            {
                return NotFound("No roles to be set.");
            }

            var currentRoles = await this.userManager.GetRolesAsync(user);

            if (!(await this.userManager.RemoveFromRolesAsync(user, currentRoles)).Succeeded)
            {
                return BadRequest("Error has occurred when removing current roles.");
            }

            if (!(await this.userManager.AddToRolesAsync(user, rolesToSet)).Succeeded)
            {
                return BadRequest("Error has occurred when adding new roles.");
            }

            return NoContent();
        }

        [HttpGet("services")]
        public async Task<ActionResult> GetServices()
        {
            return Ok(await this.dataContext.ServicePrices.Select(s => new
            {
                s.Id,
                s.Description,
                s.UnitPrice,
                s.PriceRatio
            }).ToListAsync());
        }

        // AddService
        // EditService
    }
}