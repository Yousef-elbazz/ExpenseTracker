using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Services
{
    /// <summary>
    /// Service layer for Expense business logic (Single Responsibility Principle).
    /// Encapsulates all expense-related operations.
    /// </summary>
    public class ExpenseService : IExpenseService
    {
        private readonly AppDbContext _context;

        public ExpenseService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all expenses with their associated categories.
        /// </summary>
        public async Task<IEnumerable<Expense>> GetAllExpensesAsync()
        {
            return await _context.Expenses
                .Include(e => e.Category)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        /// <summary>
        /// Gets total and monthly expense summary.
        /// </summary>
        public async Task<object> GetMonthlySummaryAsync()
        {
            var expenses = await _context.Expenses.ToListAsync();
            var total = expenses.Sum(e => e.Amount);
            var monthly = expenses
                .GroupBy(e => new { e.Date.Year, e.Date.Month })
                .Select(g => new
                {
                    Month = $"{g.Key.Month}/{g.Key.Year}",
                    Total = g.Sum(e => e.Amount)
                })
                .OrderByDescending(x => x.Month)
                .ToList();

            return new { Total = total, Monthly = monthly };
        }

        /// <summary>
        /// Creates a new expense record.
        /// </summary>
        public async Task<Expense> CreateExpenseAsync(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        /// <summary>
        /// Updates an existing expense record.
        /// </summary>
        public async Task UpdateExpenseAsync(int id, Expense expense)
        {
            if (id != expense.Id)
            {
                throw new ArgumentException("Expense ID mismatch");
            }

            var existingExpense = await _context.Expenses.FindAsync(id);
            if (existingExpense == null)
            {
                throw new KeyNotFoundException($"Expense with ID {id} not found");
            }

            existingExpense.Description = expense.Description;
            existingExpense.Amount = expense.Amount;
            existingExpense.Date = expense.Date;
            existingExpense.CategoryId = expense.CategoryId;

            _context.Entry(existingExpense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Expenses.Any(e => e.Id == id))
                {
                    throw new KeyNotFoundException($"Expense with ID {id} not found");
                }
                throw;
            }
        }

        /// <summary>
        /// Deletes an expense record by ID.
        /// </summary>
        public async Task DeleteExpenseAsync(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                throw new KeyNotFoundException($"Expense with ID {id} not found");
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
        }
    }
}
