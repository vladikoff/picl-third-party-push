var express = require('express'),
  app = express();

var push = require('./lib/push');
var dropbox = require('./lib/dropbox');
var glass = require('./lib/glass');


var port = process.env.PORT || 8500;

// enable express strict routing, see http://expressjs.com/api.html#app-settings
// for more info
app.enable('strict routing');

/**
 * express app configuration
 */
app.configure(function () {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  // use the router
  app.use(app.router);
  // error handling config
  app.use(express.errorHandler({
    dumpExceptions: false,
    showStack: false
  }));
});

/**
 * Server configuration
 */
app.listen(port);
console.log('Starting a server on port: ' + port);


app.get('/connect', function (req, res, next) {
  if (!dropbox.isConnected()) {
    console.log(req.query);
    dropbox.connect(req.query);
    res.redirect(glass.AUTH_URL);
    //res.sendfile('static/connect.html');
  } else {
    res.sendfile('static/connect.html');
  }
});

app.get('/glass_receiver', function (req, res, next) {
  var code = req.query.code;
  if (code) {
    glass.oauth2Client.getToken(code, function(err, tokens) {
      glass.oauth2Client.credentials = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      };

      res.sendfile('static/connect.html');
    });
  } else {
    console.log('no code');
  }
});

/**
 * express app router
 */
app.get('/', function (req, res, next) {
  res.send('...');
});
