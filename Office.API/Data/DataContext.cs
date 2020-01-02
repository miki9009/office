using Microsoft.EntityFrameworkCore;
using Office.API.Models;

namespace Office.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Worker> Workers {get;set;}
        public DbSet<WorkerTask> Tasks {get;set;}

        public DbSet<TimeRecord> TimeRecords {get;set;}
        public DbSet<WorkerDetail> WorkersDetails {get;set;}
        public DbSet<DayRecord> Days {get;set;}

        public DbSet<Message> Messages {get;set;}

        public DbSet<Enterprise> Office {get; set;}

        public DbSet<TimeTableRecord> TimeTableRecords { get; set; }
    }
}