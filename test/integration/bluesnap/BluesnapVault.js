'use strict';

var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var utils = require('../utils');

var testCreditCard = utils.testCreditCard;

function updateCookies(cookieJar, requestObj) {
    var cookieString = cookieJar.getCookieString(requestObj.url);
    var cookie = request.cookie(cookieString);
    cookieJar.setCookie(cookie, requestObj.url);
}

describe('Handle Bluesnap endpoint', function () {
    this.timeout(50000);

    it('Should be error save payment vaulted shopper (invalid credit card number)', function () {
        var cookieJar = request.jar();
        var myRequest = {
            url                     : config.baseUrl + '',
            method                  : 'POST',
            rejectUnauthorized      : false,
            resolveWithFullResponse : true,
            jar                     : cookieJar,
            headers                 : {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        // Step 1: Get CSRF token
        myRequest.url = config.baseUrl + '/CSRF-Generate';
        return request(myRequest)
            .then(function (tokenResponse) {
                assert.equal(tokenResponse.statusCode, 200, 'Unable to generate CSRF token before log in');
                var csrfJsonResponse = JSON.parse(tokenResponse.body);

                // Step 2: Save Vaulted Shopper payment
                myRequest.url = config.baseUrl + '/BluesnapVault-SavePayment';

                myRequest.form = {
                    dwfrm_bluesnapPayment_paymentMethod                             : 'BLUESNAP_CREDIT_DEBIT',
                    dwfrm_bluesnapPayment_bluesnapcreditcardFields_type             : testCreditCard.type,
                    dwfrm_bluesnapPayment_bluesnapcreditcardFields_number           : testCreditCard.number,
                    dwfrm_bluesnapPayment_bluesnapcreditcardFields_expiration_month : testCreditCard.expirationMonth,
                    dwfrm_bluesnapPayment_bluesnapcreditcardFields_expiration_year  : testCreditCard.expirationYear,
                    dwfrm_bluesnapPayment_BSACH_authorizeACH                        : true,
                    dwfrm_bluesnapPayment_BSSEPA_authorizeSEPA                      : true,
                    csrf_token                                                      : csrfJsonResponse.csrf.token
                };
                updateCookies(cookieJar, myRequest);

                return request(myRequest);
            })
            .then(function (savePaymentResponse) {
                assert.equal(savePaymentResponse.statusCode, 200, 'Expected statusCode to be 200.');
                var bodyAsJson = JSON.parse(savePaymentResponse.body);
                var responseError = {
                    action      : 'BluesnapVault-SavePayment',
                    queryString : '',
                    locale      : 'default',
                    success     : false,
                    fields      : {
                        dwfrm_bluesnapPayment_bluesnapcreditcardFields_number: 'Credit card number invalid.'
                    }
                };

                assert.deepEqual(bodyAsJson, responseError);
                return savePaymentResponse;
            });
    });
});
