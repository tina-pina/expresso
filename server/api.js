const express = require('express');
const apiRouter = express.Router();

const employeesRouter = require('./employees');
const menusRouter = require('./menus');
const menuItemRouter = require('./menuItem');
const timesheetRouter = require('./timesheet');

apiRouter.use('/employees', employeesRouter);
apiRouter.use('/menus', menusRouter);
apiRouter.use('/menuItem', menuItemRouter);
apiRouter.use('/timesheet', timesheetRouter);

module.exports = apiRouter;