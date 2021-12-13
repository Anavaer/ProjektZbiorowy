using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace API.DataModel
{
    public interface IGenericRepo<TEntity> where TEntity : class
    {
        public Task Insert(TEntity ld);
        public Task Update(TEntity ld);
        public Task<IEnumerable<TEntity>> GetAll(
                 Expression<Func<TEntity, bool>> filter = null,
                 Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                 Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> includes = null
                 );
        public Task<TEntity> Get(Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> includes = null);
        public Task<TEntity> Get(int id);
        public void Delete(int id);
        public void Delete(Expression<Func<TEntity, bool>> filter = null);
        public void Delete(TEntity entityToDelete);
        public Boolean IsExist(int id);
        public Boolean IsExist(Expression<Func<TEntity, bool>> filter);       
    }
}
