'use strict';

var guard = require('*/cartridge/scripts/guard');
var Logger = require('dw/system/Logger');
// var Transaction = require('dw/system/Transaction');
// var OrderMgr = require('dw/order/OrderMgr');

/**
 * Hamdle BlueSnap IPN
 * @returns {Object} - BlueSnap IPN response
 */
function Handle() {
    var inputData = request.httpParameterMap;
    var log = {};
    if (inputData.transactionType) {
        var setOfNames = inputData.getParameterNames().iterator();
        while (setOfNames.hasNext()) {
            var param = setOfNames.next();
            log[param] = inputData[param].stringValue;
        }
        /*
           Here we can handle transactiontype
           update order information
           or update customer profile
           var orderNo = inputData.merchantTransactionId ? inputData.merchantTransactionId.stringValue : false;
            if (orderNo) {
            Transaction.wrap(function () {
                var order = OrderMgr.getOrder(orderNo);
            });
        }
        */
        Logger.info('\n IPN CALL: ' + inputData.transactionType + ' \n ' + JSON.stringify(log, undefined, '\t'));
        response.setStatus(200);
    } else {
        Logger.error('FORBIDDEN INCOMING CALL');
        response.setStatus(400);
    }
    return response;
}


module.exports.Handle = guard.ensure(['post', 'https'], Handle);

