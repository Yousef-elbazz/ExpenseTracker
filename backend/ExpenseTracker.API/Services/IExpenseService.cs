using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Services
{
    
    public interface IExpenseService
    {
        Task<IEnumerable<Expense>> GetAllExpensesAsync();
        Task<object> GetMonthlySummaryAsync();
        Task<Expense> CreateExpenseAsync(Expense expense);
        Task UpdateExpenseAsync(int id, Expense expense);
        Task DeleteExpenseAsync(int id);
    }
}
