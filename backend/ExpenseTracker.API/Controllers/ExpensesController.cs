using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpensesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            return await _context.Expenses.Include(e => e.Category).OrderByDescending(e => e.Date).ToListAsync();
        }

        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetMonthlySummary()
        {
            var expenses = await _context.Expenses.ToListAsync();
            var total = expenses.Sum(e => e.Amount);
            var monthly = expenses.GroupBy(e => new { e.Date.Year, e.Date.Month })
                                  .Select(g => new { Month = $"{g.Key.Month}/{g.Key.Year}", Total = g.Sum(e => e.Amount) })
                                  .OrderByDescending(x => x.Month) // Simplified sorting
                                  .ToList();

            return new { Total = total, Monthly = monthly };
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpenses", new { id = expense.Id }, expense);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpense(int id, Expense expense)
        {
            if (id != expense.Id)
            {
                return BadRequest();
            }

            _context.Entry(expense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Expenses.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
