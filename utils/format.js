function formatEmployee(employeeOrArray) {
  // If employeeOrArray is an array, map over it and format each employee
  if (Array.isArray(employeeOrArray)) {
    return employeeOrArray.map((employee) => ({
      id: employee.id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      phone: employee.phone,
      address: employee.address,
      active: employee.active === 1, // Assuming active is stored as 1 for true, 0 for false
      createdAt: employee.created_at,
      avatar: employee.avatar,
      departmentName: employee.department_name,
      departmentId: employee.department_id,
      hireDate: employee.hire_date,
    }));
  }

  // If employeeOrArray is a single employee object, format it
  const employee = employeeOrArray;
  return {
    id: employee.id,
    firstName: employee.first_name,
    lastName: employee.last_name,
    phone: employee.phone,
    address: employee.address,
    active: employee.active === 1, // Assuming active is stored as 1 for true, 0 for false
    createdAt: employee.created_at,
    avatar: employee.avatar,
    departmentName: employee.department_name,
    departmentId: employee.department_id,
    hireDate: employee.hire_date,
  };
}

export default formatEmployee;
