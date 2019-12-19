'use strict';

/**
 * Call Bluesnap REST service and handle common errors
 */

var logger = require('dw/system/Logger').getLogger('bluesnap');
var stringUtils = require('dw/util/StringUtils');
var Resource = require('dw/web/Resource');

var UNEXPECTED_ERROR_CODE = '-1';

/**
 * Formats standard error message string
 * @param {string} title        - Error title, place or function name
 * @param {string} url          - Url of the service endpoint
 * @param {number} error        - HTTP response code for an HTTPService
 * @param {string} errorMessage - Error Message
 * @returns {string}            - formatted message
 */
function standardErrorMessage(title, url, error, errorMessage) {
    return stringUtils.format('Error: {0},\nUrl: {1},\nErrorCode: {2},\nMessage: {3}',
        title || 'BlueSnap Rest Service',
        url,
        error,
        errorMessage
    );
}

/**
 * Parse error message and write it to log
 * @param {string}        title  - Error title, place or function name
 * @param {string}        url    - Url of the service endpoint
 * @param {dw.svc.Result} result - result
 * @returns {null} - Null
 */
function logServiceError(title, url, result) {
    var logMessage = '';
    var bluesnapErrorResponse;

    switch (result.error) {
    case 400:

        try {
            bluesnapErrorResponse = JSON.parse(result.errorMessage);

            if (bluesnapErrorResponse.hasOwnProperty('message')) {
                bluesnapErrorResponse.message.forEach(function (bluesnapError) {
                    logMessage += stringUtils.format('Name: {0}, Code: {1}, Description: {2}\n',
                        bluesnapError.errorName,
                        bluesnapError.code,
                        bluesnapError.description
                    );
                });
            } else {
                // Response is in undocumented format. Write it as plain string.
                logMessage = standardErrorMessage(title, url, result.error, result.errorMessage);
            }
        } catch (parseError) {
            // Response is not a JSON. Write is as plain string.
            logMessage = standardErrorMessage(title, url, result.error, result.errorMessage);
        }
        break;

    case 500:
    case 403:
    default:
        logMessage = standardErrorMessage(title, url, result.error, result.errorMessage);
    } // switch ends

    logger.error(logMessage);

    return null;
}

/**
 * Parse Bluesnap error json string, find the error codes and 'pulic' messages - mesages that can be shown to the storefront user
 * @param {dw.svc.Result} result - result
 * @returns {{
 *              errorCodes : string[],
 *              publicErrorMessages : string[]
 *          }}
 *      `errorCodes` - Bluesnap API or http error codes. '-1' for unexpected errors.
 *      `publicErrorMessages` - Messages that can be shown to the shopper.
 */
function _getBluesnapErrors(result) {
    var publicErrorMessages = [];
    var errorCodes = [];
    var bluesnapError;
    var publicErrorCodes = require('*/cartridge/scripts/constants.js').publicErrorCodes;

    switch (result.error) {
    case 400:

        try {
            bluesnapError = JSON.parse(result.errorMessage);

            if (bluesnapError.hasOwnProperty('message')) {
                bluesnapError.message.forEach(function (errorItem) {
                    // save all error codes
                    errorCodes.push(errorItem.code || UNEXPECTED_ERROR_CODE);
                    // save only messages that user allowed to see. (configured in int_bluesnap/cartridge/scripts/constants.js)
                    if (publicErrorCodes.indexOf(errorItem.code) != -1) {
                        publicErrorMessages.push(Resource.msg('bluesnapapi.publicerror.' + errorItem.code, 'bluesnap', errorItem.description));
                    }
                });
            } else {
                // Response is in undocumented format.
                errorCodes.push(UNEXPECTED_ERROR_CODE);
            }
        } catch (parseError) {
            // Response is not a JSON.
            errorCodes.push(UNEXPECTED_ERROR_CODE);
        }
        break;

    case 500:
        publicErrorMessages.push(Resource.msg('bluesnapapi.publicerror.500', 'bluesnap', null));
        errorCodes.push(result.error);
        break;
    case 403:
        publicErrorMessages.push(Resource.msg('bluesnapapi.publicerror.403', 'bluesnap', null));
        errorCodes.push(result.error);
        break;
    default:
    }

    return {
        errorCodes          : errorCodes,
        publicErrorMessages : publicErrorMessages
    };
}

