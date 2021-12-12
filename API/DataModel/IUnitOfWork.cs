using API.DataModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DataModel
{
   
    public interface IUnitOfWork
        {
            IGenericRepo<TEntity> Repo<TEntity>() where TEntity : class;
            Task Save();
            void Dispose();


     }
    
}
