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
  var fs = require('fs');

  // add business api
  app.post('/api/user/signup', function(req, res) {

    logger.info('Inside POST /api/business');

    var post = req.body;
    var data = {};
    var responseJSON = {};
    console.log(post);
    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {

      // mysql model instance
      var mySqlModel = new MySQL();
    
      // prepare insert query
      var queryString = mySqlModel.perpareInsertQuery('users', post);

      // check db connection
      if ( config.mysqlConnection ) {
        var emailQuery = "Select count(*) as total from users where email = '" + post.email + "'";
        console.log(emailQuery);
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

}

