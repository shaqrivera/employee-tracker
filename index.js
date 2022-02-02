const inquirer = require('inquirer');
const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const cTable = require('console.table');
const { restoreDefaultPrompts } = require('inquirer');

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



