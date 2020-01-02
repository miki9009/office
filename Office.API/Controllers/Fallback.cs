using System.IO;
using Office.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Office.API.Controllers
{
    public class FallBack : ControllerBase
    {
        DataContext _context;
        public FallBack(DataContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
                "wwwroot", "index.html"), "text/HTML");
        }
    }
}