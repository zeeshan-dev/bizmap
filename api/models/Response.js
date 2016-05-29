
var HTTP = require(__dirname + '/../http-response');
var MESSAGES = require(__dirname + '/../strings');
var logger = require(__dirname + '/../logger');

// export the class
response = module.exports = {};

response.INVALID_POST = function(res, responseJSON) {
  
  // invalid post error
  logger.info( MESSAGES.INVALID_POST );
  
  responseJSON.status = MESSAGES.FAIL;
  responseJSON.message =  MESSAGES.INVALID_POST;
  // response to request 
  res.jsonp(HTTP.BAD_REQUEST, responseJSON);
};

response.CONNECTION_ERROR = function(res, responseJSON) {
  
  // db connection error
  logger.info( MESSAGES.ERROR_DB_CONNECTION_ERROR );
  
  responseJSON.status = MESSAGES.FAIL;
  responseJSON.message =  MESSAGES.ERROR_DB_CONNECTION_ERROR;
  // response to request
  res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
};

response.QUERY_EXECUTION_ERROR = function(res, responseJSON) {

  // mysql query execution error
  logger.info(JSON.stringify(err));
  responseJSON.status = MESSAGES.FAIL;
  responseJSON.message = MESSAGES.ERROR_QUERY_EXECUTION + ' error: '  + JSON.stringify(err);
  // response to request
  res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);

};