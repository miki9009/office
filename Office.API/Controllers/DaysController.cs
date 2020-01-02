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
    public class DaysController : ControllerBase
    {
        readonly DataContext _context;
        readonly IAuthRepository _repository;

        public DaysController(DataContext context, IAuthRepository repository)
        {
            _context = context;
            _repository = repository;
        }


        [HttpGet]
        public async Task<IActionResult> GetDays([FromQuery]int id, [FromQuery]int year, [FromQuery]int month)
        {
            var days = await _context.Days.Where(x => x.WorkerID == id && x.Year == year && x.Month == month).ToListAsync();
            return Ok(days);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(DayRecord[] days)
        {
            if(days == null) return StatusCode(400);

            var daysList = days.ToList();
            var dayRecords = _context.Days.Where(x => x.WorkerID == days[0].WorkerID && x.Month == days[0].Month && x.Year == days[0].Year);

            foreach(var dayRecord in dayRecords)
            {
                for (int i = 0; i < daysList.Count; i++)
                {
                    if(daysList[i].Day == dayRecord.Day)
                    {
                        dayRecord.DayType = days[i].DayType;
                        daysList.RemoveAt(i);
                    }
                }
            } 

            await _context.Days.AddRangeAsync(daysList);

            await _context.SaveChangesAsync();
      
            return StatusCode(201);
        }

        [HttpPut]
        //PUT 
        public async Task<IActionResult> Put(int id, DayRecord day)
        {
            if(day == null) return StatusCode(400);

            var dayData = await _context.Days.SingleOrDefaultAsync(x => x.Id == id);

            if(dayData == null) return StatusCode(400);

            dayData.DayType = day.DayType;

            await _context.SaveChangesAsync();

            return StatusCode(201);
        }
    }
}