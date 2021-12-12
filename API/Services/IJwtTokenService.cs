using System.Threading.Tasks;
using API.DataModel.Entities.AspNetIdentity;

namespace API.Services
{
    public interface IJwtTokenService
    {
        Task<string> NewJwtToken(User user);
    }
}