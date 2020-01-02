using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Office.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Office.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }

//LOGIN
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x=>x.Username == username);
            if(user == null)
                return null;

            var culture = CultureInfo.CurrentCulture.Name;

            if(!VerifiedPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        private bool VerifiedPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i =0; i < computedHash.Length; i++)
                {
                    if((computedHash[i] != passwordHash[i])) return false;
                }
            }

            return true;
        }

//REGISTER
        public async Task<User> Register(User user, string password, bool withOffice)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            if(withOffice)
            {
                var task = await _context.Office.AddAsync(new Enterprise());
                var Office = task.Entity;

                await _context.SaveChangesAsync();

                user.OfficeID = Office.Id;
                Office.UserId = user.Id;
            }

            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }

        public async Task<bool> UserIsValid(string username, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Username == username);
            if(user == null)
                return false;
            else
            {
                return VerifiedPasswordHash(password, user.PasswordHash, user.PasswordSalt);
            }
        }

        

//USER EXISTS
        public async Task<bool> UserExists(string username)
        {
            if(await _context.Users.CountAsync() == 0)
                return false;
            bool exists = await _context.Users.AnyAsync(x=> x.Username == username);
            
            return exists;
        }

        public async Task<User> GetUser(int i)
        {
            return await _context.Users.SingleOrDefaultAsync(x=>x.Id == i);
        }
        

        public async Task<List<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<Worker> GetWorkerFromUser(int i)
        {
            return await _context.Workers.SingleOrDefaultAsync(x=>x.Id == i);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }


    }
}