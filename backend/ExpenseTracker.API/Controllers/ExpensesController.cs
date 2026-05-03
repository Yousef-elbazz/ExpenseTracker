using ExpenseTracker.API.Models;
using ExpenseTracker.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            var expenses = await _expenseService.GetAllExpensesAsync();
            return Ok(expenses);
        }

        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetMonthlySummary()
        {
            var summary = await _expenseService.GetMonthlySummaryAsync();
            return Ok(summary);
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense(Expense expense)
        {
            var createdExpense = await _expenseService.CreateExpenseAsync(expense);
            return CreatedAtAction("GetExpenses", new { id = createdExpense.Id }, createdExpense);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpense(int id, Expense expense)
        {
            try
            {
                await _expenseService.UpdateExpenseAsync(id, expense);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return BadRequest("Expense ID mismatch");
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            try
            {
                await _expenseService.DeleteExpenseAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
