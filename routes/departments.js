import { Router } from "express";
import { DepartmentController } from "../controllers/departments.js";

export const createDepartmentRouter = ({ departmentModel }) => {
  const departmentsRouter = Router();
  const departmentController = new DepartmentController({ departmentModel });

  departmentsRouter.get("/", departmentController.getAllDepartments);
  departmentsRouter.post("/", departmentController.createDepartment);
  departmentsRouter.delete("/:id", departmentController.deleteDepartmentById);

  return departmentsRouter;
};
