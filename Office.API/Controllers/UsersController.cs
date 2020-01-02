using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Office.API.Data;
using Office.API.Dtos;
using Office.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Office.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        readonly IOfficeRepository _repository;
        readonly IMapper _mapper;
        private readonly DataContext _context;

        public UsersController(IOfficeRepository repository, IMapper mapper, DataContext context)
        {
            _repository = repository;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repository.GetUsers();

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repository.GetUser(id);
            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateuserDto user)
        {
            var userDB = await _context.Users.SingleOrDefaultAsync(x => x.Id == id);
            if(userDB == null)
            {
                return StatusCode(404);
            }

            userDB.Email = user.Email;
            userDB.Username = user.Username;
            await _context.SaveChangesAsync();

            return Ok(userDB);
        }
    }
}