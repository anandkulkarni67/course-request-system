// package imports
var express = require('express');
var bodyParser = require('body-parser')
var ejs = require('ejs');
var oracledb = require('oracledb');

// local imports
var appConstants = require('./applicationConstants');
var dbconfig = require('./config/oracleconfig');

oracledb.outFormat = oracledb.ARRAY;
var PORT = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.urlencoded({ 
	extended: true 
}));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));

app.listen(appConstants.PORT, function () {
	console.log('Server started!');
});

// create oracle connection pool
oracledb.connectionClass = dbconfig.connectionClass,

oracledb.createPool({
    user:             dbconfig.user,
    password:         dbconfig.password,
    connectString:    dbconfig.connectString,
    poolMax:          10,
    poolMin:          5,
    poolIncrement:    5,
    poolTimeout:      4
}, function(err, pool) {
    if (err) {
      console.log("ERROR: ", new Date(), ": createPool() callback: " + err.message);
      return;
    }
    // export pool object to the
    require('./util/oracleUtil.js')(pool);
});

var formsModule = require('./forms')(app);
var loginModule = require('./login')(app);
var loginModule = require('./students')(app);