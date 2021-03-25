const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'EmployeeTracker',
});

connection.connect((err) => {
    if (err) throw err;
    else {
        runSearch();
    }

});

runSearch = () => {
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Departments",
            "View Roles",
            "View Employees",
            "Add Departments",
            "Add Roles",
            "Add Employees",
            "Update Employee Roles",
            "Exit"
        ],
    })
        .then((answer) => {
            switch (answer.action) {
                case "View Departments":
                    departmentSearch();
                    break;

                case "View Roles":
                    roleSearch();
                    break;

                case "View Employees":
                    employeeSearch();
                    break;

                case "Add Departments":
                    departmentAdd();
                    break;

                case "Add Roles":
                    roleAdd();
                    break;

                case "Add Employees":
                    employeeAdd();
                    break;

                case "Update Employee Roles":
                    updateRoles();
                    break;

                case "Exit":
                    exit();
                    break;
            }
        })
}

const departmentSearch = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        else {
            console.table(res);
            return runSearch();
        }


    });
}

const roleSearch = () => {
    connection.query("SELECT job_role.title, job_role.salary, department.department_name FROM job_role INNER JOIN department ON job_role.department_id = department.department_id", (err, res) => {
        if (err) throw err;
        else {
            console.table(res);
            return runSearch();
        }
    })
}

employeeSearch = () => {
    connection.query('SELECT employee.first_name, employee.last_name, job_role.title, job_role.salary, employee.manager_id FROM employee INNER JOIN job_role ON employee.role_id = job_role.role_id', (err, res) => {
        if (err) throw err;
        else {
            console.table(res);
            runSearch()
        }

    });
}

departmentAdd = () => {
    inquirer.prompt(
        {
            name: "depo",
            type: "input",
            message: "What department would you like to add?"
        }
    )
        .then((answer) => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    department_name: answer.depo,
                },
                (err) => {
                    if (err) throw err;
                    console.log("The " + answer.depo + " department was added successfully");
                    return runSearch()
                }
            )
        })
    
}

const roleAdd = () => {
    inquirer.prompt([
        {
            name: "role",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is this roles yearly salary?"
        },
        {
            name: "depo_id",
            type: "input",
            message: "What is the roles department id?",
            validate(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            },
        }
    ])
        .then((answer) => {
            connection.query(
                "INSERT INTO job_role SET ?",
                {
                    title: answer.role,
                    salary: answer.salary,
                    department_id: answer.depo_id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("The " + answer.role + " role was added successfully");
                    return runSearch()
                }
            )
        });
        
}

const employeeAdd = () => {
    inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "What is the employees first name?"
        },
        {
            name: "last",
            type: "input",
            message: "What is the employees last name?"
        },
        {
            name: "role_id",
            type: "input",
            message: "What is the employees role id?",
            validate(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            },
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the employees manager id?",
            validate(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            },
        }
    ])
        .then((answer) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id
                },
                (err) => {
                    if (err) throw err;
                    console.log(answer.first + " " + answer.last + " was added successfully");
                }
            )
            return runSearch()
        });
    
}

updateRoles = () => {
    connection.query("SELECT * FROM employee, job_role", (err, results) =>{
        if(err) throw err;
        inquirer.prompt([{
            name: "update",
            type: "rawlist",
            choices() {
                let choiceArray = [];
                results.forEach(({first_name, last_name}) => {
                    choiceArray.push(first_name + " " + last_name);
                });
                console.log(choiceArray);
                return choiceArray;
                
            },
            message: "What employee would you like to update?"
        },
        {
            name: "role",
            type: "rawlist",
            choices() {
                const roleArray = [];
                results.forEach(({title}) => {
                    roleArray.push(title);
                });
                return roleArray;
            },
            message: "What role would you like to give to them?"
        }
        ])
        .then((answer) => {
            let chosenEmployee;
            results.forEach((employee) => {
                if(employee.first_name + " " + employee.last_name === answer.update) {
                    chosenEmployee = employee;
                    
                }
                console.log(chosenEmployee);
            });
            connection.query(
                "UPDATE employee SET ? WHERE",
                [
                    {
                        title: answer.role,
                        chosenEmployee: answer.update,
                    }
                ],
                (error) => {
                    if (error) throw err;
                    console.log('Employee role updated successfully');
                    // runSearch();
                }
            )
        })
    })

    // return runSearch();

}

exit = () => {
    console.log("Have a nice day!!");
    process.exit()
}