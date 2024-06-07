import express, { json } from "express";

import { createEmployeeRouter } from "./routes/employees.js";
import { EmployeeModel } from "./models/employee.js";
import { createDepartmentRouter } from "./routes/departments.js";
import { DepartmentModel } from "./models/departments.js";
import { corsMiddleware } from "./middlewares/cors.js";

export const createApp = ({ dbClient }) => {
  const app = express();
  app.use(json());
  app.disable("x-powered-by");
  app.use(corsMiddleware());

  const employeeModel = new EmployeeModel(dbClient);
  const departmentModel = new DepartmentModel(dbClient);

  app.use("/employees", createEmployeeRouter({ employeeModel }));
  app.use("/departments", createDepartmentRouter({ departmentModel }));

  const PORT = process.env.PORT ?? 3001;

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
};
