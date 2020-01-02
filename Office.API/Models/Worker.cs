using System;

namespace Office.API.Models
{
    public class Worker
    {      
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set;}
        public DateTime LastLogin { get; set; }
        public string JobPosition {get; set;}
        public string Supervisor { get; set; }
        public bool CheckedIn {get;set;}
        public int UserID {get; set;}
        public bool unReadMessage {get; set;}
        public int OfficeID {get; set;}

    }
}