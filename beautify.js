let beautify = require('js-beautify').js_beautify,
    fs = require('fs');
 
fs.readFile('./server/menus.js', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    console.log(beautify(data, { indent_size: 2 }));
});
