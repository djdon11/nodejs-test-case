'use strict';

var mongoose = require( 'mongoose' );
var config = require( './index.js' );

//mongoose.connect( config.mongoURI );
mongoose.connect(config.mongoURI, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', config.mongoURI);
  }
});
