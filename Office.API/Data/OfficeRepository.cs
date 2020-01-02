using System.Collections.Generic;
using System.Threading.Tasks;
using Office.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Office.API.Data
{
    public class OfficeRepository : IOfficeRepository
    {
        readonly DataContext _context;
        public OfficeRepository(DataContext context)
        {
                _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
                _context.Remove(entity);
        }

        public Task<User> GetUser(int id)
        {
            var user = _context.Users.Include(p => p.Workers).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.Include(p=>p.Workers).ToListAsync();
        }


        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}