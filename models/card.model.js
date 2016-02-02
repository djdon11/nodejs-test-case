'use strict';

var mongoose = require( 'mongoose' );
var config = require( '../config' );

//define cards table fields
var cardsSchema = mongoose.Schema( {
    user_name: String,
    card_number: Number,
    exp_month: Number,
    exp_year: Number
} );

var cards = mongoose.model( 'cards', cardsSchema );

module.exports = cards;
