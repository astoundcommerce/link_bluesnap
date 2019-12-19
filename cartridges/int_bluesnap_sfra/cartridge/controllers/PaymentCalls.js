'use strict';

var server = require('server');

var URLUtils = require('dw/web/URLUtils');
var StringUtils = require('dw/util/StringUtils');
var BasketMgr = require('dw/order/BasketMgr');

/* Script Includes */
var paymentsApi = require('*/cartridge/scripts/api/payments');

/**
 * Render payment buttons Google Pay, Apple Pay, Visa Checkout
 */
server.post(
    'LoaderPayment',
    server.middleware.https,
    function (req, res, next) {
        var currentBasket = BasketMgr.getCurrentBasket();
        var paymentMethod = req.form.payment;
        var template = 'payments/loaderror';
        switch (paymentMethod) {
        case 'BLUESNAP_GOOGLE_PAY':
            template = 'payments/googlepay';
            break;
        case 'BLUESNAP_VISA_CHECKOUT':
            template = 'payments/visacheckout';
            break;
        case 'BLUESNAP_APPLE_PAY':
            template = 'payments/applepay';
            break;
        default:
            break;
        }

        res.render(template, { Basket: currentBasket });
        next();
    }
);

/**
 * Wallet call for Apple Pay
 */
server.post(
    'CreateWallet',
    server.middleware.https,
    function (req, res, next) {
        var validUrl = req.form.validUrl ? req.form.validUrl : false;
        var token = false;
        if (validUrl) {
            var walletObject = {
                walletType    : 'APPLE_PAY',
                validationUrl : validUrl,
                domainName    : request.httpHost,
                displayName   : dw.system.Site.getCurrent().name
            };

            var result = paymentsApi.bluesnapCreateWallet(walletObject);
            token = StringUtils.decodeBase64(result.walletToken);
        }
        res.setContentType('application/octet-stream');
        res.print(token);
        next();
    }
);

/**
 * Processing Apple Pay transaction
 */
server.post(
    'ProccessTransaction',
    server.middleware.https,
    function (req, res, next) {
        var token = req.form.token ? req.form.token : null;
        var basketData = req.form.basketData ? req.form.basketData : null;
        session.privacy.applePay = null;
        res.setContentType('application/octet-stream');

        if (empty(token) || empty(basketData)) {
            res.print('ERROR');
            next();
        }

        try {
            basketData = JSON.parse(basketData);
        } catch (error) {
            res.print('ERROR');
            next();
        }

        token = StringUtils.encodeBase64(token);
        var requestObject = {
            cardTransactionType : 'AUTH_CAPTURE',
            amount              : basketData.amount,
            currency            : basketData.currency,
            wallet              : {
                applePay: {
                    encodedPaymentToken: token
                }
            }
        };
        session.privacy.applePay = JSON.stringify(requestObject);
        res.print('OK');
        next();
    }
);

/**
 * Sending Google Pay token to bluesnap
 */
server.post(
    'GoogleToken',
    server.middleware.https,
    function (req, res, next) {
        var tokenData = req.form.token ? req.form.token : null;
        var basketData = req.form.basketData ? req.form.basketData : null;
        session.privacy.googletoken = null;
        session.privacy.googledata = null;
        res.setContentType('application/octet-stream');

        if (empty(tokenData) || empty(basketData)) {
            res.print('ERROR');
            next();
        }

        try {
            JSON.parse(basketData);
        } catch (error) {
            res.print('ERROR');
            next();
        }

        var token = StringUtils.encodeBase64(tokenData);
        session.privacy.googletoken = token;
        session.privacy.googledata = basketData;
        res.print('OK');
        next();
    }
);

/**
 * Wallet call for MasterPass
 */
server.post(
    'MasterpassWallet',
    server.middleware.https,
    function (req, res, next) {
        var walletObj = {
            walletType : 'MASTERPASS',
            originUrl  : request.httpReferer,
            returnUrl  : URLUtils.http('PaymentCalls-Checkout').toString()
        };
        var result = JSON.stringify(paymentsApi.bluesnapCreateWallet(walletObj));
        res.setContentType('application/octet-stream');
        res.print(result);
        next();
    }
);

server.post(
    'VisaCheckoutApiKeyRequest',
    server.middleware.https,
    function (req, res, next) {
        var result = paymentsApi.bluesnapVisaCheckoutApiKeyCall();
        res.setContentType('application/octet-stream');
        res.print(result);
        next();
    }
);

server.post(
    'VisaCheckoutCreateWallet',
    server.middleware.https,
    function (req, res, next) {
        var callId = req.form.callId ? req.form.callId : false;
        var walletObj = {
            callId     : callId,
            walletType : 'VISA_CHECKOUT'
        };
        var result = paymentsApi.bluesnapCreateWallet(walletObj);
        session.privacy.visacheckoutwallet = result.walletId;
        res.setContentType('application/octet-stream');
        res.print(result.walletId);
        next();
    }
);

module.exports = server.exports();
