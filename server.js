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

const viewDepts = () => db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
        console.error(err)
    } else {
        console.table(results)
    }
    init();
});

const viewRoles = () => db.query(`SELECT role.id AS id,
    role.title AS title,
    department.name AS department,
    role.salary AS salary
    FROM role
    JOIN department ON role.department_id = department.id
    ORDER BY id ASC`, (err, results) => {
        if (err) {
            console.error(err)
        } else {
            console.table(results)
        }
        init();
    });

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
    ORDER BY id ASC`, (err, results) => {
        if (err) {
            console.error(err)
        } else {
            console.table(results)
        }
        init();
    });

const addDept = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'dept',
                message: 'What is the name of the department you would like to add?'
            }
        ])
        .then((res) => {
            db.query(`INSERT INTO department (name) VALUES (?)`, res.dept, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    console.table(results)
                }
                init();
            })
        })
}

const addRole = () => db.query();

const addEmp = () => db.query();

const updateRole = () => db.query();

const quitApp = () => {
    console.log('Employee Tracker app has closed');
    db.end();
}

function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'initial',
                message: 'What would you like to do?',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'QUIT']
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
                case 'Add a Department':
                    addDept();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmp();
                    break;
                case 'Update an Employee Role':
                    updateRole();
                    break;
                case 'QUIT':
                    quitApp();
                    break;
            
                default:
                    break;
            }
        })
}

init();
