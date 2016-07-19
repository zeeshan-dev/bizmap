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
    var Response = require(__dirname + '/../models/Response');
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
        var queryString = mySqlModel.perpareInsertQuery('business', post);
  
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
            
            var businessId = result.insertId;
            var transfer_path = getTransferPath( post.userId, businessId, true);

            // check logo file
            if (Object.keys(req.files.logo).length > 0) {
              // upload business logo
              uploadFile(req.files.logo, transfer_path, function(err){
                if (err) {
                  logger.info(JSON.stringify(err));
                  return;
                }

                var metaData = { businessId: businessId, type:'LOGO', name: req.files.logo.name };
                var metaQuery = mySqlModel.perpareInsertQuery('business_meta', metaData);
                mySqlModel.executeQuery( config.mysqlConnection, metaQuery, function insertMetaCallback(err, result) {

                  if (err) { 
                    // mysql query execution error
                    logger.info(JSON.stringify(err));
                    return;
                  }
                });

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
          // sending response
          Response.CONNECTION_ERROR(res, responseJSON);
        }
     
      } else {
        // sending response
        Response.INVALID_POST(res, responseJSON);
      }

    });

 /*
  * List all businesses
  */
  app.get('/api/business/list', function(req, res) {
    
    logger.info('Inside GET /api/business/list');
    var responseJSON = {};

    // mysql model instance
    var mySqlModel = new MySQL();

    if ( config.mysqlConnection ) {
      
      var queryString = mySqlModel.perpareSelectQuery('business', []);
      // execute query
      mySqlModel.executeQuery( config.mysqlConnection, queryString, function listCallback(err, result) {

        if (err) { 
          // sending response
          Response.QUERY_EXECUTION_ERROR(res, responseJSON, err);
          return;
        }

        // list of all business data
        logger.info('Sending total '+ result.length +' business records');
        responseJSON.status = MESSAGES.OK;
        responseJSON.data = result; 
        // response to request
        res.jsonp(HTTP.OK, responseJSON);
      
      });
    
    } else {
      // sending response
      Response.CONNECTION_ERROR(res, responseJSON);      
    }
      

  });

  /*
  * Search businesses
  */
  app.get('/api/business/search', function(req, res) {
    
    logger.info('Inside GET /api/business/search');
    var responseJSON = {};

    if (req.query.q) {
          // mysql model instance
      var mySqlModel = new MySQL();

      if ( config.mysqlConnection ) {
        var columns = ['name', 'mainCategory', 'subCategory'];
        var start = req.query.start || 0; 
        var queryString = mySqlModel.perpareSearchQuery('business', columns, start, req.query.q);

        // execute query
        mySqlModel.executeQuery( config.mysqlConnection, queryString, function searchCallback(err, result) {

          if (err) { 
            // sending response
            Response.QUERY_EXECUTION_ERROR(res, responseJSON, err);
            return;
          }

          // list of all business data
          logger.info('Sending total '+ result.length +' business records');
          responseJSON.status = MESSAGES.OK;
          responseJSON.data = result; 
          // response to request
          res.jsonp(HTTP.OK, responseJSON);
        
        });
      
      } else {
        // sending response
        Response.CONNECTION_ERROR(res, responseJSON);      
      }
    
    } else {

      logger.info('Search query param q is missing');
      Response.QUERY_PARAM_MISSING_ERROR(res, responseJSON);
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
    var os = fs.createWriteStream(target_path + file.name);
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

  // https://developers.google.com/maps/articles/phpsqlsearch_v3#finding-locations-with-mysql
  // To search by kilometers instead of miles, replace 3959 with 6371.
  //SELECT id, ( 3959 * acos( cos( radians(37) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(-122) ) + sin( radians(37) ) * sin( radians( lat ) ) ) ) AS distance FROM markers HAVING distance < 25 ORDER BY distance LIMIT 0 , 20;