/**
 * Call BlueSnap service, parse errors and return data or null
 * @param {string}         title   - Name of the action or method to describe the action performed
 * @param {dw.svc.Service} service - Service instance to call
 * @param {Object}         params  - Params to be passed to service.call function
 * @returns {?{
 *              response: string,
 *              headers: dw.util.Map,
 *              statusCode: number
 *          }}                     - BlueSnap Response object or `null` in case of errors
 */
function callService(title, service, params) {
    var result;
    var data = null;

    try {
        result = service.setThrowOnError().call(JSON.stringify(params));
    } catch (error) {
        logger.error('HTTP Service request failed.\nMessage:{0}, Url:{1}', error.name, service.getURL());
        return null;
    }

    if (result.ok) {
        data = result.object;
    } else {
        logServiceError(title, service.getURL(), result);
    }

    return data;
}

/**
 * Check if response type is JSON
 * @param {dw.svc.HTTPService} service - Service to obtain client from
 * @returns {boolean}                  - boolean if `Content-Type` is `application/json`
 */
function isResponseJSON(service) {
    var contentTypeHeader = service.getClient().getResponseHeader('Content-Type');
    return contentTypeHeader && contentTypeHeader.split(';')[0].toLowerCase() == 'application/json';
}

/**
 * Call BlueSnap service, parse errors and return data or null
 * @param {string}             title   - Name of the action or method to describe the action performed
 * @param {dw.svc.HTTPService} service - Service instance to call
 * @param {Object}             params  - Params to be passed to service.call function
 * @returns {?Object}                  - `JSON.parse` result or `null` in case of errors
 */
function callJsonService(title, service, params) {
    var obj = null;
    var result = callService(title, service, params);

    if (result) {
        if (isResponseJSON(service)) {
            try {
                obj = JSON.parse(result.response);
            } catch (parseError) {
                // response is marked as json, but it is not
                logger.error('JSON.parse error. Method: {0}. String:{1}', title, result.response);
            }
        } else {
            logger.warn('Response is not JSON. Method: {0}. Result:{1}', title, result);
        }
    }
    return obj;
}
/**
 *
 * @param {string} title - Name of the action or method to describe the action performed
 * @param {dw.svc.HTTPService} service - Service instance to call
 * @param {Object} params - Params to be passed to service.call function
 * @returns {dw.system.Status} - for success calls result data available via getDetail('object');
 */
function callJsonServiceExt(title, service, params) {
    var Status = require('dw/system/Status');

    var callStatus = new Status(Status.OK);
    var statusItem = callStatus.items.get(0);

    var result;
    var data = null;
    var bluesnapErrors;

    try {
        result = service.setThrowOnError().call(JSON.stringify(params));
    } catch (error) {
        statusItem.setStatus(Status.ERROR);
        logger.error('HTTP Service request failed.\nMessage:{0}, Url:{1}', error.name, service.getURL());
        return callStatus;
    }

    if (result.ok) {
        if (isResponseJSON(service)) {
            try {
                data = JSON.parse(result.object.response);
                statusItem.addDetail('object', data);
            } catch (parseError) {
                // response is marked as json, but it is not
                statusItem.setStatus(Status.ERROR);
                logger.error('JSON.parse error. Method: {0}. String:{1}', title, result.object.response);
            }
        } else {
            statusItem.setStatus(Status.ERROR);
            logger.warn('Response is not JSON. Method: {0}. Result:{1}', title, result.object.response);
        }
    } else {
        statusItem.setStatus(Status.ERROR);
        bluesnapErrors = _getBluesnapErrors(result);
        if (bluesnapErrors.publicErrorMessages.length > 0) {
            statusItem.addDetail('bluesnapPublicErrorMessages', bluesnapErrors.publicErrorMessages);
        }
        statusItem.addDetail('bluesnapErrorCodes', bluesnapErrors.errorCodes);
        logServiceError(title, service.getURL(), result);
    }

    return callStatus;
}

module.exports.callService = callService;
module.exports.callJsonService = callJsonService;
module.exports.callJsonServiceExt = callJsonServiceExt;
module.exports.UNEXPECTED_ERROR_CODE = UNEXPECTED_ERROR_CODE;
