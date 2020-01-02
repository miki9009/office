using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Office.API.Models
{
    public class TimeTableRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("UserId_FK")]
        public int UserId {get;set;}
        public int Year { get; set; }
        public byte Month { get; set; }
        public byte Day { get; set; }
        [MaxLength(5)]
        public string Time { get; set; }
        public string Title {get;set;}
        public string Description {get;set;}
        public string UsersAttached {get;set;}

        /*
        0 - not repeating
        1 - repeating everyday
        2 - repeating every week
        3 - repeating every month
         */
        public int Repeating { get; set; }
    }
}