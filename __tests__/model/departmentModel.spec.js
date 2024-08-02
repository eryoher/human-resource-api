import { DepartmentModel } from "../../models/Department";

describe("DepartmentModel", () => {
  let mockDb;
  let departmentModel;

  beforeEach(() => {
    // Mock the database client
    mockDb = {
      execute: jest.fn(),
    };

    // Initialize the DepartmentModel with the mocked database client
    departmentModel = new DepartmentModel(mockDb);
  });

  describe("getAllDepartments", () => {
    it("should return a list of departments", async () => {
      // Mock the database response
      const mockDepartments = [
        { id: 1, name: "HR" },
        { id: 2, name: "IT" },
      ];
      mockDb.execute.mockResolvedValueOnce({ rows: mockDepartments });

      // Call the method and check the result
      const result = await departmentModel.getAllDepartments();
      expect(result).toEqual(mockDepartments);
    });

    it("should throw an error if fetching departments fails", async () => {
      // Mock the database to throw an error
      mockDb.execute.mockRejectedValueOnce(new Error("Database error"));

      await expect(departmentModel.getAllDepartments()).rejects.toThrow(
        "Failed to fetch departments"
      );
    });
  });

  describe("getAllDepartmentsByEmployee", () => {
    it("should return a list of departments for a given employee", async () => {
      // Mock the database response
      const mockDepartments = [
        {
          id: 1,
          department_id: 1,
          department_name: "HR",
          start_date: "2023-01-01",
        },
        {
          id: 2,
          department_id: 2,
          department_name: "IT",
          start_date: "2023-02-01",
        },
      ];
      mockDb.execute.mockResolvedValueOnce({ rows: mockDepartments });

      // Call the method and check the result
      const result = await departmentModel.getAllDepartmentsByEmployee(1);
      expect(result).toEqual(mockDepartments);
    });

    it("should throw an error if fetching departments for an employee fails", async () => {
      // Mock the database to throw an error
      mockDb.execute.mockRejectedValueOnce(new Error("Database error"));

      await expect(
        departmentModel.getAllDepartmentsByEmployee(1)
      ).rejects.toThrow("Failed to fetch departments");
    });
  });

  describe("createDepartment", () => {
    it("should create a new department and return its id", async () => {
      // Mock the database response
      const mockId = 3;
      mockDb.execute.mockResolvedValueOnce({ rows: [{ id: mockId }] });

      // Call the method and check the result
      const result = await departmentModel.createDepartment({
        name: "Finance",
      });
      expect(result).toBe(mockId);
    });

    it("should throw an error if creating a department fails", async () => {
      // Mock the database to throw an error
      mockDb.execute.mockRejectedValueOnce(new Error("Database error"));

      await expect(
        departmentModel.createDepartment({ name: "Finance" })
      ).rejects.toThrow("Failed to create department");
    });
  });

  describe("deleteDepartmentById", () => {
    it("should delete a department by id and return true if successful", async () => {
      // Mock the database response
      mockDb.execute.mockResolvedValueOnce({ rowsAffected: 1 });

      // Call the method and check the result
      const result = await departmentModel.deleteDepartmentById(1);
      expect(result).toBe(true);
    });

    it("should return false if no department was deleted", async () => {
      // Mock the database response to simulate no rows affected
      mockDb.execute.mockResolvedValueOnce({ rowsAffected: 0 });

      // Call the method and check the result
      const result = await departmentModel.deleteDepartmentById(1);
      expect(result).toBe(false);
    });

    it("should throw an error if deleting a department fails", async () => {
      // Mock the database to throw an error
      mockDb.execute.mockRejectedValueOnce(new Error("Database error"));

      await expect(departmentModel.deleteDepartmentById(1)).rejects.toThrow(
        "Failed to delete department with id 1"
      );
    });
  });
});
