'use strict'


var HTTP = require(__dirname + '/../http-response');
var STRINGS = require(__dirname + '/../strings');
var logger = require(__dirname + '/../logger');
var config = require(__dirname + '/../config');
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

module.exports = User;