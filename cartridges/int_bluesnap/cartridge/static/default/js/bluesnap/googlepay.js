/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|apiVersion in PaymentDataRequest}
 */
const baseRequest = {
    apiVersion      : 2,
    apiVersionMinor : 0
};

/**
 * Card networks supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm card networks supported by your site and gateway
 */
const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

/**
 * Card authentication methods supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm your processor supports Android device tokens for your
 * supported card networks
 */
const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

/**
 * Identify your gateway and your site's gateway merchant identifier
 *
 * The Google Pay API response will return an encrypted payment method capable
 * of being charged by a supported gateway after payer authorization
 * @todo pass merchantID
 */
const tokenizationSpecification = {
    type       : 'PAYMENT_GATEWAY',
    parameters : {
        'gateway'           : 'bluesnap',
        'gatewayMerchantId' : '705893'
    }
};

/**
 * Describe your site's support for the CARD payment method and its required
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const baseCardPaymentMethod = {
    type       : 'CARD',
    parameters : {
        allowedAuthMethods  : allowedCardAuthMethods,
        allowedCardNetworks : allowedCardNetworks
    }
};

/**
 * Describe your site's support for the CARD payment method including optional
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const cardPaymentMethod = Object.assign(
    {},
    baseCardPaymentMethod,
    {
        tokenizationSpecification: tokenizationSpecification
    }
);

/**
 * An initialized google.payments.api.PaymentsClient object or null if not yet set
 *
 * @see {@link getGooglePaymentsClient}
 */
let paymentsClient = null;

/**
 * Configure your site's support for payment methods supported by the Google Pay
 * API.
 *
 * Each member of allowedPaymentMethods should contain only the required fields,
 * allowing reuse of this base request when determining a viewer's ability
 * to pay and later requesting a supported payment method
 *
 * @returns {Object} Google Pay API version, payment methods supported by the site
 */
function getGoogleIsReadyToPayRequest() {
    return Object.assign(
        {},
        baseRequest,
        {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

/**
 * Configure support for the Google Pay API
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|PaymentDataRequest}
 * @returns {Object} PaymentDataRequest fields
 */
function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
    // @todo a merchant ID is available for a production environment after approval by Google
    // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
    // merchantId: '01234567890123456789',
        merchantName: 'Example Merchant'
    };
    return paymentDataRequest;
}

/**
 * Return an active PaymentsClient or initialize
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
 * @returns {google.payments.api.PaymentsClient} Google Pay API client
 */
function getGooglePaymentsClient() {
    if (paymentsClient === null) {
        paymentsClient = new google.payments.api.PaymentsClient({ environment: 'TEST' });
    }
    return paymentsClient;
}

/**
 * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
 *
 * Display a Google Pay payment button after confirmation of the viewer's
 * ability to pay.
 */
function onGooglePayLoaded() {
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
        .then(function (response) {
            if (response.result) {
                addGooglePayButton();
            }
        })
        .catch(function (err) {
            // show error in developer console for debugging
            console.error(err);
        });
}

/**
 * Add a Google Pay purchase button alongside an existing checkout button
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#ButtonOptions|Button options}
 * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
 */
function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button =
    paymentsClient.createButton({ onClick: onGooglePaymentButtonClicked });
    document.getElementById('googlePayContainer').appendChild(button);
}

/**
 * Provide Google Pay API with a payment amount, currency, and amount status
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#TransactionInfo|TransactionInfo}
 * @returns {Object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
 */
function getGoogleTransactionInfo() {

    var basket = $('#googlePayContainer').data('basket');
    return {
        currencyCode     : basket.currency,
        totalPriceStatus : 'FINAL',
        totalPrice       : basket.amount
    };
}

/**
 * Show Google Pay payment sheet when Google Pay payment button is clicked
 */
function onGooglePaymentButtonClicked() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function (paymentData) {
            // handle the response
            processPayment(paymentData);
        })
        .catch(function (err) {
            // show error in console for debugging
            console.error(err);
        });
}

/**
 * Process payment data returned by the Google Pay API
 *
 * @param {Object} paymentData response from Google Pay API after user approves payment
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentData|PaymentData object reference}
 */
function processPayment(paymentData) {

    var paymentToken = JSON.stringify(paymentData);
    var url = $('#googlePayContainer').data('tokenurl');

    var csrf = $('input[name="csrf_token"]').val();
    var checkoutUrl = $('#googlePayContainer').data('checkouturl') + '?csrf_token=' + csrf;
    var siteType =  $('#googlePayContainer').data('sitetype');

    $.ajax({
        url    : url,
        method : "POST",
        data   : {
            "token"      : paymentToken,
            "basketData" : JSON.stringify(getGoogleTransactionInfo())
        }
    }).done(function (token) {
        if (siteType == 'SFRA') {
            finishPayment(token, checkoutUrl);
        } else {
            window.location.href = checkoutUrl;
        }
    });
}

/**
 * Post handling payment
 * @param {string} paymentInfo - token
 * @param {string} checkoutUrl - URL checkout page  
 */
function finishPayment(paymentInfo, checkoutUrl) {
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
                var continueUrl = data.continueUrl;
                var urlParams = {
                    ID    : data.orderID,
                    token : data.orderToken
                };

                continueUrl += (continueUrl.indexOf('?') !== -1 ? '&' : '?') +
                Object.keys(urlParams).map(function (key) {
                    return key + '=' + encodeURIComponent(urlParams[key]);
                }).join('&');

                window.location.href = continueUrl;
            }
        },
        error: function () {
            $('body').trigger('checkout:enableButton', $('.next-step-button button'));
            $.spinner().stop();
        }
    });
}
