import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { DepartmentController } from "../../controllers/DepartmentController";

const app = express();
app.use(bodyParser.json());

const departmentModel = {
  getAllDepartments: jest.fn(),
  createDepartment: jest.fn(),
  deleteDepartmentById: jest.fn(),
};

const departmentController = new DepartmentController({ departmentModel });

app.get("/departments", departmentController.getAllDepartments);
app.post("/departments", departmentController.createDepartment);
app.delete("/departments/:id", departmentController.deleteDepartmentById);

describe("DepartmentController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /departments", () => {
    it("should return a list of departments", async () => {
      const mockDepartments = [
        { id: 1, name: "HR" },
        { id: 2, name: "IT" },
      ];
      departmentModel.getAllDepartments.mockResolvedValue(mockDepartments);

      const response = await request(app).get("/departments");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDepartments);
    });

    it("should return an empty list if no departments are found", async () => {
      departmentModel.getAllDepartments.mockResolvedValue([]);

      const response = await request(app).get("/departments");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("POST /departments", () => {
    it("should create a new department", async () => {
      const newDepartment = { id: 3, name: "Finance" };
      departmentModel.createDepartment.mockResolvedValue(newDepartment);

      const response = await request(app)
        .post("/departments")
        .send(newDepartment);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newDepartment);
    });
  });

  describe("DELETE /departments/:id", () => {
    it("should delete a department by id", async () => {
      departmentModel.deleteDepartmentById.mockResolvedValue(true);

      const response = await request(app).delete("/departments/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Department deleted successfully",
      });
    });

    it("should return 404 if department does not exist", async () => {
      departmentModel.deleteDepartmentById.mockResolvedValue(false);

      const response = await request(app).delete("/departments/999");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Department not found" });
    });
  });
});
