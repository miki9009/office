using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Office.API.Models
{
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id {get;set;}
        public int SenderId { get; set; }
        public int recieverId {get;set;}

        public DateTime Date { get; set; }

        public string MessageContent {get;set;}

        public bool Viewd {get;set;}
    }




}