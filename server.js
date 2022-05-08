const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db`)
);

db.query(`SELECT * FROM department`, (err, results) => console.table(results));