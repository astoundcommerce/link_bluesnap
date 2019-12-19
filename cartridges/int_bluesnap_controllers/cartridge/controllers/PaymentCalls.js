'use strict';

var StringUtils = require('dw/util/StringUtils');
/* Script Includes */
var guard = require('*/cartridge/scripts/guard');
var app = require('*/cartridge/scripts/app');
var paymentsApi = require('*/cartridge/scripts/api/payments');
var Response = require('*/cartridge/scripts/util/Response');
var URLUtils = require('dw/web/URLUtils');

/**
 * Create BlueSnap wallet for ApplePay
 */
function CreateWallet() {
    var validUrl = request.httpParameterMap.validUrl ? request.httpParameterMap.validUrl.stringValue : false;
    var token = false;
    var walletObject = {
        walletType    : 'APPLE_PAY',
        validationUrl : validUrl,
        domainName    : request.httpHost,
        displayName   : dw.system.Site.getCurrent().name
    };

    var result = paymentsApi.bluesnapCreateWallet(walletObject);
    token = StringUtils.decodeBase64(result.walletToken);
    Response.renderData(token);
}

/**
 * Processing apple pay transaction
 * @returns {boolean} - successful status
 */
function ProccessTransaction() {
    var token = request.httpParameterMap.token ? request.httpParameterMap.token.stringValue : null;
    token = StringUtils.encodeBase64(token);
    var basketData = request.httpParameterMap.basketData ? request.httpParameterMap.basketData : false;
    try {
        basketData = JSON.parse(basketData);
    } catch (error) {
        return false;
    }

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
    //paymentsApi.bluesnapApplePayProccessing(requestObject);
    Response.renderData('OK');
}

/**
 * Sending Google pay token to BlueSnap
 * @returns {boolean} - successful status
 */
function GoogleToken() {
    var tokenData = request.httpParameterMap.token ? request.httpParameterMap.token.stringValue : false;
    var basketData = request.httpParameterMap.basketData ? request.httpParameterMap.basketData : false;

    try {
        basketData = JSON.parse(basketData);
    } catch (error) {
        return false;
    }
    var token = StringUtils.encodeBase64(tokenData);
    var result = paymentsApi.bluesnapProccessingGooglrPay(token, basketData);

    Response.renderData(result);
}

/**
 * Checkout used for external calls Google Pay and Apple Pay
 */
function checkout() {
    var COSummary = app.getController('COSummary');
    var placeOrderResult = app.getController('COPlaceOrder').Start();
    if (placeOrderResult.error) {
        COSummary.Start({
            PlaceOrderError: placeOrderResult.PlaceOrderError
        });
    } else if (placeOrderResult.order_created) {
        COSummary.ShowConfirmation(placeOrderResult.Order);
    }
}

/**
 * Wallet call for MasterPass
 */
function MasterpassWallet() {
    var walletObj = {
        walletType : 'MASTERPASS',
        originUrl  : request.httpReferer,
        returnUrl  : URLUtils.http('PaymentCalls-Checkout').toString()
    };
    var result = JSON.stringify(paymentsApi.bluesnapCreateWallet(walletObj));
    Response.renderData(result);
}

/**
 * Get Visa Checkout API key
 */
function VisaCheckoutApiKeyRequest() {
    var result = paymentsApi.bluesnapVisaCheckoutApiKeyCall();
    Response.renderData(result);
}

/**
 * Create BlueSnap wallet for Visa Checkout
 */
function VisaCheckoutCreateWallet() {
    var callId = request.httpParameterMap.callId ? request.httpParameterMap.callId.stringValue : false;
    var walletObj = {
        callId     : callId,
        walletType : 'VISA_CHECKOUT'
    };
    var result = paymentsApi.bluesnapCreateWallet(walletObj);
    session.privacy.visacheckoutwallet = result.walletId;
    Response.renderData(result.walletId);
}

exports.Checkout = guard.ensure(['https'], checkout);
exports.CreateWallet = guard.ensure(['post'], CreateWallet);
exports.ProccessTransaction = guard.ensure(['post'], ProccessTransaction);
exports.GoogleToken = guard.ensure(['post'], GoogleToken);
exports.MasterpassWallet = guard.ensure(['post'], MasterpassWallet);
exports.VisaCheckoutApiKeyRequest = guard.ensure(['post'], VisaCheckoutApiKeyRequest);
exports.VisaCheckoutCreateWallet = guard.ensure(['post'], VisaCheckoutCreateWallet);
