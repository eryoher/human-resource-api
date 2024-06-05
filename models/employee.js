import { format } from "date-fns";

export class EmployeeModel {
  constructor(databaseClient) {
    this.db = databaseClient;
  }

  async getAllEmployees() {
    try {
      // Example query to fetch all employees
      const employees = await this.db.execute("SELECT * FROM employees");
      return employees.rows;
    } catch (error) {
      throw new Error("Failed to fetch employees");
    }
  }

  async getEmployeeById(id) {
    try {
      const employee = await this.db.execute({
        sql: "SELECT * FROM employees WHERE id = ?",
        args: [id],
      });

      return employee.rows;
    } catch (error) {
      throw new Error(`Failed to fetch employee with id ${id}`);
    }
  }

  async createEmployee(employeeData) {
    const today = format(new Date(), "yyyy-MM-dd");
    const { departmentId, ...data } = employeeData;

    try {
      const employee = await this.db.execute({
        sql: "INSERT INTO employees (first_name, last_name, phone, address) VALUES (:firstName, :lastName, :phone, :address) RETURNING id",
        args: { ...data },
      });

      const { id: employeeId } = employee.rows[0];

      // Insert employee history record
      await this.db.execute({
        sql: "INSERT INTO employee_history (employee_id, department_id, start_date) VALUES (:employeeId, :departmentId, :startDate)",
        args: {
          employeeId,
          departmentId: departmentId,
          startDate: today,
        },
      });

      return employeeId;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create employee");
    }
  }

  async updateEmployee(id, employeeData) {
    try {
      // Example query to update an existing employee
      const result = await this.db.query(
        "UPDATE employees SET ? WHERE id = ?",
        [employeeData, id]
      );
      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to update employee with id ${id}`);
    }
  }

  async deleteEmployeeById(id) {
    try {
      await this.db.execute({
        sql: "DELETE FROM employee_history WHERE employee_id = ?",
        args: [id],
      });

      const result = await this.db.execute({
        sql: "DELETE FROM employees WHERE id = ?",
        args: [id],
      });

      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete employee with id ${id}`);
    }
  }
}
