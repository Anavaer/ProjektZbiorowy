using API.DataModel.Entities;
using API.DataModel.Entities.AspNetIdentity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.DataModel
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>,
                                                 IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<ServicePrice> ServicePrices { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // User-to-Role relation config for ASP.NET Identity
            builder.Entity<User>().HasMany(r => r.UserRoles).WithOne(u => u.User)
                                  .HasForeignKey(u => u.UserId).IsRequired();

            builder.Entity<Role>().HasMany(r => r.UserRoles).WithOne(r => r.Role)
                                  .HasForeignKey(r => r.RoleId).IsRequired();
        }
    }
}