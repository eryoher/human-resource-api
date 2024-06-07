import { format } from "date-fns";

export class EmployeeModel {
  constructor(databaseClient) {
    this.db = databaseClient;
  }

  async getAllEmployees() {
    try {
      // Example query to fetch all employees
      const employees = await this.db.execute(`SELECT
                e.*,
                d.name AS department_name,
                d.id AS department_id, 
                oldest.start_date AS hire_date
              FROM
                employees e
                LEFT JOIN employee_history eh ON e.id = eh.employee_id
                LEFT JOIN departments d ON eh.department_id = d.id
                LEFT JOIN (
                  SELECT
                    employee_id,
                    MIN(start_date) AS start_date
                  FROM
                    employee_history
                  GROUP BY
                    employee_id
                ) AS oldest ON e.id = oldest.employee_id
              WHERE eh.end_date IS NULL;`);
      return employees.rows;
    } catch (error) {
      throw new Error("Failed to fetch employees");
    }
  }

  async getEmployeeById(id) {
    try {
      const employee = await this.db.execute({
        sql: `SELECT
                e.*,
                d.name AS department_name,
                d.id AS department_id, 
                oldest.start_date AS hire_date
              FROM
                employees e
                LEFT JOIN employee_history eh ON e.id = eh.employee_id
                LEFT JOIN departments d ON eh.department_id = d.id
                LEFT JOIN (
                  SELECT
                    employee_id,
                    MIN(start_date) AS start_date
                  FROM
                    employee_history
                  GROUP BY
                    employee_id
                ) AS oldest ON e.id = oldest.employee_id
              WHERE
                e.id = ?
                AND eh.end_date IS NULL
              LIMIT
                1;`,
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

  async updateEmployee({ id, input: employeeData }) {
    try {
      const currentEmployee = await this.getEmployeeById(id);
      const { department_id: currentDepartmentId } = currentEmployee;
      const { firstName, lastName, phone, address, departmentId } =
        employeeData;
      const today = format(new Date(), "yyyy-MM-dd");

      // Update employee record
      const { rowsAffected } = await this.db.execute({
        sql: "UPDATE employees SET first_name = (:firstName), last_name = (:lastName), phone = (:phone), address = (:address) WHERE id = (:id)",
        args: { firstName, lastName, phone, address, id },
      });

      if (rowsAffected > 0) {
        if (currentDepartmentId !== departmentId) {
          await this.db.execute({
            sql: "UPDATE employee_history SET end_date = (:endDate) WHERE employee_id = (:id) AND end_date IS NULL",
            args: { id, endDate: today },
          });

          // Insert new employee history record
          await this.db.execute({
            sql: "INSERT INTO employee_history (employee_id, department_id, start_date) VALUES (:id, :departmentId, :startDate)",
            args: { id, departmentId, startDate: today },
          });
        }
      }

      return rowsAffected > 0;
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
