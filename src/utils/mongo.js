
const MongoClient = require('mongodb').MongoClient;

var settings = require('../settings');

const url = `mongodb:${settings.MONGO_HOST}`;
var _db;


module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('weatherData');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};
