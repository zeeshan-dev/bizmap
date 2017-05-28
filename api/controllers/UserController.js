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

User.setup = function(app, mysql) {

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
  var Email = require(__dirname + '/../models/Email');
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

    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {

     
      // check db connection
      if ( config.mysqlConnection ) {

         // mysql model instance
        var mySqlModel = new MySQL();
        var userModel = new User();
        userModel.addRemoveFavourite(req, res, mySqlModel, post, responseJSON);

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
     
      if ( config.mysqlConnection ) {

         // mysql model instance
        var mySqlModel = new MySQL();
        var favQuery = mySqlModel.getFavouriteQuery(req.query.userId);

        var userModel = new User();
        userModel.getFavouritesList(mySqlModel, favQuery, function favCallback(error, favList) {

          if (error) { 
            // mysql query execution error
            logger.info(JSON.stringify(error));
            responseJSON.status = MESSAGES.FAIL;
            responseJSON.message =  MESSAGES.ERROR_QUERY_EXECUTION + ' error: '  + JSON.stringify(error);
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

      var queryString = "Select id, name, email, phone from users where email = '" + post.email + "' AND password = '" + post.password + "'";
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

      Response.INVALID_POST(res, responseJSON);
    }
  });

  // forgot-password api
  app.post('/api/user/forgot-password', function(req, res) {

    logger.info('Inside POST /api/user/forgot-password');

    var post = req.body;
    var data = {};
    var responseJSON = {};

    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {

     
      // check db connection
      if ( config.mysqlConnection ) {

         // mysql model instance
        var mySqlModel = new MySQL();
        var userModel = new User();
        userModel.forgotPasswordRequest(req, res, mySqlModel, Email, post, responseJSON);

      } else {
        // sending response
        Response.CONNECTION_ERROR(res, responseJSON);
      }
   
    } else {
      // sending response
      Response.INVALID_POST(res, responseJSON);
    }

    // email template 
    // https://reallygoodemails.com/transactional/expiration/your-free-trial-has-expired/
  });

   // contact-business api
  app.post('/api/user/contact-business', function(req, res) {

    logger.info('Inside POST /api/user/contact-business');

    var post = req.body;
    var data = {};
    var responseJSON = {};
    var ejs = require( 'ejs' );

    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {

      var data = {};
            
      // Prepare Data for Email
      data.businessName = post.businessName;
      data.userId = post.userId;
      data.senderName = post.name.trim();
      data.phone = post.phone.trim()
      data.email = post.email.trim();
      data.message = post.message.trim();
      data.businessEmail = post.businessEmail.trim();
      data.businessPhone = post.businessPhone.trim();
      
      ejs.renderFile( config.email.templatePath + 'email.html', data, {}, function ejsRenderCompleted( err, message ) {
        var mailOptions = {
          from:'Yellow Pages of Pakistan <' + config.smtp.user + '>',  // sender address
          to: config.email.to,
          replyTo:  data.email,
          subject: MESSAGES.EMAIL_SUBJECT_BUSINESS_CONTACT, 
          html: message
        }

        // Send the email
        Email.sendEmail( mailOptions);
      });

      logger.info(MESSAGES.EMAIL_SUCCESS);
      responseJSON.status = MESSAGES.OK;
      responseJSON.message =  MESSAGES.EMAIL_SUCCESS;         
      // response to request
      res.jsonp(HTTP.OK, responseJSON);

   
    } else {
      // sending response
      Response.INVALID_POST(res, responseJSON);
    }

  });

  // claim-business api
  app.post('/api/user/claim-business', function(req, res) {

    logger.info('Inside POST /api/user/claim-business');

    var post = req.body;
    var data = {};
    var responseJSON = {};
    var ejs = require( 'ejs' );

    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {
      var data = {};
      console.log(post);
      // Prepare Data for Email
      
      data.userId = post.userId;
      data.senderName = post.senderName.trim();
      data.senderPhone = post.senderPhone.trim()
      data.senderEmail = post.senderEmail.trim();

      // current business info
      data.businessId = post.currentInfo.id;
      data.businessName = post.currentInfo.name;
      data.businessAddress = post.currentInfo.address;
      data.businessPhone = post.currentInfo.dialing_code + post.currentInfo.phone1;
      data.businessEmail = post.currentInfo.email;
      data.businessMobile = post.currentInfo.mbile;
      data.businessWeb = post.currentInfo.web;
      data.businessFax = post.currentInfo.fax;
      data.businessContactPerson = post.currentInfo.contactPerson;
      data.businessCity = post.currentInfo.cityName;
      //data.businessDialingCode = post.currentInfo.dialing_code;
      
      // new business info
      data.businessNameNew = post.name.trim();
      data.businessAddressNew = post.address.trim();
      data.businessCityNameNew = post.cityName.trim();
      data.businessPhoneNew = post.phone1.trim();
      data.businessEmailNew = post.email1.trim();
      data.businessMobileNew = post.mobile;
      data.businessWebNew = post.web.trim();
      data.businessFaxNew = post.fax1;
      data.businesscontactPersonNew = post.contactPerson.trim();
    
      
      ejs.renderFile( config.email.templatePath + 'claim.html', data, {}, function ejsRenderCompleted( err, message ) {
        var mailOptions = {
          from:'Yellow Pages of Pakistan <' + config.smtp.user + '>',  // sender address
          to: config.email.to,
          replyTo:  data.email,
          subject: MESSAGES.EMAIL_SUBJECT_BUSINESS_CLAIM, 
          html: message
        }

        // Send the email
        Email.sendEmail( mailOptions);
      });

      logger.info(MESSAGES.EMAIL_SUCCESS);
      responseJSON.status = MESSAGES.OK;
      responseJSON.message =  MESSAGES.EMAIL_SUCCESS;         
      // response to request
      res.jsonp(HTTP.OK, responseJSON);

   
    } else {
      // sending response
      Response.INVALID_POST(res, responseJSON);
    }

  });

  app.post('/api/user/business/add', function(req, res) {
    
    
    var post = req.body;
    var responseJSON = {};

    // check if post is valid
    if ( post && Object.keys(post).length > 0 ) {
     
      // check db connection
      if ( config.mysqlConnection ) {

         // mysql model instance
        var mySqlModel = new MySQL();
        var userModel = new User();
        userModel.getBusinessCode( mySqlModel, function(err, code) {
          
          if (err) { 
            // sending response
            Response.QUERY_EXECUTION_ERROR(res, responseJSON, err);
            return;
          }

          post.code = code;
          var categoryId =  post.category;
          delete post.category;

          // prepare insert query
          var queryString = mySqlModel.perpareInsertQuery('business', post);
          logger.info(queryString);
          // execute insert query
          mySqlModel.executeQuery( config.mysqlConnection, queryString, function insertBusinessCallback(err, result) {

            if (err) { 
              // mysql query execution error
              Response.QUERY_EXECUTION_ERROR(res, responseJSON, err);
              return;
            }
            
            var businessId = result.insertId;
            
            // business added successfully
            logger.info( MESSAGES.BUSINESS_ADDED_SUCCESSFULLY , businessId);
            responseJSON.status = MESSAGES.OK;
            responseJSON.message =  MESSAGES.BUSINESS_ADDED_SUCCESSFULLY;
            // response to request
            res.jsonp(HTTP.OK, responseJSON);
            
            var data = {category_code: categoryId, business_code: code};
            // prepare insert query
            var query = mySqlModel.perpareInsertQuery('business_categories', data);
            logger.info(query);
            userModel.addBusinessCode( mySqlModel, query);

          });
        
        });

      } else {
        // sending response
        Response.CONNECTION_ERROR(res, responseJSON);
      }
   
    } else {
      // sending response
      Response.INVALID_POST(res, responseJSON);
    }

    //Email.sendEmail(req, res, {to: 'mail.mzeeshan@gmail.com', subject:'YP',body:'Hi form YP'});
  });

}

