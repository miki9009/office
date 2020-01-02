using System;

namespace Office.API.Models
{
    public class WorkerDetail
    {
        public int Id { get; set; }
        public int WorkerID { get; set; }

        public string PrivatePhoneNumber {get; set;}

        public string WorkPhoneNumber {get;set;}

        public double Salary {get; set;}

        public string City {get; set;}

        public string Street {get; set;}

        public string PostCode {get;set;}

        public string HomeNumber {get;set;}


        
    }
}