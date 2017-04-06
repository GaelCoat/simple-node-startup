var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.mongo.api.host);

var db = mongoose.connection;

db.on('error', function(err) {

  console.log('Connection error on database rementis...', err);
});

db.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose disconnecting...');
    process.exit(0);
  });
});

module.exports = function(onceReady) {

  db.on('open', onceReady);
};
