var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname+'/frontend');

var db = require('mongoose');
db.connect('mongodb://localhost/test');

app.get('/bower/*', function(req, res) {
	res.sendFile(__dirname+"/frontend/bower_components/"+req.params[0]);
});
app.get('/js/*', function(req, res) {
	res.sendFile(__dirname+"/frontend/js/"+req.params[0]);
});
app.get('/css/*', function(req, res) {
	res.sendFile(__dirname+"/frontend/css/"+req.params[0]);
});

app.get('/', function(req, res) {
	res.redirect('/portal');
});

app.use('/portal', require('./routes/portal')(express, db));
app.use('/reporting', require('./routes/reporting')(express, db));
app.use('/license', require('./routes/license')(express,db));
app.use('/product', require('./routes/product')(express,db));

app.locals = require('./locals');

var server = app.listen(8080, function() {
    console.log('Express is listening to http://localhost:8080');
});

process.on('SIGINT', function() {
	console.log("\nShutting down..");
});
