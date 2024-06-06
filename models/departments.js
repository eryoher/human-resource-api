export class DepartmentModel {
  constructor(databaseClient) {
    this.db = databaseClient;
  }

  async getAllDepartments() {
    try {
      const departments = await this.db.execute("SELECT * FROM departments");
      return departments.rows;
    } catch (error) {
      throw new Error("Failed to fetch departments");
    }
  }

  async createDepartment(departmentData) {
    const { name } = departmentData;

    try {
      const department = await this.db.execute({
        sql: "INSERT INTO departments (name) VALUES (:name) RETURNING id",
        args: { name },
      });

      const { id } = department.rows[0];

      return id;
    } catch (error) {
      throw new Error("Failed to create department");
    }
  }

  async deleteDepartmentById(id) {
    try {
      const result = await this.db.execute({
        sql: "DELETE FROM departments WHERE id = ?",
        args: [id],
      });

      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete department with id ${id}`);
    }
  }
}
