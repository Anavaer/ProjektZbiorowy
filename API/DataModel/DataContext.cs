using API.DataModel.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.DataModel
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}