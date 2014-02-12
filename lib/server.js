var log = require('./utils/log');
var chalk = require('chalk');

var path = require('path');
var express = require('express');

function Server(OJ, ip, port) {
  var app = express();

  // Run OJ once to ensure clean first build
  OJ.run();

  var requestHandler = function(request, response, next) {
    var url = request.url;

    // Use index.html if no path was supplied
    if(url == '/') {
      url = '/index.html';
    }

    // Remove the slash
    var url = url.substring(1);

    var requestPaths = [url];

    // Run OJ for the requested file
    OJ.run(requestPaths, function() {
      next();
    });
  };

  app.configure(function(){
    app.use(requestHandler);
    app.use(express.static(path.resolve(OJ.buildPath)));
  });

  app.listen(port, ip, function() {
    log('http server listening on: ' + ip + ':' + port);
  });
}

module.exports = Server;