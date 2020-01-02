using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Office.API.Models
{
    public class User
    {
        public enum  Role
        {
            SysOp = 0,
            Head = 1,
            Supervisor = 2,
            Worker = 3
        }

        public int Id{get;set;}
        public string Email { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public int userRole {get; set;}
        [ForeignKey("Worker")]
        public int WorkerID {get;set;}
        public int OfficeID { get; set; }
        public ICollection<Worker> Workers { get; set; }
 
    }
}