SELECT role.id AS id,
    role.title AS title,
    department.name AS department,
    role.salary AS salary
FROM role
JOIN department ON role.department_id = department.id
ORDER BY id ASC;