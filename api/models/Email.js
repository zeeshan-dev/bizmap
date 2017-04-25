/**
 * This module is responsible email
 * 
 */

// Setup the module
email = module.exports = {};

email.sendEmail = function( req, res, data ) {

  // Get the configurations data
  var config = require(__dirname + '/../config');
  
  // Our logger for logging to file and console
  var logger = require(__dirname + '/../logger');
      
  var nodemailer = require("nodemailer");
  
  var responseJSON = {};

  logger.info('Inside sendEmail');

  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail", 
      auth: {
          user: 'cpecyp@gmail.com',
          pass: 'BizmaP123'
      }
  });   

  try {

    // send mail with defined transport object
    smtpTransport.sendMail(data, function(error, response) {

        if ( error ) {

            logger.info(error);
        //send email
        responseJSON.message = 'Email sent error!';
        responseJSON.error = error;
        responseJSON.status = 'FAIL';
        res.jsonp( 200, responseJSON);

        } else {
          //send email 
            logger.info('Email sent successfully to ' + data.to);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });

  } catch( e ) {

    //send email 
    responseJSON.message = 'Exception in sent email!';
    responseJSON.error = e;
    responseJSON.status = 'FAIL';
    res.jsonp( 200, responseJSON);
  }
};