using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.Models
{
    public class Budget
    {
        public int Id { get; set; }

        [Required]
        public decimal MonthlyLimit { get; set; }

        [Required]
        public int Month { get; set; } // 1-12

        [Required]
        public int Year { get; set; }
    }
}
