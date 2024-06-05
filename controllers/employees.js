export class EmployeeController {
  constructor({ employeeModel }) {
    this.employeeModel = employeeModel;
  }

  getAllEmployees = async (req, res) => {
    const employees = await this.employeeModel.getAllEmployees();
    res.json(employees);
  };

  getEmployeeById = async (req, res) => {
    const { id } = req.params;
    const employee = await this.employeeModel.getEmployeeById(id);
    if (employee) {
      return res.json(employee);
    }
    res.status(404).json({ message: "Employee not found" });
  };

  createEmployee = async (req, res) => {
    // const result = validateMovie(req.body)
    const result = req.body;
    // console.log("body::", req);
    // if (!result.success) {
    // 422 Unprocessable Entity
    // return res.status(400).json({ error: JSON.parse(result.error.message) })
    // }

    const newEmployee = await this.employeeModel.createEmployee({
      ...result,
    });

    res.status(201).json(newEmployee);
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
