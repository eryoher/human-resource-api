import express, { json } from "express";

import { createEmployeeRouter } from "./routes/employees.js";
import { EmployeeModel } from "./models/employee.js";
import { createDepartmentRouter } from "./routes/departments.js";
import { DepartmentModel } from "./models/departments.js";
import { corsMiddleware } from "./middlewares/cors.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createApp = ({ dbClient }) => {
  const app = express();
  app.disable("x-powered-by");
  app.use(corsMiddleware());
  app.use(json());
  const employeeModel = new EmployeeModel(dbClient);
  const departmentModel = new DepartmentModel(dbClient);

  app.use(
    "/employees",
    createEmployeeRouter({ employeeModel, departmentModel })
  );
  app.use("/departments", createDepartmentRouter({ departmentModel }));

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  const PORT = process.env.PORT ?? 3001;

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
};
