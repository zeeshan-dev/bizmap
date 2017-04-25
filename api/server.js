/**
 *
 * Developer: Muhammad Zeeshan
 *
 */
 
// Get the configurations
var config = require( __dirname + '/config' );

// Our logger for logging to file and console
var logger = require( __dirname + '/logger' );

// Instance for express server
var express = require( 'express' );
var mysql = require('mysql');

var app = module.exports = express();

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.bodyParser({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));

// We want to gzip all our content before sending.
app.use( express.compress() );

// Support for cross domain.
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


/**
 * Connect to Mysql
 */
var mysqlClient = mysql.createConnection(config.mysql);
mysqlClient.connect(function(err){
  if (err) {
   logger.info('Mysqlconnection error: '+err);
  } else {
  
    logger.info("Mysql connected succesfully.");
    config.mysqlConnection = mysqlClient;
  }

});

var businessController = require( __dirname + '/controllers/BusinessController' );
businessController.setup( app );

var userController = require( __dirname + '/controllers/UserController' );
userController.setup( app, mysql );

// Start the http server
var httpServer;

// SSL Configurations
if ( config.http.enableSSL ) {
  // We will use https
  var https = require('https');
  
  // The certificate and ssl key
  var fs = require('fs');
  var privateKey  = fs.readFileSync( config.http.serverKey, 'utf8');
  var certificate = fs.readFileSync( config.http.serverCertificate, 'utf8');
  
  var options = {
      key: privateKey,
      cert: certificate
  };

  // Create the server
  httpsServer = https.createServer(options, app);
  // Make the server listen
  httpsServer.listen( config.http.port );

} else {
  var http = require('http');
  httpServer = http.createServer(app);
  // Make the server listen
  httpServer.listen( config.http.port );
}


logger.info( 'Listening on port ' + config.http.port + ' with SSL ' + config.http.enableSSL );
