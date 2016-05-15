  /**
   * This module is responsible for Business api requests.
   */
  Business = module.exports = {};

  /**
   * Setup takes an express application server and configures
   * it to handle errors.
   *
   * User details are verified and then a JSON response is
   * sent to the browser.
   */

  Business.setup = function(app) {

    // Our logger for logging to file and console
    var logger = require(__dirname + '/../logger');
    // config
    var config = require(__dirname + '/../config');
    var HTTP = require(__dirname + '/../http-response');
    var MESSAGES = require(__dirname + '/../strings');
    // mysql model
    var MySQL = require(__dirname + '/../models/mysql');
    var fs = require('fs');

    // add business api
    app.post('/api/business', function(req, res) {

      logger.info('Inside POST /api/business');

      var post = req.body;
      var data = {};
      var responseJSON = {};

      // check if post is valid
      if ( post && Object.keys(post).length > 0 ) {

        // mysql model instance
        var mySqlModel = new MySQL();

        // prepare insert query
        var queryString = mySqlModel.perpareInsertQuery(post, 'business');
  
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
            

            var transfer_path = getTransferPath( post.userId, result.insertId, true);

            // check logo file
            if ( Object.keys(req.files.logo).length > 0) {
              // upload business logo
              uploadFile(req.files.logo, transfer_path + 'logo.png', function(err){
                if (err) {
                  logger.info(JSON.stringify(err));
                  return;
                }

              });
            }

            // business added successfully
            logger.info( MESSAGES.BUSINESS_ADDED_SUCCESSFULLY );
            responseJSON.status = MESSAGES.OK;
            responseJSON.message =  MESSAGES.BUSINESS_ADDED_SUCCESSFULLY;
            // response to request
            res.jsonp(HTTP.OK, responseJSON);

          });

        } else {

          // db connection error
          logger.info( MESSAGES.ERROR_DB_CONNECTION_ERROR );
          responseJSON.status = MESSAGES.FAIL;
          responseJSON.message =  MESSAGES.ERROR_DB_CONNECTION_ERROR;
          // response to request
          res.jsonp(HTTP.INTERNAL_SERVER_ERROR, responseJSON);
        }
     
      } else {

        // invalid post error
        logger.info( MESSAGES.INVALID_POST );
        responseJSON.status = MESSAGES.FAIL;
        responseJSON.message =  MESSAGES.INVALID_POST;
        // response to request 
        res.jsonp(HTTP.BAD_REQUEST, responseJSON);
      }

    });

    // remove empty file element from file array
    var resetFileObject = function(array) {

        for (var j = array.length; j--;) {
            if (array[j].size < 350) array.splice(j, 1);
        }
    };

    var uploadFile = function(file, target_path, callback) {

      var is = fs.createReadStream(file.path);
      var os = fs.createWriteStream(target_path);
      is.pipe(os);
      
      is.on('end', function() {

        logger.info('file ' + file.name + ' uploaded successfuly!');
        // remove file from temp folder
        fs.unlinkSync(file.path);
        callback();
      });
      
      is.on('error', function (err) {
        logger.info(JSON.stringify(err));
        callback(err);
      });
    };

    var getTransferPath = function getTransferPath( userId, businessId, logo) {

      var user_folder = config.uploads.path + userId;
      
      // create folder if does not exist
      if (!fs.existsSync(user_folder)) {
        fs.mkdirSync(user_folder);
      }

      var business_folder = user_folder + '/' + businessId;
      if (!fs.existsSync(business_folder)) {
        fs.mkdirSync(business_folder);
      }

      var transfer_path = business_folder + '/banner/';
      if ( logo ) {
        transfer_path = business_folder + '/logo/';
      }

      if (!fs.existsSync(transfer_path)) {
          fs.mkdirSync(transfer_path);
      }

      return transfer_path;
    } 

  }