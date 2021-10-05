/**
 *  Handling payment
 */
function onVisaCheckoutReady() {
    var $apiurl = $('#visacheckout').data('apiurl');
    var $walleturl = $('#visacheckout').data('walleturl');
    var $checkoutUrl = $('#visacheckout').data('checkouturl');
    var siteType = $('#visacheckout').data('sitetype');
    var basket = $('#visacheckout').data('basket');
    // sending request for visa checkout api key
    $('button[value="Place Order"]').hide();
    $.ajax({
        url    : $apiurl,
        method : 'POST'

    }).done(function (apikey) {
        V.init({
            apikey   : apikey,
            settings : {
                locale: 'en_US'
            },
            payment: {
                cardBrands: ['VISA', 'MASTERCARD', 'AMEX', 'DINERS', 'DISCOVER']
            },
            paymentRequest: {
                currencyCode : basket.currency,
                subtotal     : basket.amount
            },
            shipping: {
                collectShipping: false
            },
            dataLevel: 'NONE'
        });
        V.on('payment.success', function (payment) {
            // Handle success response from lightbox.
            // send “payment.callid” to BlueSnap via CreateWallet.
            $.ajax({
                url    : $walleturl,
                method : 'POST',
                data   : { callId: payment.callid }
            }).done(function () {
                if (siteType == 'SFRA') {
                    finishPayment($checkoutUrl);
                } else {
                    window.location.href = $checkoutUrl;
                }
            });
        });
        V.on('payment.cancel', function (payment) {
            // Handling cancel payment
        });
        V.on('payment.error', function (payment, error) {
            // Handling error payment
        });
    });
}

/**
 * Post handling payment
 * @param {string} checkoutUrl - URL checkout page  
 */
function finishPayment(checkoutUrl) {
    $.spinner().start();
    $.ajax({
        url     : checkoutUrl,
        method  : 'POST',
        success : function (data) {
            $('body').trigger('checkout:enableButton', '.next-step-button button');
            $.spinner().stop();
            if (data.error) {
                if (data.cartError) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                var redirect = $('<form>')
                    .appendTo(document.body)
                    .attr({
                        method: 'POST',
                        action: data.continueUrl
                    });

                $('<input>')
                    .appendTo(redirect)
                    .attr({
                        name: 'orderID',
                        value: data.orderID
                    });

                $('<input>')
                    .appendTo(redirect)
                    .attr({
                        name: 'orderToken',
                        value: data.orderToken
                    });

                redirect.submit();
            }
        },
        error: function () {
            $('body').trigger('checkout:enableButton', $('.next-step-button button'));
            $.spinner().stop();
        }
    });
}
