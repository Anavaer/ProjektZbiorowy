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
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderToServicePrice> OrderToServicePrices { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // User-to-Role relation config for ASP.NET Identity
            builder.Entity<User>().HasMany(r => r.UserRoles).WithOne(u => u.User)
                                  .HasForeignKey(u => u.UserId).IsRequired();

            builder.Entity<Role>().HasMany(r => r.UserRoles).WithOne(r => r.Role)
                                  .HasForeignKey(r => r.RoleId).IsRequired();

            // Clustered keys
            builder.Entity<OrderToServicePrice>()
                   .HasKey(c => new { c.OrderId, c.ServicePriceId });

            // Seed dictionaries
            builder.Entity<OrderStatus>().HasData(
                  new { OrderStatusId = 1, Description = "NEW" },
                  new { OrderStatusId = 2, Description = "CONFIRMED" },
                  new { OrderStatusId = 3, Description = "ONGOING" },
                  new { OrderStatusId = 4, Description = "COMPLETED" },
                  new { OrderStatusId = 5, Description = "CANCELED" }
                  );
        }
    }
}