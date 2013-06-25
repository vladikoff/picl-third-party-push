var googleapis = require('googleapis'),
  OAuth2Client = googleapis.OAuth2Client;

var config = require('../config');

// server address
var SERVER_ADDR = "http://localhost:" + 8500;
// client id from api console
var CLIENT_ID = config.CLIENT_ID;
// super secret client id
var CLIENT_SECRET = config.CLIENT_SECRET;
// redirect to finish oauth2 flow
var REDIRECT_URL = SERVER_ADDR + "/glass_receiver";
// api scope
var scope = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/glass.timeline',
  'https://www.googleapis.com/auth/glass.location'
].join(' ');
// setup oauth2 client
var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
// authURL
var AUTH_URL = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scope
});

exports.oauth2Client = oauth2Client;
exports.AUTH_URL = AUTH_URL;
exports.push = function (data) {
  if (oauth2Client.credentials) {
    console.log('glass data');
    console.log(data[0]);

    if (data[0] && data[0].name) {
      googleapis.discover('mirror', 'v1').execute(function(err, client) {

        if (data[0].type === 'image' ) {
          console.log('got image');
          var text = {
            "html": "<article class=\"photo\"><img src=\"" + data[0].name +"\" width=\"100%\" height=\"100%\"><div class=\"photo-overlay\"/><section><p class=\"text-auto-size\">From PiCL</p></section></article>",
            "notification": {
              "level": "DEFAULT"
            }
          };

          var msg = { resource: text };

        } else {

          var msg = {resource: {
            text: "PiCL: " + data[0].name,
            menuItems: [{
                action: "READ_ALOUD"
             }],
            notification: {
              level: "DEFAULT"
            }
          }};
        }
        client.mirror.timeline.insert(msg).withAuthClient(oauth2Client).execute(function(err, c) {
          console.log(c.items);
        });

        /*
         client.mirror.timeline.list().withAuthClient(oauth2Client).execute(function(err, c) {
         console.log(c.items);
         })
         */
      });
    }
  }
};

