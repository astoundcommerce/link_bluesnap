'use strict';

/**
 * Controller for test full or partial refund on a transaction
 * that was processed through the BlueSnap Payment API.
 * Should be removed in production
 */

var server = require('server');

/* API includes */
var Resource = require('dw/web/Resource');

/* Scripts includes */
var refundHelper = require('*/cartridge/scripts/refundHelper.js');
var cardHelper = require('*/cartridge/scripts/cardHelper.js');

/**
 * Parameters for GET request:
 *   transactionId (required)    - ID of the transaction to be refunded
 *   partRefundAmount (optional) - needed if partial amount to be refunded,
 *   reason (optional)           - reason the shopper cancelled or requested
 *     a refund for the order cancel subscriptions:
 *      true = Cancel the shopper's subscription associated with this invoice ID.
 *      false = Just refund the selected purchase and do not cancel the subscription.
 *   vendorId (optional)         - vendor ID for amount to be refunded to vendor
 *   vendorAmount (optional)     - amount to be refunded to vendor
 */

server.get('Refund', server.middleware.https, function (req, res, next) {
    var params = request.httpParameterMap;
    var nameOfParams = params.getParameterNames();
    var result = null;
    var retrieve = null;

    if (params.getParameterCount() > 0 && nameOfParams.contains('transactionId')) {
        var transactionId = params.get('transactionId').stringValue;
        var queryParameters = {
            partRefundAmount    : nameOfParams.contains('partRefundAmount') ? params.get('partRefundAmount').stringValue : null,
            reason              : nameOfParams.contains('reason') ? params.get('reason').stringValue : null,
            cancelsubscriptions : nameOfParams.contains('cancelsubscriptions') ? params.get('cancelsubscriptions').stringValue : null,
            vendorId            : nameOfParams.contains('vendorId') ? params.get('vendorId').stringValue : null,
            vendorAmount        : nameOfParams.contains('vendorAmount') ? params.get('vendorAmount').stringValue : null
        };

        result = refundHelper.makeRefund(transactionId, queryParameters)
            ? Resource.msg('demo.message.refund.success', 'bluesnap', null)
            : Resource.msg('demo.message.refund.error', 'bluesnap', null);

        retrieve = cardHelper.bluesnapCardRetrieve(transactionId);
    } else {
        result = Resource.msg('demo.message.refund.notransactionid', 'bluesnap', null);
    }

    res.print(result);
    res.print('<pre>' + JSON.stringify(retrieve, null, 4) + '</pre>');
    next();
});

/**
 * Controller for test request that gets details about a past transaction
 * Credit Cerd on a transaction
 * Parameter for GET request:
 *   transactionId (required)    - ID of the transaction to be refunded
 */
server.get('Retrieve', server.middleware.https, function (req, res, next) {
    var transactionId = req.querystring.transactionId;
    var result = null;
    if (!empty(transactionId)) {
        result = cardHelper.bluesnapCardRetrieve(transactionId);
    }

    res.print('<pre>' + JSON.stringify(result, null, 4) + '</pre>');
    next();
});

module.exports = server.exports();
