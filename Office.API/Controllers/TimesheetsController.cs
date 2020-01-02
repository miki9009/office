using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Office.API.Data;
using Office.API.Dtos;
using Office.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Office.API.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TimesheetsController : ControllerBase
    {
        readonly DataContext _context;

        public TimesheetsController(DataContext context)
        {
            _context = context;
        }

        // GET api/values/5
        [HttpGet("current/{id}")]
        public async Task<IActionResult> GetValue(int id)
        {
            var record = await _context.TimeRecords.SingleOrDefaultAsync(x => x.WorkerID == id && !x.ClockedOut);
            if(record == null)
                return StatusCode(404);
            return Ok(record);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTimesheets(int id)
        {
            var records = await _context.TimeRecords
                .Where(x => x.WorkerID == id)
                .ToListAsync();

            if(records == null)
                return StatusCode(404);
            return Ok(records);
        }

    }
}