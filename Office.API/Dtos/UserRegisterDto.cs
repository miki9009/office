using System.ComponentModel.DataAnnotations;

namespace Office.API.Dtos
{
    public class UserRegisterDto
    {
        [Required]
        [StringLength(25, MinimumLength = 3, ErrorMessage = "username must have from 3 to 25 characters" )]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(25, MinimumLength = 8, ErrorMessage = "Password must have from 8 to 25 characters")]
        public string Password { get; set; }
    }
}