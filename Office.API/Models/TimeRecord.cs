using System;

namespace Office.API.Models
{
    public class TimeRecord
    {
        public int ID { get; set; }

        public int WorkerID {get;set;}
        public string Day {get;set;}

        public DateTime StartDate {get; set;}

        public DateTime EndTime {get; set;}

        public double Total { get; set; }

        public string Notes {get; set;}

        public bool ClockedOut { get; set; }

        public int ControlSum {get; set; }
    }
}