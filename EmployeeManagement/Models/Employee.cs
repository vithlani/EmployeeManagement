using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        [StringLength(128, MinimumLength = 2)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string EmployeeID { get; set; }

        [Required]
        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid Indian mobile number")]
        public string MobileNumber { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        [Range(18, 60)]
        public int Age { get; set; }

        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid Indian mobile number")]
        public string AnotherPhoneNumber { get; set; }
    }
}
