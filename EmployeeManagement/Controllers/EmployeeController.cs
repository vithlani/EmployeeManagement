using EmployeeManagement.Data;
using EmployeeManagement.Models;
using Microsoft.AspNetCore.Mvc; 
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public EmployeeController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetEmployees(
            int pageNumber = 1,                  // Defaults to page 1 if not provided
            int pageSize = 10,                   // Default page size
            string? sortColumn = "Name",         // Default sorting by Name
            string? sortOrder = "asc",           // Default order is ascending
            string? searchQuery = null)          // Null if no search query is provided
        {
            // Base query
            var query = _context.Employees.AsQueryable();

            // Apply search only if searchQuery is provided
            if (!string.IsNullOrEmpty(searchQuery))
            {
                query = query.Where(e =>
                    EF.Functions.Like(e.Name, $"%{searchQuery}%") ||
                    EF.Functions.Like(e.Email, $"%{searchQuery}%") ||
                    EF.Functions.Like(e.EmployeeID, $"%{searchQuery}%") ||
                    EF.Functions.Like(e.MobileNumber, $"%{searchQuery}%") ||
                    EF.Functions.Like(e.Gender, $"%{searchQuery}%") ||
                    (e.AnotherPhoneNumber != null && EF.Functions.Like(e.AnotherPhoneNumber, $"%{searchQuery}%"))
                );
            }

            // Apply sorting and paging as before
            query = query.OrderBy($"{sortColumn} {sortOrder}");

            var totalRecords = await query.CountAsync();
            var employees = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Return paginated result with total count
            return Ok(new
            {
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Employees = employees
            });
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
                return BadRequest();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Entry(employee).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }
    }
}
