'use strict';

var Transactions = require( '../models/transactions.model.js' );
//include card model for saving card
var Cards = require( '../models/card.model.js' );
var config = require( '../config' );
var Stripe = require( 'stripe' )( config.stripeApiKey );

exports.index = function( req, res, next ) {
    if ( req.body ) {
        var transaction = new Transactions( {
            name: req.body.name
        } );
        transaction.save( function( err, trans ) {
            if ( err ) {
                return console.log( err );
            }
            res.status( 200 ).end();
        } );
    }
};

exports.createTransaction = function( req, res, next ) {
    Stripe.charges.create( {
        amount: req.body.amount,
        currency: req.body.currency,
        source: req.body.token,
        description: 'Charge for test@example.com'
    }, function( err, charge ) {
        if ( err ) {
            return console.log( err );
        }
        var transaction = new Transactions( {
            transactionId: charge.id,
            amount: charge.amount,
            created: charge.created,
            currency: charge.currency,
            description: charge.description,
            paid: charge.paid,
            sourceId: charge.source.id
        } );
        transaction.save( function( err ) {
                if ( err ) {
                    return res.status( 500 );
                }
                else {
					console.log('Payment is created.');
                    res.status( 200 ).json( {
                        message: 'Payment is created.'
                    } );
                }
            } );
            // asynchronously called
    } );
};

//for saving card details
exports.saveCardDetails = function( req, res, next ) {
	var cards = new Cards( {
		user_name: req.body.name,
		card_number: req.body.number,
		exp_month: req.body.exp_month,
		exp_year: req.body.exp_year
	} );
	cards.save( function( err ) {
		if ( err ) {
			return res.status( 500 ).json( {
				success: false,
				message: 'Error in saving Card'
			} );
		}else{
			return res.status( 'success' ).json( {
				success: true,
				message: 'Card saved'
			} );
		}
	} );
};
