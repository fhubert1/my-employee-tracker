//const { prompt } = require("inquirer");
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db/connection");
const Table = require('cli-table3');

init();

// display banner 

function init() {

    const logoTxt = "T-Time Employee Manager";

    console.log(
        logo({
            name: logoTxt,
            borderColor: 'magenta',
            logoColor: 'bold-magenta'
        })
        .render()
        );

    loadPrompts(); 

}

function loadPrompts() {

    inquirer.prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: [
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES"
            },
            {
              name: "View All Employees",
              value: "VIEW_EMPLOYEES"
            },
            {
                name: "Add Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Add Role",
                value: "ADD_ROLE"
            },
            {
              name: "Add Employee",
              value: "ADD_EMPLOYEE"
            },
            {
              name: "Update Employee Role",
              value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
              name: "Quit",
              value: "QUIT"
            }
          ]
        }
    ]).then(answer => {
        const choice = answer.choice;

        // Call the appropriate function depending on what the user chose
        switch (choice) {
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
            break;
            case 'VIEW_ROLES':
                viewRoles();
            break;
            case 'VIEW_EMPLOYEES':
                viewEmployees();
            break;
            case 'ADD_DEPARTMENT':
                addDepartment();
            break;
            case 'ADD_ROLE':
                addRole();
            break;
            case 'ADD_EMPLOYEE':
                addEmployee();
            break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
            break;
            default:
                quit();
            break;  
        }
    }).catch(err => {
        console.error('Error:', err);
        quit(); // Quit on error
    });
 }


async function viewDepartments() {

    try {
      // Call the function to find all departments
      const departments = await db.findAllDepartments();
  
      // Log or process the departments as needed
      const table = new Table({
        head: ['id', 'Department']
      });
      departments.forEach(dept => {
        table.push([
            dept.id,
            dept.name
        ]);
      })
      console.table(table.toString());
      
    } catch (error) {
      // Handle any errors
      console.error('Error fetching departments:', error);
    } finally {
      //db.closeConnection();  
      loadPrompts();
    }
}

// TODO Fix role table to use department instead of department_id
async function viewRoles() {

    try {
      // Call the function to find all roles and departments
      const roles = await db.findAllRoles();
  
      // Log or process the departments as needed
      const table = new Table({
        head: ['id', 'Role', 'Salary', 'Department']
      });

      roles.forEach(role => {
        table.push([
            role.id,
            role.title,
            role.salary,
            role.department
        ]);
      });
      console.table(table.toString());
      
    } catch (error) {
      // Handle any errors
      console.error('Error fetching employees:', error);
    } finally {
      //db.closeConnection();  
      loadPrompts();
    }
}


async function viewEmployees() {

    try {
      // Call the function to find all departments
      const employees = await db.findAllEmployees();
  
      // Log or process the departments as needed
      const table = new Table({
        head: ['id', 'First Name', 'Last Name', 'Role', 'Manager']
      });
      employees.forEach(employee => {
        table.push([
            employee.id,
            employee.first_name,
            employee.last_name,
            employee.role,
            employee.manager
        ]);
      });

      console.log(table.toString());
      
    } catch (error) {
      // Handle any errors
      console.error('Error fetching roles:', error);
    } finally {
      //db.closeConnection();  
      loadPrompts();
    }
}

// Add a department
function addDepartment() {
    inquirer.prompt([
      {
        name: "name",
        message: "What is the name of the department?"
      }
    ])
      .then(res => {
        let name = res.name;
        db.createDepartment(name)
          .then(() => console.log(`Added ${name.name} to the database`))
          .then(() => loadPrompts())
      })
  }


// Add a role
async function addRole() {

    const departments = await db.findAllDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));
  
    inquirer.prompt([
        {
            name: "title",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
         }
    ])
        .then(role => {
            db.createRole(role)
              .then(() => console.log(`Added ${role.title} to the database`))
              .then(() => loadPrompts())
        })
}
  
// Add an employee
async function addEmployee() {

    const roles = await db.findAllRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const employees = await db.findAllEmployees();
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    // add none to manager choices if employee added is a manager
    managerChoices.unshift({ name: "None", value: null });    

    inquirer.prompt([
      {
        name: "firstName",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      },
      {
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerChoices
      }

    ])
    .then(empl => {
        db.createEmployee(empl)
          .then(() => console.log(`Added ${empl.first_name} ${empl.last_name} to the database`))
          .then(() => loadPrompts())
    })
  }
  
  async function updateEmployeeRole() {

    const employees = await db.findAllEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
  
    const roles = await db.findAllRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want to assign the selected employee?",
            choices: roleChoices
        }
    ])
    .then(res => {
        const employeeId = res.employeeId;
        const roleId = res.roleId;
        db.updateEmployeeRole(employeeId, roleId)
          .then(() => console.log(`Updated role for employee id ${employeeId} in the database`))
          .then(() => loadPrompts())
    })
  }

//  // Exit the application
function quit() {

    db.closeConnection();
    console.log('Thank you for using T-Time Employee Tracker - Goodbye!');
    process.exit();
}

