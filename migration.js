
let sqlite3 = require('sqlite3');
let db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

db.serialize(() => {

	const create_employee_sql = `CREATE TABLE IF NOT EXISTS Employee (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	position TEXT NOT NULL,
	wage INTEGER NOT NULL,
	is_current_employee INTEGER DEFAULT 1
	);`

	const create_timesheet_sql = `CREATE TABLE IF NOT EXISTS Timesheet (
	id INTEGER PRIMARY KEY,
	hours INTEGER NOT NULL,
	rate INTEGER NOT NULL,
	date INTEGER NOT NULL,
	employee_id INTEGER NOT NULL,
	FOREIGN KEY(employee_id) REFERENCES Employee(id)
	);`

	const create_menu_sql = `CREATE TABLE IF NOT EXISTS Menu (
	id INTEGER PRIMARY KEY,
	title TEXT NOT NULL
	);`

	const create_menuItem_sql = `CREATE TABLE IF NOT EXISTS MenuItem (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	inventory INTEGER NOT NULL,
	price INTEGER NOT NULL,
	menu_id INTEGER NOT NULL,
	FOREIGN KEY(menu_id) REFERENCES Menu(id)
	);`

	db.run(create_employee_sql);
	db.run(create_timesheet_sql);
	db.run(create_menu_sql);
	db.run(create_menuItem_sql);

});


