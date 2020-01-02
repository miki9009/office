using System;

namespace Office.API.Dtos
{
    public class CreateWorkerDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }

        public string Supervisor {get; set; }

        public string Password {get; set; }

        public string Username {get; set;}

        public string Email {get; set;}

        public int OfficeID {get; set;}

    }
}