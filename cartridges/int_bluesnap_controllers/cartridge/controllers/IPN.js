'use strict';

var guard = require('*/cartridge/scripts/guard');

/**
 * Handle BlueSnap IPN
 * @returns {Object} - BlueSnap IPN response
 */
function Handle() {
    var IPNHelper = require('*/cartridge/scripts/IPNHelper');
    var responseCode = IPNHelper.handleData(request.httpParameterMap);
    
    response.setStatus(responseCode);
    return response;
}


module.exports.Handle = guard.ensure(['post', 'https'], Handle);

