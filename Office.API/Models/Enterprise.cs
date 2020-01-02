using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Office.API.Models
{
    public class Enterprise
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [ForeignKey("User")]
        public int UserId { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }
        [MaxLength(50)]
        public string REGON { get; set; }
        public string NIP { get; set; }
        public string KRS { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string DetailAddress { get; set; }
        public string PhoneNumber {get;set;}
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string BankAccount { get; set; }
        public string PESEL {get;set;}

    }
}