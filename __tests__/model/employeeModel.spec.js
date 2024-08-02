import { EmployeeModel } from "../../models/Employee";
import { mock } from "jest-mock";

// Mock database client
const mockDb = {
  execute: jest.fn(),
};

describe("EmployeeModel", () => {
  let employeeModel;

  beforeAll(() => {
    employeeModel = new EmployeeModel(mockDb);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllEmployees", () => {
    it("should fetch all employees", async () => {
      const mockEmployees = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          phone: "1234567890",
          address: "123 Main St",
          active: true,
          department_name: "HR",
          department_id: 1,
          hire_date: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Doe",
          phone: "9876543210",
          address: "456 Elm St",
          active: false,
          department_name: "IT",
          department_id: 2,
          hire_date: "2023-02-01T00:00:00Z",
        },
      ];

      mockDb.execute.mockResolvedValueOnce({ rows: mockEmployees });

      const employees = await employeeModel.getAllEmployees();
      expect(employees).toEqual(mockEmployees);
    });
  });

  describe("getEmployeeById", () => {
    it("should fetch an employee by id", async () => {
      const mockEmployee = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        phone: "1234567890",
        address: "123 Main St",
        active: true,
        department_name: "HR",
        department_id: 1,
        hire_date: "2023-01-01T00:00:00Z",
        avatar: "path/to/avatar.jpg",
      };

      mockDb.execute.mockResolvedValueOnce({ rows: [mockEmployee] });

      const employee = await employeeModel.getEmployeeById(1);
      expect(employee).toEqual(mockEmployee);
    });

    it("should throw an error if employee not found", async () => {
      mockDb.execute.mockResolvedValueOnce({ rows: [] });

      await expect(employeeModel.getEmployeeById(999)).rejects.toThrow(
        "Failed to fetch employee with id 999"
      );
    });
  });

  describe("createEmployee", () => {
    it("should create an employee and return its id", async () => {
      mockDb.execute
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Mock the insert into employees
        .mockResolvedValueOnce({ rowsAffected: 1 }); // Mock the insert into employee_history

      const employeeData = {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
        address: "123 Main St",
        departmentId: 1,
        active: true,
        avatar: "path/to/avatar.jpg",
      };

      const employeeId = await employeeModel.createEmployee(employeeData);
      expect(employeeId).toBe(1);
    });

    it("should throw an error if creation fails", async () => {
      mockDb.execute.mockRejectedValueOnce(new Error("Database error"));

      const employeeData = {
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
        address: "123 Main St",
        departmentId: 1,
        active: true,
        avatar: "path/to/avatar.jpg",
      };

      await expect(employeeModel.createEmployee(employeeData)).rejects.toThrow(
        "Failed to create employee"
      );
    });
  });

  describe("updateEmployee", () => {
    it("should update an employee and handle department change", async () => {
      mockDb.execute
        .mockResolvedValueOnce({ rows: [{ department_id: 1 }] }) // Mock current department
        .mockResolvedValueOnce({ rowsAffected: 1 }) // Mock update in employees
        .mockResolvedValueOnce({ rowsAffected: 1 }); // Mock update in employee_history

      const employeeData = {
        firstName: "Jane",
        lastName: "Doe",
        phone: "9876543210",
        address: "456 Elm St",
        departmentId: 2,
        active: false,
      };

      const result = await employeeModel.updateEmployee({
        id: 1,
        input: employeeData,
      });
      expect(result).toBe(true);
    });

    it("should throw an error if update fails", async () => {
      mockDb.execute.mockRejectedValueOnce(new Error("Database error"));

      const employeeData = {
        firstName: "Jane",
        lastName: "Doe",
        phone: "9876543210",
        address: "456 Elm St",
        departmentId: 2,
        active: false,
      };

      await expect(
        employeeModel.updateEmployee({ id: 1, input: employeeData })
      ).rejects.toThrow("Failed to update employee with id 1");
    });
  });

  describe("deleteEmployeeById", () => {
    it("should delete an employee by id", async () => {
      mockDb.execute
        .mockResolvedValueOnce({ rowsAffected: 1 }) // Mock delete from employee_history
        .mockResolvedValueOnce({ rowsAffected: 1 }); // Mock delete from employees

      const result = await employeeModel.deleteEmployeeById(1);
      expect(result).toBe(true);
    });

    it("should throw an error if delete fails", async () => {
      mockDb.execute.mockRejectedValueOnce(new Error("Database error"));

      await expect(employeeModel.deleteEmployeeById(1)).rejects.toThrow(
        "Failed to delete employee with id 1"
      );
    });
  });
});
