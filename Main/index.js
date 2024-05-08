const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

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

    // TODO: execute prompts
    loadPrompts(); 

}

function loadPrompts() {

    prompt([
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
    ]).then(res => {
        const choice = res.choice;
        // Call the appropriate function depending on what the user chose
        switch (choice) {
            case "VIEW_DEPARTMENTS":
                viewDepartments();
            break;
            case "VIEW_ROLES":
                viewRoles();
            break;
            case "VIEW_EMPLOYEES":
                viewEmployees();
            break;
            case "ADD_DEPARTMENT":
                addDepartment();
            break;
            case "ADD_ROLE":
                addRole();
            break;
            case "ADD_EMPLOYEE":
                addEmployee();
            break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
            break;
            default:
                quit();
            break;  
        }
    })
 }




 // Exit the application
function quit() {
    console.log("Thank you for using T-Time Employee Tracker - Goodbye!");
    process.exit();
  }
  