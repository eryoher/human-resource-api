import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { EmployeeController } from "../../controllers/EmployeeController";

const app = express();
app.use(bodyParser.json());

const employeeModel = {
  createEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployeeById: jest.fn(),
  getAllEmployees: jest.fn(),
  getEmployeeById: jest.fn(),
};

const departmentModel = {
  getAllDepartmentsByEmployee: jest.fn(),
};

const employeeController = new EmployeeController({
  employeeModel,
  departmentModel,
});

app.post("/employees", employeeController.createEmployee);
app.get("/employees", employeeController.getAllEmployees);
app.get("/employees/:id", employeeController.getEmployeeById);
app.put("/employees/:id", employeeController.updateEmployee);
app.delete("/employees/:id", employeeController.deleteEmployeeById);

describe("EmployeeController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /employees", () => {
    it("should create a new employee", async () => {
      const newEmployee = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        phone: "1234567890",
        departmentId: 1,
        active: true,
      };

      employeeModel.createEmployee.mockResolvedValue(newEmployee);

      const response = await request(app).post("/employees").send({
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        phone: "1234567890",
        departmentId: 1,
        active: true,
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newEmployee);
    });

    it("should return 403 if validation fails", async () => {
      employeeModel.createEmployee.mockImplementation(() => {
        throw new Error("Validation error");
      });

      const response = await request(app).post("/employees").send({
        firstName: "John",
        lastName: "",
        address: "123 Main St",
        phone: "123",
        departmentId: -1,
        active: "true",
      });

      expect(response.status).toBe(403);
    });
  });

  describe("GET /employees", () => {
    it("should return a list of employees", async () => {
      const mockEmployees = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          phone: "1234567890",
          departmentId: 1,
          active: true,
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          address: "456 Elm St",
          phone: "9876543210",
          departmentId: 2,
          active: false,
        },
      ];

      employeeModel.getAllEmployees.mockResolvedValue(mockEmployees);

      const response = await request(app).get("/employees");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEmployees);
    });
  });

  describe("GET /employees/:id", () => {
    it("should return an employee by id with department history", async () => {
      const mockEmployee = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        phone: "1234567890",
        departmentId: 1,
        active: true,
      };
      const mockDepartments = [{ id: 1, name: "HR" }];

      employeeModel.getEmployeeById.mockResolvedValue(mockEmployee);
      departmentModel.getAllDepartmentsByEmployee.mockResolvedValue(
        mockDepartments
      );

      const response = await request(app).get("/employees/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockEmployee,
        history: mockDepartments,
      });
    });

    it("should return 404 if employee not found", async () => {
      employeeModel.getEmployeeById.mockResolvedValue(null);

      const response = await request(app).get("/employees/1");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Employee not found" });
    });
  });

  describe("PUT /employees/:id", () => {
    it("should update an employee", async () => {
      employeeModel.updateEmployee.mockResolvedValue(true);

      const response = await request(app).put("/employees/1").send({
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        phone: "1234567890",
        departmentId: 1,
        active: true,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Employee updated" });
    });

    it("should return 404 if employee not found", async () => {
      employeeModel.updateEmployee.mockResolvedValue(false);

      const response = await request(app).put("/employees/1").send({
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        phone: "1234567890",
        departmentId: 1,
        active: true,
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Employee not found" });
    });

    it("should return 403 if validation fails", async () => {
      employeeModel.updateEmployee.mockImplementation(() => {
        throw new Error("Validation error");
      });

      const response = await request(app).put("/employees/1").send({
        firstName: "John",
        lastName: "",
        address: "123 Main St",
        phone: "123",
        departmentId: -1,
        active: "true",
      });

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /employees/:id", () => {
    it("should delete an employee by id", async () => {
      employeeModel.deleteEmployeeById.mockResolvedValue(true);

      const response = await request(app).delete("/employees/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Employee deleted" });
    });

    it("should return 404 if employee not found", async () => {
      employeeModel.deleteEmployeeById.mockResolvedValue(false);

      const response = await request(app).delete("/employees/1");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Employee not found" });
    });
  });
});
