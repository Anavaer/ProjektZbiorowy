using System.Linq;
using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities;
using API.DataModel.Entities.AspNetIdentity;
using API.DTO;
using Microsoft.AspNetCore.Authorization;
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
        private readonly IUnitOfWork unitOfWork;
        private readonly IGenericRepo<ServicePrice> servicesRepo;

        public AdminController(UserManager<User> userManager, IUnitOfWork unitOfWork)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
            this.servicesRepo = this.unitOfWork.Repo<ServicePrice>();
        }

        [Authorize(Roles = "Administrator")]
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

        [Authorize(Roles = "Administrator")]
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

        [Authorize(Roles = "Administrator")]
        [HttpPut("edit-role/{id}")]
        public async Task<ActionResult> EditRole(int id, [FromQuery] string roles)
        {
            var user = await this.userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                return NotFound("Nie znaleziono u??ytkownika.");
            }

            var rolesToSet = roles?.Split(",").ToList();

            if (rolesToSet.Count == 0)
            {
                return NotFound("Nie znaleziono r??l.");
            }

            var currentRoles = await this.userManager.GetRolesAsync(user);

            if (!(await this.userManager.RemoveFromRolesAsync(user, currentRoles)).Succeeded)
            {
                return BadRequest("Wyst??pi?? b????d podczas usuwania obecnych r??l.");
            }

            if (!(await this.userManager.AddToRolesAsync(user, rolesToSet)).Succeeded)
            {
                return BadRequest("Wyst??pi?? b????d podczas dodawania nowych r??l.");
            }

            return NoContent();
        }

        [Authorize]
        [HttpGet("services")]
        public async Task<ActionResult> GetServices()
        {
            return Ok((await this.servicesRepo.GetAll()).Select(s => new
            {
                s.Id,
                s.Description,
                s.PriceRatio
            }).ToList());
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("add-service")]
        public async Task<ActionResult> AddService(ServiceAddAndEditDto serviceDto)
        {
            var service = new ServicePrice
            {
                Description = serviceDto.Description,
                PriceRatio = serviceDto.PriceRatio
            };

            await this.servicesRepo.Insert(service);

            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Wyst??pi?? b????d podczas dodawania us??ugi.");
            }

            return NoContent();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut("edit-service/{id}")]
        public async Task<ActionResult> EditService(int id, ServiceAddAndEditDto serviceDto)
        {
            var service = await this.servicesRepo.Get(s => s.Id == id);

            if (service == null)
            {
                return NotFound("Nie znaleziono us??ugi.");
            }

            service.Description = serviceDto.Description;
            service.PriceRatio = serviceDto.PriceRatio;

            await this.servicesRepo.Update(service);

            if (!(await this.unitOfWork.Save()))
            {
                return BadRequest("Wyst??pi?? b????d podczas edytowania us??ugi.");
            }

            return NoContent();
        }
    }
}