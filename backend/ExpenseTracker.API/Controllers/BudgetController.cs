using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BudgetController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Budget/current
        [HttpGet("current")]
        public async Task<ActionResult<Budget>> GetCurrentBudget()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.Month == currentMonth && b.Year == currentYear);

            if (budget == null)
            {
                return NotFound();
            }

            return budget;
        }

        // POST: api/Budget
        [HttpPost]
        public async Task<ActionResult<Budget>> SetBudget(Budget budget)
        {
            var existingBudget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.Month == budget.Month && b.Year == budget.Year);

            if (existingBudget != null)
            {
                existingBudget.MonthlyLimit = budget.MonthlyLimit;
                _context.Entry(existingBudget).State = EntityState.Modified;
            }
            else
            {
                _context.Budgets.Add(budget);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCurrentBudget), new { id = budget.Id }, budget);
        }
    }
}
