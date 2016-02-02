'use strict';

/*global Stripe:true*/
/*global $form:true*/

//set Public key for Stripe payments
Stripe.setPublishableKey( 'pk_test_AZuj4ac4JkRKUJ3J86oBSW5s' );
var isSubmit = false;
$( document ).ready( function() {
    $('#submittransaction' ).click( function() {
        console.log( 'ok' );
        if ( !isSubmit ) {
            Stripe.card.createToken( {
                number: $( '.card-number' ).val().trim(),
                cvc: $( '.card-cvc' ).val().trim(),
                exp_month: $( '.card-expiry-month' ).val().trim(),
                exp_year: $( '.card-expiry-year' ).val().trim()
            }, function( status, response ) {
                if ( response.error ) {
                    // Show the errors on the form
                    $( '.payment-errors' ).text( response.error.message );
                }
                else {
                    // response contains id and card, which contains additional card details                     
                    var token = response.id;
                    // Insert the token into the form so it gets submitted to the server                    
                    $('#transaction-form').append( $( '<input type="hidden" name="stripeToken" />' ).val( token ) );
						// and submit
						$.ajax( {
							url: '/createtransaction',
							type: 'POST',
							headers: {
								'x-access-token': $( '#token' ).html()
							},
							data: {
								amount: $( '#amount' ).val(),
								currency: $( '#currency' ).val(),
								token: token
							}
						} ).done( function( response ) {
							if ( response.message ) {
								//calling function for saving card details
								$.ajax( {
									url: '/saveCardDetails',
									type: 'POST',
									data: {
										name: $( '.user-name' ).val().trim(),
										number: $( '.card-number' ).val().trim(),
										exp_month: $( '.card-expiry-month' ).val().trim(),
										exp_year: $( '.card-expiry-year' ).val().trim()
									}
								} ).done( function( response ) {
									if ( response.message) {
										console.log(response.message);
									}
								} );
                            $( '.payment-errors' ).text( response.message );
                        }
                    } );
                }

            } );
        }

    } );
} );
