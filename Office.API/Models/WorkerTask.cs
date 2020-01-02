using System;

namespace Office.API.Models
{
    public class WorkerTask
    {
        public int Id { get; set; }
        public int WorkerId { get; set; }
        public string Title {get;set;}
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public int Priority { get; set; }
        public int OrderingPersonId { get; set; }
        public DateTime Deadline { get; set; }
        public int State {get; set;}
        public string Time {get;set;}
        public int OfficeID {get;set;}
    }
}