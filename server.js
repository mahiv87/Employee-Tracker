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

const deptArr = [];
db.query(`SELECT (name) FROM department ORDER BY name ASC`, (err, results) => {
    if (err) {
        console.error(err)
    }        
    for (let res of results) {
        deptArr.push(res)
    }
});

const empArr =[];
db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) {
        console.error(err)
    }
    for (let res of results) {
        empArr.push(`${res.first_name} ${res.last_name}`)
    }
})

const roleArr = [];
db.query(`SELECT * FROM role`, (err, results) => {
    if (err) {
        console.error(err)
    }
    for (let res of results) {
        roleArr.push(res.title)
    } 
})

const managerArr = ['None'];
db.query(`SELECT * FROM employee`, (err, results) => {
    if (err) {
        console.error(err)
    }
    for (let res of results) {
        managerArr.push(`${res.first_name} ${res.last_name}`)
    }
})

const viewDepts = () => db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
        console.error(err)
    } else {
        console.table('\x1b[33m', results)
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
            console.table('\x1b[33m', results)
        }
        init();
    });

const viewEmps = () => db.query(`SELECT employee.id AS id,
    employee.first_name AS first_name,
    employee.last_name AS last_name,
    role.title AS title,
    department.name AS department,
    role.salary AS salary,
    concat(manager.first_name, " " , manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    ORDER BY id ASC`, (err, results) => {
        if (err) {
            console.error(err)
        } else {
            console.table('\x1b[33m', results)
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
                    console.log('\x1b[32m Department successfully added!');
                }
            })
            init();
        })
}

const addRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?'
            },
            {
                type: 'input',
                name:'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'dept',
                message: 'Which department does the role belong to?',
                choices: deptArr
            }
        ])
        .then((res) => {
            let deptID;
            db.query(`SELECT (id) FROM department WHERE name=(?)`, res.dept, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    deptID = results[0].id
                }

                db.query(`INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?)`, [res.role, deptID, res.salary], (err, results) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log('\x1b[32m Role successfully added!');
                    }
                })
            })
            init();
        })
};

const addEmp = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first',
                message: 'What is the employees first name?'
            },
            {
                type: 'input',
                name: 'last',
                message: 'What is the employees last name?'
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employees role?',
                choices: roleArr
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the employees manager?',
                choices: managerArr
            }
        ])
        .then((res) => {
            let roleID;
            const managerIdArr = res.manager.split(" ");
            let managerID;

            db.query(`SELECT (id) FROM role WHERE title=(?)`, res.role, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    roleID = results[0].id
                }

                db.query(`SELECT (id) FROM employee WHERE first_name=(?) AND last_name=(?)`, [managerIdArr[0], managerIdArr[1]], (err, results) => {
                    if (err) {
                        console.error(err)
                    } else {
                        managerID = results[0].id
                        insertEmp();
                    }
                })
                
                const insertEmp = () => {
                    const params = [res.first, res.last, roleID, managerID]
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, params, (err, results) => {
                        if (err) {
                            console.error(err)
                        }  else {
                            console.log('\x1b[32m Employee successfully added!');
                        }
                    })
                }
            })
            init();
        })
};

const updateRole = async () => {
    await inquirer
        .prompt([
            {
                type: 'list',
                name: 'emp',
                message: 'Which employees role do you want to update?',
                choices: empArr
            },
            {
                type: 'list',
                name: 'role',
                message: 'Which role do you want to assign to this employee?',
                choices: roleArr
            }
        ])
        .then((res) => {
            const empName = res.emp.split(' ');
            let roleID;
            db.query(`SELECT (id) FROM role WHERE title=(?)`, res.role, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    roleID = results[0].id
                }
                updateRole()
            })

            const updateRole = () => {
                const params = [roleID, empName[0], empName[1]]
                db.query(`UPDATE employee SET role_id=(?) WHERE first_name=(?) AND last_name =(?)`,params, (err, results) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log('\x1b[32m Role successfully updated!');
                    }
                })
            }
        })
        init();
};

const deleteOption = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'Which table do you want to delete from?',
                choices: ['Department', 'Role', 'Employee']
            }
        ])
        .then((res) => {
            switch (res.selection) {
                case 'Department':
                    deleteDept();
                    break;
                case 'Role':
                    deleteRole();
                    break;
                case 'Employee':
                    deleteEmployee();
                    break;
            
                default:
                    break;
            }
        })
}

const deleteDept = () => {
    inquirer
        .prompt([
            {
                type:'list',
                name: 'dept',
                message: 'Which Department would you like to remove?',
                choices: deptArr
            },
        ])
        .then((res) => {
            let deptID;
            db.query(`SELECT (id) FROM department WHERE name=(?)`, res.dept, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    deptID = results[0].id
                }

                db.query(`DELETE FROM department WHERE id=(?)`, deptID, (err, results) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log('\x1b[32m Department successfully removed!');
                    }
                })
            })
            init();
        })
}

const deleteRole = () => {
    inquirer
    .prompt([
        {
            type:'list',
            name: 'role',
            message: 'Which Role would you like to remove?',
            choices: roleArr
        },
    ])
    .then((res) => {
        let roleID;
        db.query(`SELECT (id) FROM role WHERE title=(?)`, res.role, (err, results) => {
            if (err) {
                console.error(err)
            } else {
                roleID = results[0].id
            }

            db.query(`DELETE FROM role WHERE id=(?)`, roleID, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log('\x1b[32m Role successfully removed!');
                }
            })
        })
        init();
    })
}

const deleteEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which Employee would you like to remove?',
                choices: empArr
            },
        ])
        .then((res) => {
            const empName = res.employee.split(' ');
            const params = [ empName[0], empName[1] ];
            db.query(`DELETE FROM employee WHERE first_name=(?) AND last_name =(?)`,params, (err, results) => {
                if (err) {
                    console.error(err)
                } else {
                    console.log('\x1b[32m Employee successfully removed!');
                }
            })
            init();
        })

}

const quitApp = () => {
    console.log('\x1b[31m Employee Tracker app has closed');
    db.end();
}

function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'initial',
                message: 'What would you like to do?',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Remove a Department, Role, or Employee', 'QUIT']
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
                case 'Remove a Department, Role, or Employee':
                    deleteOption();
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