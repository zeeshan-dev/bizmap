'use strict'


var HTTP = require(__dirname + '/../http-response');
var STRINGS = require(__dirname + '/../strings');
var logger = require(__dirname + '/../logger');
var config = require(__dirname + '/../config');
var MESSAGES = require(__dirname + '/../strings');
var MySQL = require(__dirname + '/Mysql');

/**
 * Contains all User functions.
 * @class User
 * @classdesc User Class
 *
 * @params any db model
 *
 * @return none
 */
function User () {
};

/**
* @memberof User
* @function getFavouritesList
* @description get list of favourite businesses
*
* @param where contition object
* @param callback funtion
* @returns callback
**/
User.prototype.getFavouritesList = function getFavourites ( mySqlModel, queryString, callback) {

  mySqlModel.executeQuery(config.mysqlConnection, queryString, function duplicateCallback(err, result){

    if (err) { 
      callback(STRINGS.ERROR_QUERY_EXECUTION, null);
      return;
    }
    
    if ( result && result.length ) {

      callback(null, result);
      return;
    } else {

      callback(null, []);
    }
  });
 
 };

 /**
* @memberof User
* @function addRemoveFavourite
* @description add or remove favourite
*
* @param where contition object
* @param callback funtion
* @returns callback
**/
User.prototype.addRemoveFavourite = function addRemoveFavourite ( req, res, mySqlModel, post, responseJSON) {

  var sql = "DELETE FROM ?? WHERE userId = ? AND businessId = ? ";
  var deleteThis = ['favourites', post.userId , post.businessId];
  sql = config.mysqlConnection.format(sql, deleteThis);

  mySqlModel.executeQuery(config.mysqlConnection, sql, function insertCallback(err, results) {

    if (err) { 
      logger.info(JSON.stringify(err));
    }

    logger.info('Deleted count: ' + results.affectedRows);
  
    if ( results.affectedRows == 0 ) {

      // business added to fav successfully
      responseJSON.status = MESSAGES.OK;
      responseJSON.message =  MESSAGES.FAVOURITE_ADDED_SUCCESSFULLY;
      // response to request
      res.jsonp(HTTP.OK, responseJSON);

      var queryString = mySqlModel.perpareInsertQuery('favourites', post);
      mySqlModel.executeQuery(config.mysqlConnection, queryString, function insertCallback(err, result){

        if (err) { 
          // mysql query execution error
          logger.info(JSON.stringify(err));
        } else {
           // business added to fav successfully
          logger.info( MESSAGES.FAVOURITE_ADDED_SUCCESSFULLY );
        }

      });

    } else {

      // business removed from fav successfully
      logger.info( MESSAGES.FAVOURITE_REMOVED );
      responseJSON.status = MESSAGES.OK;
      responseJSON.message =  MESSAGES.FAVOURITE_REMOVED;
      // response to request
      res.jsonp(HTTP.OK, responseJSON);
      return;
    }
    
  });

};

/**
* @memberof User
* @function forgotPasswordRequest
* @description add forgot password request
*
* @param where contition object
* @param callback funtion
* @returns callback
**/
User.prototype.forgotPasswordRequest = function forgotPasswordRequest ( req, res, mySqlModel, Email, post, responseJSON) {

  var emailQuery = "Select * from users where email = '" + post.email + "' LIMIT 1";

  mySqlModel.executeQuery(config.mysqlConnection, emailQuery, function userCallback(err, result) {

    if ( result && result.length ) {
      var password = Math.random().toString(36).slice(-8);
      var sql = "UPDATE ?? SET password = ? WHERE email = ? ";
      var updateThis = ['users', password , post.email];
      sql = config.mysqlConnection.format(sql, updateThis);
      var userName = result[0]['name'];
      logger.info('Forgot password query: ', sql, userName);
      mySqlModel.executeQuery(config.mysqlConnection, sql, function updateCallback(err, results) {

        if (err) { 
          logger.info(JSON.stringify(err));
        }

        logger.info('Updated count: ' + results.affectedRows);
      
        if ( results.affectedRows == 0 ) {

        } else {

          var ejs = require( 'ejs' );
          var data = {
            name: userName,
            password: password
          };
          ejs.renderFile( config.email.templatePath + 'forgot-password.html', data, {}, function ejsRenderCompleted( err, message ) {
          var mailOptions = {
            from:'Yellow Pages of Pakistan <' + config.smtp.user + '>',  // sender address
            to: post.email.trim(),
            subject: MESSAGES.EMAIL_SUBJECT_NEW_PASSWORD, 
            html: message
          }
          // Send the email
          Email.sendEmail( mailOptions);
      });

           // business added to fav successfully
          responseJSON.status = MESSAGES.OK;
          responseJSON.message =  MESSAGES.OK;
          // response to request
          res.jsonp(HTTP.OK, responseJSON);
        }
        
      });

    } else {

      responseJSON.status = MESSAGES.FAIL;
      responseJSON.message =  MESSAGES.EMAIL_NOT_EXIST;
      // response to request
      res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
      return;
    }

  });
 
 };

/**
* @memberof User
* @function getBusinessCode
* @description get latest business code
*
* @param where contition object
* @param callback funtion
* @returns callback
**/
User.prototype.getBusinessCode = function getBusinessCode ( mySqlModel, callback) {

  var queryString = "SELECT code FROM bizmap.business ORDER BY code DESC LIMIT 0, 1";
  mySqlModel.executeQuery(config.mysqlConnection, queryString, function businessCodeCallback(err, result){

    if (err) { 
      callback(STRINGS.ERROR_QUERY_EXECUTION, 0);
      return;
    }
    
    if ( result && result.length ) {
      var code = Number(result[0].code) +1;
      callback(null, code);
      return;
    } else {

      callback(null, 0);
    }
  });
}

  /**
* @memberof User
* @function addBusinessCode
* @description add latest business code
*
* @param where contition object
* @param callback funtion
* @returns callback
**/
User.prototype.addBusinessCode = function addBusinessCode ( mySqlModel, queryString) {

  mySqlModel.executeQuery(config.mysqlConnection, queryString, function businessCodeCallback(err, result){

    if (err) { 
      logger.info(JSON.stringify(err));
      return;
    }
    
    logger.info('Updated count: ' + result.affectedRows);
    
  });
 
};
 

module.exports = User;