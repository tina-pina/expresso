let sqlite3 = require('sqlite3');
let db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

const employeesRouter = require('express').Router();


module.exports = employeesRouter;

employeesRouter.get('/', (req, res, next) => {
	db.all('SELECT * FROM Employee WHERE is_current_employee = 1', (err, rows) => {
		if(err) {
			res.sendStatus(500);
		}
		else {
			res.status(200).send({employees: rows})
		}
	})
})

employeesRouter.post('/', (req, res, next) => {




})

employeesRouter.get('/:employeeId', (req, res, next) => {




})

employeesRouter.put('/:employeeId', (req, res, next) => {




})

employeesRouter.delete('/:employeeId', (req, res, next) => {




})

employeesRouter.get('/:employeeId/timesheets', (req, res, next) => {




})

employeesRouter.post('/:employeeId/timesheets', (req, res, next) => {




})

employeesRouter.put('/:employeeId/timesheets/:timesheetId', (req, res, next) => {




})

employeesRouter.delete('/:employeeId/timesheets/:timesheetId', (req, res, next) => {




})
