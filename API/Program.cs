using System;
using System.Threading.Tasks;
using API.DataModel;
using API.DataModel.Entities.AspNetIdentity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            var services = host.Services.CreateScope().ServiceProvider;
            try
            {
                await services.GetRequiredService<DataContext>().Database.MigrateAsync();
                await DataSeeder.Seed(services.GetRequiredService<UserManager<User>>(),
                                      services.GetRequiredService<RoleManager<Role>>());
            }
            catch (Exception e)
            {
                services.GetRequiredService<ILogger<Program>>()
                        .LogError(e, "Error has occuring when performing migration or seeding data.");
            }
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
