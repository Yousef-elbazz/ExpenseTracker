using ExpenseTracker.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        builder => builder.WithOrigins("http://localhost:4200")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

var app = builder.Build();

// Seed sample data if database is empty
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    
    if (!context.Categories.Any())
    {
        var categories = new[]
        {
            new ExpenseTracker.API.Models.Category { Name = "Food & Dining" },
            new ExpenseTracker.API.Models.Category { Name = "Transportation" },
            new ExpenseTracker.API.Models.Category { Name = "Entertainment" },
            new ExpenseTracker.API.Models.Category { Name = "Shopping" },
            new ExpenseTracker.API.Models.Category { Name = "Utilities" },
            new ExpenseTracker.API.Models.Category { Name = "Healthcare" }
        };
        context.Categories.AddRange(categories);
        context.SaveChanges();
        
        var expenses = new[]
        {
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Grocery Shopping at Supermarket",
                Amount = 145.75m,
                Date = DateTime.Now.AddDays(-1),
                CategoryId = 1
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Taxi to Office",
                Amount = 18.50m,
                Date = DateTime.Now.AddDays(-2),
                CategoryId = 2
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Movie Tickets - Weekend",
                Amount = 35.00m,
                Date = DateTime.Now.AddDays(-3),
                CategoryId = 3
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "New Running Shoes",
                Amount = 89.99m,
                Date = DateTime.Now.AddDays(-4),
                CategoryId = 4
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Monthly Internet Bill",
                Amount = 59.99m,
                Date = DateTime.Now.AddDays(-5),
                CategoryId = 5
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Pharmacy - Medications",
                Amount = 42.30m,
                Date = DateTime.Now.AddDays(-6),
                CategoryId = 6
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Restaurant Dinner",
                Amount = 78.50m,
                Date = DateTime.Now.AddDays(-7),
                CategoryId = 1
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Gas Station Fill-up",
                Amount = 52.00m,
                Date = DateTime.Now.AddDays(-8),
                CategoryId = 2
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Netflix Subscription",
                Amount = 15.99m,
                Date = DateTime.Now.AddDays(-9),
                CategoryId = 3
            },
            new ExpenseTracker.API.Models.Expense 
            { 
                Description = "Coffee Shop - Morning",
                Amount = 8.75m,
                Date = DateTime.Now.AddDays(-10),
                CategoryId = 1
            }
        };
        context.Expenses.AddRange(expenses);
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();
