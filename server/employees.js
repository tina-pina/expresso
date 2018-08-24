let sqlite3 = require('sqlite3');
let db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

const employeesRouter = require('express').Router();


module.exports = employeesRouter;

employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  const sql = 'SELECT * FROM Employee WHERE id = $id';
  const values = {$id: req.params.employeeId};
  db.get(sql, values, (error, row) => {
    if (error) {
      next(error);
    } else if (row) {
      req.employee = row;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

employeesRouter.param('timesheetId', (req, res, next, timesheetId) => {
  const sql = 'SELECT * FROM Timesheet WHERE id = $id';
  const values = {$id: req.params.timesheetId};
  db.get(sql, values, (error, row) => {
    if (error) {
      next(error);
    } else if (row) {
      req.timesheet = row;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});




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
	
	  let newEmployee = req.body.employee;
  if(!newEmployee.name || !newEmployee.position || !newEmployee.wage) {
    res.sendStatus(400);
}

else {
    db.run(`INSERT INTO Employee (name, position, wage) 
          VALUES ($name, $position, $wage)`, 
          {
            $name: newEmployee.name,
            $position: newEmployee.position,
            $wage: newEmployee.wage
          }, function (err) {
            
            if(err) {
              res.sendStatus(500);
            } 
            else {
              db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`, (err, row) => {
                res.status(201).send({employee: row});
              })
          	}
      	})
	}
})

employeesRouter.get('/:employeeId', (req, res, next) => {
	res.status(200).send({employee: req.employee});
})


function getUpdateEmployee(field, value, id) {
  return `UPDATE Employee SET ${field} = '${value}' WHERE id=${id}`
}

employeesRouter.put('/:employeeId', (req, res, next) => {

	let newEmployee = req.body.employee

  if(!newEmployee.name || 
     !newEmployee.position || 
     !newEmployee.wage) {
    res.sendStatus(400);
  
  } else {

    db.serialize(() => {
    
      db.run(getUpdateEmployee('name', newEmployee.name, req.params.employeeId));
      db.run(getUpdateEmployee('position', newEmployee.position, req.params.employeeId));
      db.run(getUpdateEmployee('wage', newEmployee.wage, req.params.employeeId));
      
      
      db.get('SELECT * FROM Employee WHERE id = $id', 
        {$id: req.params.employeeId}, 
        (err, row) => {
          res.status(200).send({employee: row});
        }
      );
    }) 
  }
})

employeesRouter.delete('/:employeeId', (req, res, next) => {

	db.serialize(() => {
    db.run(
      'UPDATE Employee SET is_current_employee = 0 WHERE id=$id', 
      {$id: req.params.employeeId}, 
      (err) => {}
    )
    db.get('SELECT * FROM Employee WHERE id = $id', 
      {$id: req.params.employeeId}, 
      (err, row) => {
        res.status(200).send({employee: row});
      }
    );
  }) 


})

employeesRouter.get('/:employeeId/timesheets', (req, res, next) => {

  db.all('SELECT * FROM Timesheet WHERE employee_id = $id', 
              {$id: req.params.employeeId},
              (err, rows) => {
                if(err) {
                  res.sendStatus(500);
                }
                else if(rows) {
                  res.status(200).send({timesheets: rows});
                }
                else {
                  res.sendStatus(404);
                }
            })
})

// { timesheet: { hours: 10, rate: 3.5, date: 100 } }

employeesRouter.post('/:employeeId/timesheets', (req, res, next) => {

	let newTimesheet = req.body.timesheet;
  	if(!newTimesheet.hours || 
     !newTimesheet.rate || 
     !newTimesheet.date) {
    res.sendStatus(400);

} 	else {
    db.run(
      `INSERT INTO Timesheet (hours, rate, date) 
      VALUES ($hours, $rate, $date)`, 
      {
        $hours: newTimesheet.hours,
        $rate: newTimesheet.rate, 
        $date: newTimesheet.date
      }, function (err) {
      	if(err) {
          res.sendStatus(500);
        } 
        else {
          db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID}`, (err, row) => {
            res.status(201).send({timesheet: row});
          })
        }
      })
	}
})

function getUpdateTimesheetSQL(field, value, id) {
  return `UPDATE Timesheet SET ${field} = '${value}' WHERE id=${id}`
}

employeesRouter.put('/:employeeId/timesheets/:timesheetId', (req, res, next) => {
	
	 let newTimesheet = req.body.timesheet;
  	if(!newTimesheet.hours || 
     !newTimesheet.rate || 
     !newTimesheet.date ||
     !newTimesheet.employeeId) {
    res.sendStatus(400);
  
  } else {

    db.serialize(() => {
    
      db.run(getUpdateTimesheetSQL('hours', newTimesheet.hours, req.params.timesheetId));
      db.run(getUpdateTimesheetSQL('rate', newTimesheet.rate, req.params.timesheetId));
      db.run(getUpdateTimesheetSQL('date', newTimesheet.date, req.params.timesheetId));
      db.run(getUpdateTimesheetSQL('employee_id', newTimesheet.timesheetId, req.params.timesheetId));
      
      
      db.get('SELECT * FROM Timesheet WHERE id = $id', 
        {$id: req.params.timesheetId}, 
        (err, row) => {
          res.status(200).send({timesheet: row});
        }
      );
    }) 
  }
})

employeesRouter.delete('/:employeeId/timesheets/:timesheetId', (req, res, next) => {

  const deleteSql = 'DELETE FROM Timesheet WHERE id = $timesheetId';
  const deleteValues = {$timesheetId: req.params.timesheetId};

  db.run(deleteSql, deleteValues, function(err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
})
