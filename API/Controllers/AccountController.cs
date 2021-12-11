using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities.AspNetIdentity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext dataContext;

        public AccountController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login()
        {
            var user = await dataContext.Users.FirstOrDefaultAsync();
            return Ok(user);
        }
    }
}