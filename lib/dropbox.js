var Dropbox = require("dropbox");

var client = null;


var connect = function(tokens) {
  if (tokens) {
    client = new Dropbox.Client(tokens);

    client.authenticate({interactive: false}, function() {



      client.getUserInfo(function (error, userInfo) {
        if (error) {
          console.log(error);
        }
        console.log("Hello, " + userInfo.name + "!");
      });
    });
  }
};

var getClient = function () {
  return client;
};

var isConnected = function () {
  return client && client.isAuthenticated();
};

exports.connect = connect;
exports.getClient = getClient;
exports.isConnected = isConnected;
