'use strict';

/**
 * Initialize services for the BluSnap cartridge
 */

/**
 * @description initialize services for the BluSnap cartridge
 * @typedef {Object} BSResponse
 * @property {string} response - client.text
 * @property {dw.util.Map} headers - client.responseHeaders
 * @property {number} statusCode - client.statusCode
 * @returns {dw.svc.HTTPService} - setvise object
 */
function init() {
    var initService = require('dw/svc/LocalServiceRegistry').createService('bluesnap.http', {
        createRequest: function (svc, args) {
            svc.setAuthentication('BASIC');
            svc.addHeader('Content-Type', 'application/json');
            svc.addHeader('Accept', 'application/json');
            return args;
        },
        //-----------------------
        // @returns {BSResponse}
        //-----------------------
        parseResponse: function (svc, client) {
            // we only get here for request with httpStatus 200
            return {
                response   : client.text,
                headers    : client.responseHeaders,
                statusCode : client.statusCode
            };
        },
        filterLogMessage: function (data) {
            return data;
        }
    });
    return initService;
}

module.exports.init = init;
