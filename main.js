var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser');
app.use(cookieParser());


/*        PUBLIC DIRECTORIES
          IF A DIR NEEDS AUTHENTICATION,
          DO NOT PUT IT HERE!
*/

app.get('/bower/*', function(req, res) {
	res.sendFile(__dirname+"/bower_components/"+req.params[0]);
});
app.get('/js/*', function(req, res) {
	res.sendFile(__dirname+"/assets/js/"+req.params[0]);
});
app.get('/css/*', function(req, res) {
	res.sendFile(__dirname+"/assets/css/"+req.params[0]);
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/pages/login.html');
});
app.post('/login', function(req, res) {
  console.log(req.body);
  if (req.body.user) {
    var user = req.body.user;
    if (user === "scientaster") {
      res.send({
        'access': 'granted',
        'sessionID': 1234
      });
    } else {
      res.send({
        'access':'denied'
      });
    }
  }
  else {
    res.end();
  }
})


// Leave this function after all other pubkuic
app.all("*", function(req, res, next) {
  // TODO: legit authentication
  if (req.cookies && req.cookies.sessionID == 1234) {
    next();
  } else {
    res.redirect('/login');
  }
})

/*        PRIVATE DIRECTORIES
          IF A DIR NEEDS AUTHENTICATION
          PUT IT HERE!
*/

app.get('/~', function(req, res) {
  res.sendFile(__dirname + '/pages/home.html');
});


var server = app.listen(8080, function() {
    console.log('Express is listening to http://localhost:8080');
});
