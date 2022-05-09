SELECT role.id AS id,
    role.title AS title,
    department.name AS department,
    role.salary AS salary
FROM role
JOIN department ON role.department_id = department.id
ORDER BY id ASC;

SELECT employee.id AS id,
    employee.first_name AS first_name,
    employee.last_name AS last_name,
    role.title AS title,
    department.name AS department,
    role.salary AS salary,
    employee.manager_id AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    -- JOIN employee AS manager ON employee.manager_id = employee.id
    ORDER BY id ASC;