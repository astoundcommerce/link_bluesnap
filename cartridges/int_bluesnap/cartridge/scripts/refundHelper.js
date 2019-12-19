'use strict';

var getBlueSnapPreference = require('~/cartridge/scripts/lib/bluesnapdata.js');
var bluesnapService = require('~/cartridge/scripts/service/bluesnapinit.js');
var constants = require('~/cartridge/scripts/constants.js');
var instance = constants[getBlueSnapPreference('Instance')];
var serviceHelper = require('~/cartridge/scripts/service/serviceHelper');

/**
 * @description make refund on a transaction that was processed through the BlueSnap Payment API end
 * get result of transaction
 * @param {string} transactionId - ID of the transaction to be refunded
 * @param {Object} [queryParameters] - Query Parameters (optional)
 * @param {string} [queryParameters.partRefundAmount] - needed if partial amount to be refunded (optional)
 * @param {string} [queryParameters.reason] - reason the shopper cancelled or requested a refund for the order (optional)
 * @param {string} [queryParameters.cancelsubscriptions] - true/false (optional)
 *      true = cancel the shopper's subscription associated with this invoice ID.
 *      false = just refund the selected purchase and do not cancel the subscription.
 * @param {string} [queryParameters.vendorId] - vendor ID for amount to be refunded to vendor (optional)
 * @param {string} [queryParameters.vendorAmount] - amount to be refunded to vendor (optional)
 * @returns {boolean} - successful status
 */
function makeRefund(transactionId, queryParameters) {
    var service = bluesnapService.init();
    service.setRequestMethod('PUT');
    service.setURL(instance + '/transactions/' + transactionId + '/refund');

    if (!empty(queryParameters.partRefundAmount)) {
        service.addParam('amount', queryParameters.partRefundAmount);
    }

    if (!empty(queryParameters.reason)) {
        service.addParam('reason', queryParameters.reason);
    }

    if (!empty(queryParameters.cancelsubscriptions)) {
        service.addParam('cancelsubscriptions', queryParameters.cancelsubscriptions);
    }

    if (!empty(queryParameters.vendorId) && !empty(queryParameters.vendorAmount)) {
        var paramName = 'vendor.' + queryParameters.vendorId + '.amount';
        service.addParam(paramName, queryParameters.vendorAmount);
    }

    serviceHelper.callService('makeRefund', service, {});
    return (service.getClient().getStatusCode() == 204);
}

module.exports.makeRefund = makeRefund;
