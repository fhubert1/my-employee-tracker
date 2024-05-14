const { Pool } = require('pg');
const db = require('../db/connection');

// Mock Pool instance
jest.mock('pg', () => {
    const mPool = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn()
    };
    return { Pool: jest.fn(() => mPool) };
});

// set up and tear down for test cases
describe('Database Functions', () => {
    let pool;

    beforeAll(() => {
        pool = new Pool();
    });

    afterAll(() => {
        pool.end();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // test cases for retrieving all the departments
    describe('findAllDepartments', () => {

        it('should return all departments', async () => {

            // Mock pool.query to return a dummy row
            const expectedResult = [{ id: 1, name: 'Pro Shop' }];
            pool.query.mockResolvedValue({ rows: expectedResult });

            // Call the function
            const result = await db.findAllDepartments();

            // Assertions
            // Ensure the result matches the expected row
            expect(result).toEqual(expectedResult);
            // Ensure pool.query was called with the correct SQL query and parameters
            expect(pool.query).toHaveBeenCalledWith('SELECT id, name FROM department;');
        });

        // test error processing - same test performed for all the cases
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });

    });

    // test cases for retrieving all the roles
    describe('findAllRoles', () => {
        it('should return all roles', async () => {

            // Mock pool.query to return a dummy row
            const expectedResult = [{ id: 1, name: 'Pro Shop Manager' }];
            pool.query.mockResolvedValue({ rows: expectedResult });

            // Call the function
            const result = await db.findAllRoles();

            // Assertions
            // Ensure the result matches the expected row            
            expect(result).toEqual(expectedResult);
            // Ensure pool.query was called with the correct SQL query and parameters            
            expect(pool.query).toHaveBeenCalledWith('SELECT role.id, title, salary, department.name AS department FROM role left join department on department.id = role.department_id;');
        });

        // test error processing
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });

    });

    // test cases for retrieving all the employees
    describe('findAllEmployees', () => {
        it('should return all employees', async () => {

             // Mock pool.query to return a dummy row
            const expectedResult = [{ id: 1, first_name: 'Kathryn', last_name: 'Doe', role_id: 1, manager_id: null }];
            pool.query.mockResolvedValue({ rows: expectedResult });

            // Call the function
            const result = await db.findAllEmployees();
            // Assertions
            // Ensure the result matches the expected row            
            expect(result).toEqual(expectedResult);
            // Ensure pool.query was called with the correct SQL query and parameters            
            expect(pool.query).toHaveBeenCalledWith("SELECT e.id AS employee_id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,  CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN   department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;");

        });

        // test error processing
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });

    });

    // test cases to create a new department
    describe('createDepartment', () => {
        it('create a new department', async () => {

            // Mock pool.query to return a dummy row
            const mockRow = { rows: [{ id: 1, name: 'Human Resources' }] };
            pool.query.mockResolvedValueOnce(mockRow);

            // Call the function
            const department = 'Human Resources';
            const result = await db.createDepartment(department);

            // Assertions
            // Ensure the result matches the expected row
            expect(result).toEqual(mockRow.rows);
            // Ensure pool.query was called with the correct SQL query and parameters
            expect(pool.query).toHaveBeenCalledWith("INSERT INTO department (name) VALUES ($1)", [department]);

        });

        // test error processing
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });
    });

    // test cases to create a new role
    describe('createRole', () => {
        it('create a new role', async () => {

            // Mock pool.query to return a dummy row
            const mockRow = { rows: [{ id: 1, title: 'Test Role', salary: 10000, department_id: 1 }] };

            pool.query.mockResolvedValueOnce(mockRow);

            // Call the function
            const role = { title: 'Test Role', salary: 10000, department_id: 1 };
            const result = await db.createRole(role);

            // Assertions
            // Ensure the result matches the expected row
            expect(result).toEqual(mockRow.rows);
            // Ensure pool.query was called with the correct SQL query and parameters
            expect(pool.query).toHaveBeenCalledWith("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", [role.title, role.salary, role.department_id]);

        });

        // test error processing
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });
    });

    // test cases to create a new employee
    describe('createEmployee', () => {
        it('create a new employee', async () => {

            // Mock pool.query to return a dummy row
            const mockRow = { rows: [{ id: 1, first_name: 'Ethan', last_name: 'Hawke', role_id: 1, manager_id: null }] };

            pool.query.mockResolvedValueOnce(mockRow);

            // Call the function
            const empl = { firstName: 'Ethan', lastName: 'Hawke', roleId: 1, managerId: null };
            const result = await db.createEmployee(empl);

            // Assertions
            // Ensure the result matches the expected row
            expect(result).toEqual(mockRow.rows);
            // Ensure pool.query was called with the correct SQL query and parameters
            expect(pool.query).toHaveBeenCalledWith("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", [empl.firstName, empl.lastName, empl.roleId, empl.managerId]);

        });

        // test error processing
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });
    });

    // test cases to create a new employee
    describe('createEmployee', () => {
        it('create a new employee', async () => {

            // Mock pool.query to return a dummy row
            const mockRow = { rows: [{ id: 1, first_name: 'Ethan', last_name: 'Hawke', role_id: 1, manager_id: null }] };

            pool.query.mockResolvedValueOnce(mockRow);

            // Call the function
            const empl = { firstName: 'Ethan', lastName: 'Hawke', roleId: 1, managerId: null };
            const result = await db.createEmployee(empl);

            // Assertions
            // Ensure the result matches the expected row
            expect(result).toEqual(mockRow.rows);
            // Ensure pool.query was called with the correct SQL query and parameters
            expect(pool.query).toHaveBeenCalledWith("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", [empl.firstName, empl.lastName, empl.roleId, empl.managerId]);

        });

        // test error processing
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });
    });

    // test suite to create a new employee
    describe('updateEmployeeRole', () => {
        it('update an employees role in the database', async () => {

            // Mock pool.query to return a dummy row
            const mockRow = { rows: [{ id: 1 }] };

            pool.query.mockResolvedValueOnce(mockRow);

            // Call the function
            const employeeId = 1;
            const roleId = 3;
            const result = await db.updateEmployeeRole(employeeId, roleId);

            // Assertions
            // Ensure the result matches the expected row
            expect(result).toEqual(mockRow.rows);
            // Ensure pool.query was called with the correct SQL query and parameters
            expect(pool.query).toHaveBeenCalledWith("UPDATE employee SET role_id = $1 WHERE id = $2", [roleId, employeeId]);

        });

        // test error processing
        it('should throw an error if query fails', async () => {
            const errorMessage = 'Test Database error';
            pool.query.mockRejectedValue(new Error(errorMessage));

            await expect(db.findAllDepartments()).rejects.toThrow(errorMessage);
        });
    });

});
