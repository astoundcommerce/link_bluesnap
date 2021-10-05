'use strict';

/**
 * Handle IPN request data
 * @param {dw.web.HttpParameterMap} inputData - inputData
 * @returns {number} - response status code
 */
function handleData(inputData) {
    var Logger = require('dw/system/Logger');
    var responseCode;
    var log = {};

    if (inputData.transactionType) {
        var setOfNames = inputData.getParameterNames().iterator(); // Method return an Object of type {dw.util.Iterator} that doesn't have a close() method
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
        responseCode = 200;
    } else {
        Logger.error('FORBIDDEN INCOMING CALL');
        responseCode = 400;
    }

    return responseCode;
}

module.exports.handleData = handleData;
