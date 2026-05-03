using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Services
{
    /// <summary>
    /// Interface for Expense business logic (Dependency Inversion Principle).
    /// Controllers depend on abstraction, not concrete implementations.
    /// </summary>
    public interface IExpenseService
    {
        Task<IEnumerable<Expense>> GetAllExpensesAsync();
        Task<object> GetMonthlySummaryAsync();
        Task<Expense> CreateExpenseAsync(Expense expense);
        Task UpdateExpenseAsync(int id, Expense expense);
        Task DeleteExpenseAsync(int id);
    }
}
