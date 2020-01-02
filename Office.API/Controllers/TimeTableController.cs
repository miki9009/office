using System.Threading.Tasks;
using Office.API.Data;
using Office.API.Dtos;
using Office.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Office.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TimeTableController : Controller
    {
        readonly DataContext _context;
        public TimeTableController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(TimeTableRecord record)
        {
            if(!ModelState.IsValid)
                return new StatusCodeResult(400);

            var recordNew = new TimeTableRecord()
            {
                Day = record.Day,
                Month = record.Month,
                Year = record.Year,
                Time = record.Time,
                Description = record.Description,
                Title = record.Title,
                UserId = record.UserId,
                Repeating = record.Repeating
            };
        
            await _context.AddAsync(recordNew);

            _context.SaveChanges();

            return new StatusCodeResult(200);
        }

        [HttpGet]
        public async Task<IActionResult> Get(int userId, int year, int month)
        {
            return Ok(await _context.TimeTableRecords.Where(x=> x.UserId == userId && (x.Year == year && x.Month == month || x.Repeating != 0)).ToListAsync());

        }

        [HttpGet("day")]
        public async Task<IActionResult> GetDay(int userId, int year, int month, int day)
        {
            return Ok(await _context.TimeTableRecords.Where(x=> x.UserId == userId && ((x.Year == year && x.Month == month && x.Day == day) || x.Repeating != 0)).ToListAsync());

        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, TimeTableRecord record)
        {
            if(!ModelState.IsValid) {
                return new StatusCodeResult(400);
            }

            var dataRecord = await _context.TimeTableRecords.SingleOrDefaultAsync(x => x.Id == id);
            if(dataRecord != null)
            {
                dataRecord.Day = record.Day;
                dataRecord.Description = record.Description;
                dataRecord.Month = record.Month;
                dataRecord.Time = record.Time;
                dataRecord.Title = record.Title;
                dataRecord.Year = record.Year;
                dataRecord.Repeating = record.Repeating;
                dataRecord.UsersAttached = record.UsersAttached;
                await _context.SaveChangesAsync();
            }
            else
            {
                return new StatusCodeResult(400);
            }

            return Ok(dataRecord);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var record = await _context.TimeTableRecords.SingleOrDefaultAsync(x => x.Id == id);

            if(record != null)
            {
                _context.TimeTableRecords.Remove(record);
                await _context.SaveChangesAsync();
                return Ok(record);
            }
            
            return new StatusCodeResult(400);
        }
    }
}