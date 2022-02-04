const inquirer = require('inquirer');
const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const cTable = require('console.table');

const db = mysql.createConnection(
        {
            host: process.env.SQL_host,
            user: process.env.SQL_user,
            password: process.env.SQL_password,
            database: process.env.SQL_db
        },
        console.log(`Connected to the ${process.env.SQL_db} database.`)
        );

db.connect((err) => {
    if (err) {
        throw err;
    }
    initialPrompt();
})

const question = [
    {
        type: 'list',
        name: 'initial',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles',
         'View all employees', 'Add a department', 'Add a role',
        'Add an employee', 'Update an employee role']
    },

];

const nextQuestion = [
    {
        type: 'confirm',
        name: 'next',
        message: 'Would you like to continue?',
        default: true

    }
];
   


    const initialPrompt = async () => {
        let choice= await inquirer.prompt(question);
    
        if (choice.initial === 'View all departments'){
            allDepartmentQuery();
        }
        else if (choice.initial === 'View all roles'){
            allRoleQuery();
        }
        else if (choice.initial === 'View all employees'){
            allEmployeeQuery();
        }
        else if (choice.initial === 'Add a department'){
            addDepartmentPrompt();
        }
        else if (choice.initial === 'Add a role'){
            addRolePrompt();
        }
        else if (choice.initial === 'Add an employee'){
            addEmployeePrompt();
        }
        else{
            updateEmployeeRolePrompt();
        }
    };

    const nextPrompt = async () => {
        let choice = await inquirer.prompt(nextQuestion);
        if(choice.next === true){
            initialPrompt();
        }
        else{
            db.end();
        }
    };

    const allDepartmentQuery = async () => {
    const [rows] = await db.promise().query('SELECT * FROM department');
    console.table(rows);
    nextPrompt();
    };

    const addDepartmentPrompt = async () => {
        let deptName = await inquirer.prompt([
            {
                type: 'input',
                message: 'What would you like to name the new department?',
                name: 'name'

            }
        ]);
        addDepartmentQuery(deptName.name)
    }

    const addDepartmentQuery = (name) => {
    db.query(`INSERT INTO department (name) VALUES('${name}')`);
    nextPrompt();
    }

    const allRoleQuery = async () => {
        const [rows] = await db.promise().query('SELECT * FROM role');
        console.table(rows);
        nextPrompt();
    };
    const addRolePrompt = async () => {
        const [rows] = await db.promise().query('SELECT * FROM department');
        let hasDepartment = (rows) => {
            if(rows[0]){
                return true
            }
            else{
                return false
            }
        };
        if(hasDepartment(rows)){
                let roleName = await inquirer.prompt([
                            {
                                type: 'input',
                                name: 'name',
                                message: 'What would you like to title the new role?'
                            },
                            {
                                type: 'input',
                                name: 'salary',
                                message: 'Enter a salary for this role'
                            },
                            {
                                type: 'list',
                                name: 'department',
                                message: 'Which department would you like to assign the role to?',
                                choices: [...rows]
                            }
                        ]);
                        addRoleQuery(roleName);
        }
        else{
            console.log('Please add a department before adding roles!');
            initialPrompt();
        }
        
        
    };
    const addRoleQuery = async (role) => {
        const [rows] = await db.promise().query('SELECT * FROM department');
        const departmentId = () => {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].name === role.department){
                    return rows[i].id
                }
                
            }
        };
        const deptId = departmentId();
        db.query(`INSERT INTO role (title, salary, department_id) VALUES('${role.name}', ${role.salary}, ${deptId})`,(err)=>{
            if (err){
                console.log(err)
            }
            else{
                console.log('Role successfully added!');
                nextPrompt();
            }
        });
        
    };
    

    const allEmployeeQuery = async () => {
        const [rows] = await db.promise().query('SELECT * FROM employee');
        console.table(rows);
        nextPrompt();
    };   
    const addEmployeePrompt = async () => {
        let [employees] = await db.promise().query('SELECT * FROM employee');
        let [roles] = await (await db.promise().query('SELECT * FROM role'));
        let hasRole = (roles) => {
            if(roles[0]){
                return true
            }
            else{
                return false
            }
        };
        if (hasRole(roles)){
            roles = roles.map(role => role.title)
        employees = employees.map(employee => `${employee.first_name} ${employee.last_name}`)

        const employee = await inquirer.prompt([
            {
                type: 'input',
                name: 'first',
                message: `Enter the employee's first name`
            },
            {
                type: 'input',
                name: 'last',
                message: `Enter the employee's last name`
            },
            {
                type: 'list',
                name: 'role',
                message: 'Choose a role for the employee',
                choices: [...roles]
            },
            {
                type: 'list',
                name: 'manager',
                message: `Choose the employee's manager`,
                //Prevents errors when there are no existing employees
                when: async ()=>{
                    let [employees] = await db.promise().query('SELECT * FROM employee');
                    let hasEmployee = (employees) => {
                        if(employees[0]){
                            return true
                        }
                        else{
                            return false
                        }
                    };
                    return hasEmployee(employees);
                    
                },
                choices: [...employees]
            }
        ])
        addEmployeeQuery(employee);
        }
        else{
            console.log('Please add a valid role before adding employees!');
            initialPrompt();
        }
        
    }

    const addEmployeeQuery = async (employee) => {
        let [employees] = await db.promise().query('SELECT * FROM employee');
        let [roles] = await db.promise().query('SELECT * FROM role');
        
        const roleId = () => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].title === employee.role){
                    return roles[i].id
                }
                
            }
        };
        const role = roleId();
        const managerId = () => {
            for (let i = 0; i < employees.length; i++) {
                if (`${employees[i].first_name} ${employees[i].last_name}`=== employee.manager){
                    return employees[i].id
                }
                
            }
        };
        const manager = managerId();
        
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('${employee.first}', '${employee.last}', ${role}, ${manager || null})`,(err)=>{
            if (err){
                console.log(err)
            }
            else{
                console.log('Employee successfully added!');
                nextPrompt();
            }
        });
    }
    
    const updateEmployeeRolePrompt = async ()=> {
        let [employees] = await db.promise().query('SELECT * FROM employee');
        let [roles] = await db.promise().query('SELECT * FROM role');
        employees = employees.map((employee) => {
            return `${employee.first_name} ${employee.last_name}`
        });
        roles = roles.map((role) => {
            return `${role.title}`
        });
        const updatedEmployee = await inquirer.prompt(
            [
                {
                    type: 'list',
                    message: `Which employee would you like to update?`,
                    name: 'name',
                    choices: [...employees]
                },
                {
                    type: 'list',
                    message: `What would you like their new role to be?`,
                    name: 'role',
                    choices: [...roles]
                }
            ]);
        updateEmployeeQuery(updatedEmployee);
    };
    const updateEmployeeQuery = async (employee) => {
        let [employees] = await db.promise().query('SELECT * FROM employee');
        let [roles] = await db.promise().query('SELECT * FROM role');
        let selectedEmployee = {};
        for (let i = 0; i < employees.length; i++) {
            const element = `${employees[i].first_name} ${employees[i].last_name}`;
            if(employee.name === element){
                selectedEmployee = employees[i];
            }
        }
        const roleId = () => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].title === employee.role){
                    return roles[i].id
                }
                
            }
        };
        const role = roleId();
        db.query(`UPDATE employee SET role_id = ${role} WHERE id = ${selectedEmployee.id}`,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log(`Role for ${employee.name} has been updated.`)
            }
        });
        nextPrompt();
    };