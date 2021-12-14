using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataModel
{
    public class UnitOfWork : IDisposable, IUnitOfWork
    {
        private DataContext context;       
        public UnitOfWork(DataContext _context)
        {
            context = _context;            
        }
        private Dictionary<Type, object> repositories = new Dictionary<Type, object>();
        public IGenericRepo<TEntity> Repo<TEntity>() where TEntity : class
        {
            if (repositories.Keys.Contains(typeof(TEntity)) == true)
                return repositories[typeof(TEntity)] as IGenericRepo<TEntity>;
            IGenericRepo<TEntity> repo = new GenericRepo<TEntity>(context);
            repositories.Add(typeof(TEntity), repo);
            return repo;
        }
        public async Task<Boolean> Save()
        {
            return await context.SaveChangesAsync() > 0;
        }
        private bool disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
