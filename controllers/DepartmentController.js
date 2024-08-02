export class DepartmentController {
  constructor({ departmentModel }) {
    this.departmentModel = departmentModel;
  }

  getAllDepartments = async (req, res) => {
    const departments = await this.departmentModel.getAllDepartments();
    res.json(departments);
  };

  createDepartment = async (req, res) => {
    const data = req.body;
    const newDepartment = await this.departmentModel.createDepartment(data);
    res.status(201).json(newDepartment);
  };

  deleteDepartmentById = async (req, res) => {
    const { id } = req.params;
    const result = await this.departmentModel.deleteDepartmentById(id);

    if (result === false) {
      return res.status(404).json({ message: "Department not found" });
    }
    return res.json({ message: "Department deleted successfully" });
  };
}
