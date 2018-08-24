let sqlite3 = require('sqlite3');
let db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

const menusRouter = require('express').Router();

module.exports = menusRouter;

menusRouter.param('menuId', (req, res, next, menuId) => {
  const sql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
  const values = {$menuId: menuId};
  db.get(sql, values, (error, row) => {
    if (error) {
      next(error);
    } else if (row) {
      req.menu = row;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

menusRouter.param('menuItemId', (req, res, next, menuItemId) => {
  const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
  const values = {$menuItemId: menuItemId};
  db.get(sql, values, (error, row) => {
    if (error) {
      next(error);
    } else if (row) {
      req.menuItem = row;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});


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
	
	let newMenu = req.body.menu;
  if(!newMenu.title) {
    res.sendStatus(400);
}

else {
    db.run(`INSERT INTO Menu (title) 
          VALUES ($title)`, 
          {
            $title: newMenu.title
  
          }, function (err) {
            
            if(err) {
              res.sendStatus(500);
            } 
            else {
              db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err, row) => {
                res.status(201).send({menu: row});
              })
          	}
      	})
	}
})


menusRouter.get('/:menuId', (req, res, next) => {

res.status(200).send({menu: req.menu});
})

function getUpdateMenu(field, value, id) {
  return `UPDATE Menu SET ${field} = '${value}' WHERE id=${id}`
}

menusRouter.put('/:menuId', (req, res, next) => {

	let newMenu = req.body.menu

  if(!newMenu.title) {
    res.sendStatus(400);
  
  } else {

    db.serialize(() => {
    
      db.run(getUpdateMenu('title', newMenu.title, req.params.menuId));
      
      
      db.get('SELECT * FROM Menu WHERE id = $id', 
        {$id: req.params.menuId}, 
        (err, row) => {
          res.status(200).send({menu: row});
        }
      );
    }) 
  }
})

menusRouter.delete('/:menuId', (req, res, next) => {

  const menuItemSql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
  const menuItemValues = {$menuId: req.params.menuId};
  
  db.get(menuItemSql, menuItemValues, (error, menuItem) => {
    if (error) {
      next(error);
    } else if (menuItem) {
      res.sendStatus(400);
    } else {
      
      const deleteSql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
      const deleteValues = {$menuId: req.params.menuId};

      db.run(deleteSql, deleteValues, (error) => {
        if (error) {
          next(error);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
})




menusRouter.get('/:menuId/menu-items', (req, res, next) => {
	db.all(
    'SELECT * FROM MenuItem WHERE menu_id = $id', 
    {$id: req.params.menuId},
    (err, rows) => {
      if(err) {
        res.sendStatus(500);
      }
      else if(rows) {
        res.status(200).send({menuItems: rows});
      }
      else {
        res.sendStatus(404);
      }
    })
})

// { menuItem: 
//    { name: 'New Menu Item',
//      description: 'New Description',
//      inventory: 20,
//      price: 1.5 } }

menusRouter.post('/:menuId/menu-items', (req, res, next) => {
   let newMenuItem = req.body.menuItem;
  if(!newMenuItem.name || 
     !newMenuItem.description || 
     !newMenuItem.inventory || 
     !newMenuItem.price) {
    res.sendStatus(400);
  } else {
    db.run(
      `INSERT INTO MenuItem (name, description, inventory, price, menu_id) 
      VALUES ($name, $description, $inventory, $price, $menu_id)`, 
      {
        $name: newMenuItem.name,
        $description: newMenuItem.description, 
        $inventory: newMenuItem.inventory,
        $price: newMenuItem.price,
        $menu_id: req.params.menuId
      }, function (err) {
        if(err) {
          res.sendStatus(500);
        } 
        else {
          db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`, (err, row) => {
            res.status(201).send({menuItem: row});
          })
        }
      })
	}
})

function getUpdateMenuItemSQL(field, value, id) {
  return `UPDATE MenuItem SET ${field} = '${value}' WHERE id=${id}`
 }

menusRouter.put('/:menuId/menu-items/:menuItemId', (req, res, next) => {

	let newMenuItem = req.body.menuItem;
  if(!newMenuItem.name || 
     !newMenuItem.description || 
     !newMenuItem.inventory || 
     !newMenuItem.price) {
     res.sendStatus(400);
    
  } else {

    db.serialize(() => {
    
      db.run(getUpdateMenuItemSQL('name', newMenuItem.name, req.params.menuItemId));
      db.run(getUpdateMenuItemSQL('description', newMenuItem.description, req.params.menuItemId));
      db.run(getUpdateMenuItemSQL('inventory', newMenuItem.inventory, req.params.menuItemId));
      db.run(getUpdateMenuItemSQL('price', newMenuItem.price, req.params.menuItemId));
      db.run(getUpdateMenuItemSQL('menu_id', req.params.menuId, req.params.menuItemId));

      
      db.get('SELECT * FROM MenuItem WHERE id = $id', 
        {$id: req.params.menuItemId}, 
        (err, row) => {
          res.status(200).send({menuItem: row});
     	}
      );
    }) 
  }
});


menusRouter.delete('/:menuId/menu-items/:menuItemId', (req, res, next) => {

  const deleteSql = 'DELETE FROM MenuItem WHERE id = $menuItemId';
  const deleteValues = {$menuItemId: req.params.menuItemId};

  db.run(deleteSql, deleteValues, function(err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })


})
