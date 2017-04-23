/**
 * This module is responsible for User api requests.
 */
User = module.exports = {};

/**
 * Setup takes an express application server and configures
 * it to handle errors.
 *
 * User details are verified and then a JSON response is
 * sent to the browser.
 */

User.setup = function(app) {

  // Our logger for logging to file and console
  var logger = require(__dirname + '/../logger');
  // config
  var config = require(__dirname + '/../config');
  var HTTP = require(__dirname + '/../http-response');
  var MESSAGES = require(__dirname + '/../strings');
  // mysql model
  var MySQL = require(__dirname + '/../models/Mysql');
  var Response = require(__dirname + '/../models/Response');
  var User = require(__dirname + '/../models/User');
  var fs = require('fs');

  // add business api
  app.post('/api/user/signup', function(req, res) {

    logger.info('Inside POST /api/user/signup');

    var post = req.body;
    var data = {};
    var responseJSON = {};

    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {

      // mysql model instance
      var mySqlModel = new MySQL();
    
      // prepare insert query
      var queryString = mySqlModel.perpareInsertQuery('users', post);

      // check db connection
      if ( config.mysqlConnection ) {
        var emailQuery = "Select count(*) as total from users where email = '" + post.email + "'";
        mySqlModel.executeQuery(config.mysqlConnection, emailQuery, function duplicateCallback(err, result){

          if (err) { 
            // mysql query execution error
            logger.info(JSON.stringify(err));
            responseJSON.status = MESSAGES.FAIL;
            responseJSON.message =  MESSAGES.ERROR_QUERY_EXECUTION + ' error: '  + JSON.stringify(err);
            // response to request
            res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
            return;
          }
          
          if ( result && result.length && result[0].total > 0 ) {

            logger.info('User already exists with email: ' + post.email);
            responseJSON.status = MESSAGES.FAIL;
            responseJSON.message =  MESSAGES.ERROR_USER_ALREADY_EXISTS;
            // response to request
            res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
            return;
          }
          // execute insert query
          mySqlModel.executeQuery( config.mysqlConnection, queryString, function insertCallback(err, result) {

            if (err) { 
              // mysql query execution error
              logger.info(JSON.stringify(err));
              responseJSON.status = MESSAGES.FAIL;
              responseJSON.message =  MESSAGES.ERROR_QUERY_EXECUTION + ' error: '  + JSON.stringify(err);
              // response to request
              res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
              return;
            }
            
            // user added successfully
            logger.info( MESSAGES.USER_ADDED_SUCCESSFULLY );
            responseJSON.status = MESSAGES.OK;
            responseJSON.message =  MESSAGES.USER_ADDED_SUCCESSFULLY;
            // response to request
            res.jsonp(HTTP.OK, responseJSON);

          });

        })
        
        

      } else {
        // sending response
        Response.CONNECTION_ERROR(res, responseJSON);
      }
   
    } else {
      // sending response
      Response.INVALID_POST(res, responseJSON);
    }

  });

  // favourite api
  app.post('/api/user/favourite', function(req, res) {

    logger.info('Inside POST /api/user/favourit');

    var post = req.body;
    var data = {};
    var responseJSON = {};
    console.log(post);
    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {

      // mysql model instance
      var mySqlModel = new MySQL();
    
      // prepare insert query
      var queryString = mySqlModel.perpareInsertQuery('favourites', post);

      // check db connection
      if ( config.mysqlConnection ) {
        // execute insert query
        mySqlModel.executeQuery( config.mysqlConnection, queryString, function insertCallback(err, result) {

          if (err) { 
            // mysql query execution error
            logger.info(JSON.stringify(err));
            responseJSON.status = MESSAGES.FAIL;
            responseJSON.message =  MESSAGES.ERROR_QUERY_EXECUTION + ' error: '  + JSON.stringify(err);
            // response to request
            res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
            return;
          }
          
          // user added successfully
          logger.info( MESSAGES.FAVOURITE_ADDED_SUCCESSFULLY );
          responseJSON.status = MESSAGES.OK;
          responseJSON.message =  MESSAGES.FAVOURITE_ADDED_SUCCESSFULLY;
          // response to request
          res.jsonp(HTTP.OK, responseJSON);

        });
      } else {
        // sending response
        Response.CONNECTION_ERROR(res, responseJSON);
      }
   
    } else {
      // sending response
      Response.INVALID_POST(res, responseJSON);
    }

  });

  // favourite list get api
  app.get('/api/user/favourite', function(req, res) {
    
    logger.info('Inside GET /api/user/favourite');
    var responseJSON = {};

    if ( req.query.userId ) {
      // mysql model instance
      var mySqlModel = new MySQL();

      if ( config.mysqlConnection ) {

        var favQuery = mySqlModel.getFavouriteQuery(req.query.userId);

        var userModel = new User();
        userModel.getFavouritesList(mySqlModel, favQuery, function favCallback(error, favList) {

          if (error) { 
            // mysql query execution error
            logger.info(JSON.stringify(error));
            responseJSON.status = MESSAGES.FAIL;
            responseJSON.message =  MESSAGES.ERROR_QUERY_EXECUTION + ' error: '  + JSON.stringify(err);
            // response to request
            res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
            return;   
          }
          
          responseJSON.status = MESSAGES.OK;
          responseJSON.data = favList || [];          
          // response to request
          res.jsonp(HTTP.OK, responseJSON);
          return;
        });
      
      } else {
        // sending response
        Response.CONNECTION_ERROR(res, responseJSON);      
      }
    
    } else {
       Response.QUERY_PARAM_MISSING_ERROR(res, responseJSON); 
    }
      

  });

  app.post('/api/user/login', function(req, res) {
    
    logger.info('Inside POST /api/user/login');
    
    var responseJSON = {};
    var post = req.body;
    if ( Object.keys(post).length ) {

      var mySqlModel = new MySQL();

      var queryString = "Select id, email from users where email = '" + post.email + "' AND password = '" + post.password + "'";
      mySqlModel.executeQuery(config.mysqlConnection, queryString, function duplicateCallback(err, result){
  
        if (err) { 
          // mysql query execution error
          logger.info(JSON.stringify(err));
          responseJSON.status = MESSAGES.FAIL;
          responseJSON.message =  MESSAGES.ERROR_QUERY_EXECUTION + ' error: '  + JSON.stringify(err);
          // response to request
          res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
          return;
        }
        
        if ( result && result.length ) {

          logger.info( MESSAGES.USER_LOGIN_SUCCESSFULLY + ' : ' + post.email);
          responseJSON.status = MESSAGES.OK;
          responseJSON.message =  MESSAGES.USER_LOGIN_SUCCESSFULLY;
          responseJSON.data = result[0];            
          // response to request
          res.jsonp(HTTP.OK, responseJSON);
          return;
          
        } else {

          responseJSON.status = MESSAGES.FAIL;
          responseJSON.message =  MESSAGES.INVALID_LOGIN;
          // response to request
          res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
        }
      });

    } else {

      responseJSON.status = STRINGS.FAIL;
      responseJSON.error = STRINGS.INVALID_POST
      res.status(HTTP.BAD_REQUEST).jsonp(responseJSON);
    }
  });

}

