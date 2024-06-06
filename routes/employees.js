import { Router } from "express";
import { EmployeeController } from "../controllers/employees.js";

export const createEmployeeRouter = ({ employeeModel }) => {
  const employeesRouter = Router();
  const employeeController = new EmployeeController({ employeeModel });

  employeesRouter.get("/", employeeController.getAllEmployees);
  employeesRouter.post("/", employeeController.createEmployee);
  employeesRouter.get("/:id", employeeController.getEmployeeById);
  employeesRouter.put("/:id", employeeController.updateEmployee);
  employeesRouter.delete("/:id", employeeController.deleteEmployeeById);

  return employeesRouter;
};
