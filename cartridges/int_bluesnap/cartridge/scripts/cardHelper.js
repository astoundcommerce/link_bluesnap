'use strict';

var bluesnapService = require('~/cartridge/scripts/service/bluesnapinit.js');
var serviceHelper = require('~/cartridge/scripts/service/serviceHelper');
var getBluesnapPreference = require('~/cartridge/scripts/lib/bluesnapdata.js');
var constants = require('~/cartridge/scripts/constants.js');
var instance = constants[getBluesnapPreference('Instance')];

/**
 * @description verify the details for a specific Card number
 * @param {string} cardNumber - Card number
 * @returns {Object} - Card Info
 */
function bluesnapCardInfo(cardNumber) {
    var cardInfo = null;

    if (empty(cardNumber)) {
        return cardInfo;
    }
    cardNumber = cardNumber.replace(/\s/g, '');
    var firstSixDigitsCardNumber = !empty(cardNumber) ? cardNumber.slice(0, 6) : '';

    if (firstSixDigitsCardNumber.length === 6) {
        var param = {
            cardNumber: firstSixDigitsCardNumber
        };
        var service = bluesnapService.init();

        service.setRequestMethod('POST');
        service.setURL(instance + '/tools/credit-card-info-resolver');
        cardInfo = serviceHelper.callJsonService('bluesnapCardInfo', service, param);
    }

    return cardInfo;
}

/**
 * @description Get details about a past transaction Credit Card
 * @param {string} transactionId - Card number
 * @returns {Object} - Retrieve Info
 */
function bluesnapCardRetrieve(transactionId) {
    var retrieveInfo = null;

    if (empty(transactionId)) {
        return retrieveInfo;
    }

    var param = {
        transactionId: transactionId
    };
    var service = bluesnapService.init();

    service.setRequestMethod('GET');
    service.setURL(instance + '/alt-transactions/' + transactionId);
    retrieveInfo = serviceHelper.callJsonService('bluesnapCardRetrieve', service, param);

    return retrieveInfo;
}

module.exports.bluesnapCardInfo = bluesnapCardInfo;
module.exports.bluesnapCardRetrieve = bluesnapCardRetrieve;
