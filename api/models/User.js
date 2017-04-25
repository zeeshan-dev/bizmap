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

module.exports = User;