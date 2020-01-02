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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        readonly DataContext _context;
        readonly IAuthRepository _repository;

        public WorkersController(DataContext context, IAuthRepository repository)
        {
            _context = context;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWorkers()
        {
            var workers = await _context.Workers.ToListAsync();
            return Ok(workers);
        }

        [HttpGet("select/{id}")]
        public async Task<IActionResult> GetAllWorkers(int id)
        {
            var workers = await _context.Workers.Where(x=>x.OfficeID == id).ToListAsync();
            return Ok(workers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorker(int id)
        {
            var c = await _context.Workers.SingleOrDefaultAsync(x=> x.Id == id);
            return Ok(c);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post(CreateWorkerDto createWorkerDto)
        {
            var worker = new Worker()
            {
                Name = createWorkerDto.Name, 
                Surname = createWorkerDto.Surname, 
                Supervisor = createWorkerDto.Supervisor,
                OfficeID = createWorkerDto.OfficeID,
            };


            var user = await AddUserFromWorker(createWorkerDto, createWorkerDto.Password);
            
            worker.UserID = user.Id;
            
            await _context.Workers.AddAsync(worker);
            
            await _context.SaveChangesAsync();

            user.WorkerID = worker.Id;
            var workerDetail = new WorkerDetail()
            {
                WorkerID = worker.Id
            };

            await _context.WorkersDetails.AddAsync(workerDetail);

            await _context.SaveChangesAsync();
      
            return StatusCode(201);
        }

        async Task<User> AddUserFromWorker(CreateWorkerDto createWorkerDto, string password)
        {
            var user = new User()
            {
                userRole = (int)Models.User.Role.Worker,
                Username = createWorkerDto.Username,
                Email = createWorkerDto.Email,
                OfficeID = createWorkerDto.OfficeID
            };

            return await _repository.Register(user, password, false);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorker(int id, Worker worker)
        {
            var w = await _context.Workers.SingleOrDefaultAsync(x => x.Id == id);
            if(w == null)
            {
                return StatusCode(404);
            }

            w.JobPosition = worker.JobPosition;
            w.Name = worker.Name;
            w.Supervisor = worker.Supervisor;
            w.Surname = worker.Surname;
            w.JobPosition = worker.JobPosition;

            await _context.SaveChangesAsync();

            return Ok(w);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var _worker = await _context.Workers.SingleOrDefaultAsync(x=>x.Id == id);
            if(_worker != null)
            {
                var workerDetail = await _context.WorkersDetails.SingleOrDefaultAsync(x => x.WorkerID == _worker.Id);
                if(workerDetail != null)
                    _context.WorkersDetails.Remove(workerDetail);
                    
                var user = await _context.Users.SingleOrDefaultAsync(x=>x.Id == _worker.UserID);
                if(user != null)
                    _context.Users.Remove(user);

                _context.Workers.Remove(_worker);                
                await _context.SaveChangesAsync();
                return StatusCode(200);
            }
            return StatusCode(404);
        }

        [HttpPut("clockout/{id}")]
        public async Task<IActionResult> ClockOutBody(int id, NewTimeRekordDTO timeRekordDTO)
        {
            var worker = await _context.Workers.SingleOrDefaultAsync(x => x.Id == id);
            if(worker != null)
            {
                worker.CheckedIn = false;

                TimeRecord timeRecord = await _context.TimeRecords.SingleOrDefaultAsync(x => x.WorkerID == worker.Id && !x.ClockedOut);
                if(timeRecord != null)
                {
                    timeRecord.ClockedOut = true;
                    timeRecord.EndTime = DateTime.Now;
                    timeRecord.Notes = timeRekordDTO.notes;
                    var span = (timeRecord.EndTime - timeRecord.StartDate);
                    
                    timeRecord.Total = Math.Round(span.TotalHours, 2);
                }

                await _context.SaveChangesAsync();
            }

            return Ok(worker);
        }

        [HttpGet("clockin/{id}")]
        public async Task<IActionResult> ClockIn(int id)
        {
            var worker = await _context.Workers.SingleOrDefaultAsync(x => x.Id == id);
            if(worker != null)
            {
                worker.CheckedIn = true;
                var dateNow = DateTime.Now;
                worker.LastLogin = dateNow;
                TimeRecord timeRecord = new TimeRecord();

                timeRecord = new TimeRecord()
                {
                    WorkerID = worker.Id,
                    StartDate = dateNow,
                    Day = dateNow.DayOfWeek.ToString(),  
                    ControlSum = dateNow.Year * 10000 + dateNow.Month * 100 + dateNow.Day            
                };

                var dayRecord = await _context.Days.SingleOrDefaultAsync(x => x.WorkerID == worker.Id && x.Year == dateNow.Year && x.Month == (dateNow.Month-1) && x.Day == dateNow.Day);
                if(dayRecord == null)
                {
                    dayRecord = new DayRecord()
                    {
                        WorkerID = worker.Id,
                        Year = dateNow.Year,
                        Month = dateNow.Month-1,
                        Day = dateNow.Day,
                        DayType = 1
                    };
                    await _context.Days.AddAsync(dayRecord);
                }
            

                await _context.TimeRecords.AddAsync(timeRecord);

                await _context.SaveChangesAsync();
            }
            return Ok(worker);
        }

        [HttpPut("details/{id}")]
        public async Task<IActionResult> UpdateWorkerDetail(int id, WorkerDetail workerDetail)
        {
            var dataDetails = await _context.WorkersDetails.SingleOrDefaultAsync(x => x.Id == id);
            if(dataDetails != null)
            {
                dataDetails.HomeNumber = workerDetail.HomeNumber;
                dataDetails.PostCode = workerDetail.PostCode;
                dataDetails.PrivatePhoneNumber = workerDetail.PrivatePhoneNumber;
                dataDetails.WorkPhoneNumber = workerDetail.WorkPhoneNumber;
                dataDetails.Salary = workerDetail.Salary;
                dataDetails.Street = workerDetail.Street;
                dataDetails.City = workerDetail.City;
                await _context.SaveChangesAsync();
                return Ok(dataDetails);
            }
            else
            {
                return StatusCode(404);
            }
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetWorkerDetail(int id)
        {
            var dataDetails = await _context.WorkersDetails.SingleOrDefaultAsync(x => x.WorkerID == id);
            if(dataDetails != null)
                return Ok(dataDetails);
            
            return StatusCode(404);
        }
    }
}