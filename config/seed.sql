CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    active INTEGER,
    created_at TEXT,
    avatar TEXT
);

-- Create the departments table
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

-- Create the employee_history table
CREATE TABLE employee_history (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER,
    department_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees (id),
    FOREIGN KEY (department_id) REFERENCES departments (id)
);


INSERT INTO departments (id, name) VALUES
(1, 'Engineering'),
(2, 'Human Resources'),
(3, 'Marketing'),
(4, 'Development');