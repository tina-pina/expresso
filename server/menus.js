let sqlite3 = require('sqlite3');
let db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

const menusRouter = require('express').Router();

module.exports = menusRouter;

menusRouter.get('/', (req, res, next) => {
	db.all('SELECT * FROM Menu', (err, rows) => {
		if(err) {
			res.sendStatus(500);
		}
		else {
			res.status(200).send({menus: rows})
		}
	})



})

menusRouter.post('/', (req, res, next) => {




})

menusRouter.get('/:menuId', (req, res, next) => {




})

menusRouter.put('/:menuId', (req, res, next) => {




})

menusRouter.delete('/:menuId', (req, res, next) => {




})

menusRouter.get('/:menuId/menu-items', (req, res, next) => {




})

menusRouter.post('/:menuId/menu-items', (req, res, next) => {




})

menusRouter.put('/:menuId/menu-items/:menuItemId', (req, res, next) => {




})

menusRouter.delete('/:menuId/menu-items/:menuItemId', (req, res, next) => {




})
