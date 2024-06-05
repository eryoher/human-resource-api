import express, { json } from "express";

import { createEmployeeRouter } from "./routes/employees.js";
import { EmployeeModel } from "./models/employee.js";

export const createApp = ({ dbClient }) => {
  const app = express();
  app.use(json());
  app.disable("x-powered-by");

  const employeeModel = new EmployeeModel(dbClient);
  // const departmentModel = new DepartmentModel(dbClient);

  app.use("/employees", createEmployeeRouter({ employeeModel }));

  const PORT = process.env.PORT ?? 3001;

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
};
