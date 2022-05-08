const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db`)
);

const viewDepts = () => db.query(`SELECT * FROM department`, (err, results) => err ? console.error(err) : console.table(results));

const viewRoles = () => db.query(`SELECT role.id AS id,
    role.title AS title,
    department.name AS department,
    role.salary AS salary
    FROM role
    JOIN department ON role.department_id = department.id
    ORDER BY id ASC`, (err, results) => err ? console.error(err) : console.table(results));

const viewEmps = () => db.query(`SELECT employee.id AS id,
    employee.first_name AS first_name,
    employee.last_name AS last_name,
    role.title AS title,
    department.name AS department,
    role.salary AS salary,
    employee.manager_id AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    ORDER BY id ASC`, (err, results) => err ? console.error(err) : console.table(results));

function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'initial',
                message: 'What would you like to do?',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
            },
        ])
        .then((data) => {
            switch (data.initial) {
                case 'View All Departments':
                    viewDepts();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmps();
                    break;
            
                default:
                    break;
            }
        })
}

init();
