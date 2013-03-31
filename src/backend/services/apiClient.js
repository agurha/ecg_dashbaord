/**
 * Created with JetBrains WebStorm.
 * User: agurha
 * Date: 31/03/2013
 * Time: 12:28
 * To change this template use File | Settings | File Templates.
 */

var config = require("config");
var restify = require("restify");
var logger = require("./loggerService").logger;

api = restify.createJsonClient({
  url: config.ecg_api.url,
  version: config.ecg_api.version,
  log: logger
});

exports.apiClient = api;
