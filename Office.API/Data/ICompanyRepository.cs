using System.Collections.Generic;
using System.Threading.Tasks;
using Office.API.Models;

namespace Office.API.Data
{
    public interface IOfficeRepository
    {
         void Add<T>(T entity) where T: class; 
         void Delete<T>(T entity) where T: class;
         Task<bool>SaveAll();
         Task<IEnumerable<User>> GetUsers();

         Task<User>GetUser(int id);

    }
}