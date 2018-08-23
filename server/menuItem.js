let sqlite3 = require('sqlite3');
let db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

const menuItemRouter = require('express').Router();

module.exports = menuItemRouter;
