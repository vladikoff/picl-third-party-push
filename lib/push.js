var Q = require('q');
var UPDATE_INTERVAL_IN_SECONDS = 60 * 60;
var UPDATE_INTERVAL_IN_SECONDS = 5;
var db = require('./dropbox');
var glass = require('./glass');
var crypto = require('crypto');
var _ = require('lodash');

console.log('dasdasd');

// TODO: temp.
var store = null;

var POLL = true;

var getData = function () {
  var d = Q.defer();
  POLL = false;

  if (db.isConnected()) {
    db.getClient().readFile(".snippets.json", function(error, data) {
      console.log('got data ,resolving...');
      d.resolve(JSON.parse(data));
    });
  } else {
    console.log('not connected, skipping...');
    d.resolve();
  }
  return d.promise;
};


function poll() {
  getData().then(function (data) {
    //console.log(data);
    if (data) {
      console.log(data[0].snippets);
      if (store == null) {
        // init store
        console.log('first time resolve');
        store = data[0].snippets;
      } else {
        // diff of new and store
        // TODO: first computer only
        // Make hashtable of ids in B
        var bIds = {};
        store.forEach(function(obj){
          bIds[obj.visit] = obj;
        });

        // Return all elements in A, unless in B
        var newItem = data[0].snippets.filter(function(obj){
          return !(obj.visit in bIds);
        });

        //var newItem = _.difference(store, data[0].snippets);
        // if any diff
        if (newItem && newItem.length > 0) {
          store = data[0].snippets;
          console.log('diff:');
          console.log(newItem);
          // existing store
          glass.push(newItem);
        }
      }
    }
  }).fail(function (e) {
      console.log(e);
    }).finally(function(){
      POLL = true;
    });
}

// Update function
setInterval(function () {
  poll();
}, UPDATE_INTERVAL_IN_SECONDS * 1000);
