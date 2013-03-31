/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 31/03/2013
 * Time: 12:23
 * To change this template use File | Settings | File Templates.
 */
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({ filename: 'logs/dashboard.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/dashboard_error.log' })
  ]
});

exports.logger = logger;
