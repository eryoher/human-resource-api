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
              e.id,
              e.first_name,
              e.last_name,
              e.phone,
              e.address,
              e.created_at AS hire_date,
              e.active,
              d.name AS department_name,
              d.id AS department_id
            FROM
              employees e
              LEFT JOIN employee_history eh ON e.id = eh.employee_id AND eh.end_date IS NULL
              LEFT JOIN departments d ON eh.department_id = d.id
            WHERE
              e.id = ?;`,
        args: [id],
      });

      return employee.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch employee with id ${id}`);
    }
  }

  async createEmployee(employeeData) {
    const { departmentId, ...data } = employeeData;

    try {
      const employee = await this.db.execute({
        sql: `INSERT INTO employees (first_name, last_name, phone, address, active, created_at) 
          VALUES (:firstName, :lastName, :phone, :address, true, CURRENT_TIMESTAMP) 
          RETURNING id`,
        args: { ...data },
      });

      const { id: employeeId } = employee.rows[0];

      // Insert employee history record
      await this.db.execute({
        sql: `INSERT INTO employee_history (employee_id, department_id, start_date) 
          VALUES (:employeeId, :departmentId, CURRENT_TIMESTAMP)`,
        args: {
          employeeId,
          departmentId: departmentId,
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
      const { firstName, lastName, phone, address, departmentId, active } =
        employeeData;

      // Update employee record
      const { rowsAffected } = await this.db.execute({
        sql: "UPDATE employees SET first_name = (:firstName), last_name = (:lastName), phone = (:phone), address = (:address), active = (:active) WHERE id = (:id)",
        args: { firstName, lastName, phone, address, active: active, id },
      });

      if (rowsAffected > 0) {
        if (currentDepartmentId !== departmentId) {
          await this.db.execute({
            sql: "UPDATE employee_history SET end_date = CURRENT_TIMESTAMP WHERE employee_id = (:id) AND end_date IS NULL",
            args: { id },
          });

          // Insert new employee history record
          await this.db.execute({
            sql: "INSERT INTO employee_history (employee_id, department_id, start_date) VALUES (:id, :departmentId, CURRENT_TIMESTAMP)",
            args: { id, departmentId },
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
