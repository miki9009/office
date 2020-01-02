using System.Collections.Generic;
using System.Threading.Tasks;
using Office.API.Models;

namespace Office.API.Data
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password, bool withOffice);
        Task<User> Login(string username, string password);
        Task<bool> UserExists(string username);

        Task<bool> UserIsValid(string username, string password);

        Task<User> GetUser(int i);

        Task<Worker> GetWorkerFromUser(int i);

        Task<List<User>> GetUsers();

        Task SaveChangesAsync();
    }
}