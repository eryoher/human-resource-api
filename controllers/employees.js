import { validateEmployee } from "../schemas/employees.js";
import _ from "underscore";

export class EmployeeController {
  constructor({ employeeModel, departmentModel }) {
    this.employeeModel = employeeModel;
    this.departmentModel = departmentModel;
  }

  getAllEmployees = async (req, res) => {
    const employees = await this.employeeModel.getAllEmployees();
    res.json(employees);
  };

  getEmployeeById = async (req, res) => {
    const { id } = req.params;
    const employee = await this.employeeModel.getEmployeeById(id);
    if (!_.isEmpty(employee)) {
      const departments =
        await this.departmentModel.getAllDepartmentsByEmployee(id);

      return res.json({ ...employee, history: departments });
    }
    res.status(404).json({ message: "Employee not found" });
  };

  createEmployee = async (req, res) => {
    const result = validateEmployee(req.body);

    if (!result.success) {
      return res.status(403).json({ error: JSON.parse(result.error.message) });
    }

    const newEmployee = await this.employeeModel.createEmployee({
      ...result.data,
    });

    res.status(201).json(newEmployee);
  };

  updateEmployee = async (req, res) => {
    const result = validateEmployee(req.body);
    if (!result.success) {
      return res.status(403).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;

    const updatedMovie = await this.employeeModel.updateEmployee({
      id,
      input: result.data,
    });

    if (updatedMovie === false) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json({ message: "Employee updated" });
  };

  deleteEmployeeById = async (req, res) => {
    const { id } = req.params;

    const result = await this.employeeModel.deleteEmployeeById(id);

    if (result === false) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json({ message: "Employee deleted" });
  };
}
