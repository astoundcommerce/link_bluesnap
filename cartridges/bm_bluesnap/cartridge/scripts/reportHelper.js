'use strict';

var getBluesnapPreference = require('*/cartridge/scripts/lib/bluesnapdata.js');
var bluesnapService = require('*/cartridge/scripts/service/bluesnapinit.js');
var serviceHelper = require('*/cartridge/scripts/service/serviceHelper.js');
var constants = require('*/cartridge/scripts/constants.js');
var instance = constants[getBluesnapPreference('Instance')];
var Resource = require('dw/web/Resource');

/**
 * bluesnapReportData get report about BlueSnap transactions
 * @param {string} code - code of report type
 * @param {array} param - array of query  parameters for report
 * @returns {Object}    - response report object
 */
function bluesnapReportData(code, param) {
    var service = bluesnapService.init();
    service.setRequestMethod('GET');
    service.setURL(instance + '/report/' + code);

    for (var i = 0; i < param.length; i++) {
        service.addParam(param[i].name, param[i].value);
    }

    var result = serviceHelper.callJsonService('bluesnapReportData', service, {});
    if (result) {
        var bluesnapHeaders = service.getClient().getResponseHeaders();
        result.startRow = bluesnapHeaders.hasOwnProperty('start-row') ? bluesnapHeaders['start-row'][0] : null;
        result.totalRowCount = bluesnapHeaders.hasOwnProperty('total-row-count') ? bluesnapHeaders['total-row-count'][0] : null;
        var pageSize = bluesnapHeaders.hasOwnProperty('page-size') ? bluesnapHeaders['page-size'][0] : null;
        result.endRow = result.startRow && pageSize && result.totalRowCount ? String(+result.startRow + +pageSize - 1) : null;
        result.nextPageToken = bluesnapHeaders.hasOwnProperty('next-page-token') ? bluesnapHeaders['next-page-token'][0] : null;
    } else {
        try {
            result = JSON.parse(service.getClient().getErrorText());
        } catch (error) {
            result = {};
        }
    }

    if (!result.hasOwnProperty('data') && !result.hasOwnProperty('message')) {
        result = {
            message: [
                {
                    errorName   : Resource.msg('report.msg.badresponse', 'report', null),
                    code        : '',
                    description : Resource.msg('report.msg.badresponsedescription', 'report', null)
                }
            ]
        };
    }

    return result;
}

/**
 * getTableTemplate get array of headings for report table headers
 * @param {Object} data - response BlueSnap data report
 * @param {boolean} emptyInclude - include table headers without data
 * @returns {array} - array of headings for report table headers
 */
function getTableTemplate(data, emptyInclude) {
    var result = [];
    if (data.hasOwnProperty('data') && data.data.length > 0) {
        for (var i = 0; i < data.data.length; i++) {
            var rowData = data.data[i];
            for (var key in rowData) {
                if (result.indexOf(key) < 0 && (emptyInclude || rowData[key])) {
                    result.push(key);
                }
            }
        }
    }
    return result;
}

module.exports.bluesnapReportData = bluesnapReportData;
module.exports.getTableTemplate = getTableTemplate;
