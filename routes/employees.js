import { Router } from "express";
import { EmployeeController } from "../controllers/employees.js";
import upload from "../middlewares/upload.js";

export const createEmployeeRouter = ({ employeeModel, departmentModel }) => {
  const employeesRouter = Router();
  const employeeController = new EmployeeController({
    employeeModel,
    departmentModel,
  });

  employeesRouter.get("/", employeeController.getAllEmployees);

  employeesRouter.post("/", upload, (req, res) =>
    employeeController.createEmployee(req, res, employeeModel)
  );

  employeesRouter.get("/:id", employeeController.getEmployeeById);

  employeesRouter.put("/:id", upload, (req, res) =>
    employeeController.updateEmployee(req, res, employeeModel)
  );
  employeesRouter.delete("/:id", employeeController.deleteEmployeeById);

  return employeesRouter;
};
