using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Office.API.Data;
using Office.API.Dtos;
using Office.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Office.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        readonly IAuthRepository _repository;
        readonly IConfiguration _config;
        readonly DataContext _context;
        public AuthController(IAuthRepository repository, IConfiguration config, DataContext context)
        {
            _repository = repository;
            _config = config;
            _context = context;
        }

//Register
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {

            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            userRegisterDto.Username = userRegisterDto.Username.ToLower();

            if(await _repository.UserExists(userRegisterDto.Username))
            return BadRequest("Username already exists");

            var userToCreate = new User
            {
                Username = userRegisterDto.Username,
                Email = userRegisterDto.Email,
                userRole = (int)Models.User.Role.SysOp
            };

            var createdUser = await _repository.Register(userToCreate, userRegisterDto.Password, true);

            return StatusCode(201);
        }

//LOGIN
        
        [HttpPost("login")]
        public async Task<IActionResult>Login(UserLoginDto userLoginDto)
        {
            var userFromRepo = await _repository.Login(userLoginDto.Username, userLoginDto.Password);

            if(userFromRepo == null)
                return Unauthorized();

            return Ok(new {
                token = CreateToken(userFromRepo)
            });
        }



        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var val = await _repository.GetUsers();

            return Ok(val);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUser(int ID)
        {
            var val = await _repository.GetUser(ID);

            return Ok(val);
        }

        string CreateToken(User user)
        {
            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.userRole.ToString()),
                new Claim(ClaimTypes.GivenName, user.WorkerID.ToString()),
                new Claim(ClaimTypes.GroupSid, user.OfficeID.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}