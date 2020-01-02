using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Office.API.Data;
using Microsoft.AspNetCore.Authorization;
using Office.API.Models;
using System.Threading.Tasks;
using System.Linq;

namespace Office.API.Controllers
{
   [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : Controller
    {
        readonly DataContext _context;
        public TasksController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(WorkerTask workerTask)
        {
            if(workerTask == null) return StatusCode(400);

            var task = new WorkerTask()
            {
                WorkerId = workerTask.WorkerId,
                Title = workerTask.Title,
                Description = workerTask.Description,
                DateAdded = System.DateTime.Now,
                Priority = workerTask.Priority,
                OrderingPersonId = workerTask.OrderingPersonId,
                Deadline = workerTask.Deadline,
                State = workerTask.State,
                Time = workerTask.Time,
                OfficeID = workerTask.OfficeID
            };

            await _context.Tasks.AddAsync(task);

            await _context.SaveChangesAsync();
            return Ok(task);
        }

        // [HttpPut]
        // public async Task<IActionResult> Edit(WorkerTask task, int id)
        // {
        //     var taskContext = await _context.Tasks.SingleOrDefaultAsync(x => x.Id == id);
        //     if(taskContext != null && task != null)
        //     {
        //         taskContext.Description = task.Description;
        //         taskContext.State = task.State;
        //         await _context.SaveChangesAsync();
        //     }
        //     return Ok(taskContext);
        // }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, WorkerTask workerTask)
        {
            if(workerTask == null)
                return StatusCode(400);

            var contextTask = await _context.Tasks.SingleOrDefaultAsync(x => x.Id == id);
            if(contextTask == null)
                return StatusCode(400);

            contextTask.State = workerTask.State;
            await _context.SaveChangesAsync();
            return Ok(contextTask);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAllTasks(int id)
        {
            var worker = await _context.Workers.SingleOrDefaultAsync(x => x.Id == id);
            if(worker != null)
            {
                var tasks = await _context.Tasks.Where(x => x.WorkerId == worker.Id).ToListAsync();
                return Ok(tasks);
            }
            return StatusCode(400);
        }

        [HttpGet("all/{id}")]
        public async Task<IActionResult> GetAllOfficeTasks(int id)
        {
            var tasks = await _context.Tasks.Where(x => x.OfficeID == id).ToListAsync();
            return Ok(tasks);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.SingleOrDefaultAsync(x => x.Id == id);
            if(task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }

            return StatusCode(200);
        }
        
    }
}