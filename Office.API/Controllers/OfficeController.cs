using System;
using System.Threading.Tasks;
using Office.API.Data;
using Office.API.Dtos;
using Office.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;


namespace Office.API.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeController : ControllerBase
    {
        readonly DataContext _context;


        public OfficeController(DataContext context, IAuthRepository repository)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> Get()
        {
            var enterprise = await _context.Office.ToListAsync();
            return Ok(enterprise);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var enterprise = await _context.Office.SingleOrDefaultAsync(x => x.Id == id);
            return Ok(enterprise);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(Enterprise enterprise )
        {
             if(!ModelState.IsValid)
             {
                 return StatusCode(404);
             }

            await _context.Office.AddAsync(enterprise);

            await _context.SaveChangesAsync();
      
            return StatusCode(201);
        }

        [HttpPut]
        //PUT 
        public async Task<IActionResult> Put(int id, Enterprise enterprise)
        {
            if(!ModelState.IsValid)
            {
                return StatusCode(404);
            }

            var _entry = await _context.Office.SingleOrDefaultAsync(x => x.Id == id);

            if(_entry == null) return StatusCode(400);

            _entry.KRS = enterprise.KRS;
            _entry.Mobile = enterprise.Mobile;
            _entry.Name = enterprise.Name;
            _entry.NIP = enterprise.NIP;
            _entry.PhoneNumber = enterprise.PhoneNumber;
            _entry.PostCode = enterprise.PostCode;
            _entry.REGON = enterprise.REGON;
            _entry.BankAccount = enterprise.BankAccount;
            _entry.City = enterprise.City;
            _entry.DetailAddress = enterprise.DetailAddress;
            _entry.Email = enterprise.Email;            
            _entry.PESEL = enterprise.PESEL;

            await _context.SaveChangesAsync();

            return Ok(_entry);
        }
    }
}