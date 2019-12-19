'use strict';

/* API includes */
var ISML = require('dw/template/ISML');
var URLUtils = require('dw/web/URLUtils');
var StringUtils = require('dw/util/StringUtils');
var Calendar = require('dw/util/Calendar');

/* Scripts includes */
var reportHelper = require('~/cartridge/scripts/reportHelper.js');
var reportConstants = require('~/cartridge/scripts/reportConstants.js');

/**
 * Render form to select type of report.
 */
function start() {
    ISML.renderTemplate('report/reportform', {
        continueUrl    : URLUtils.https('BluesnapBMreport-HandleFormAttribure'),
        reportConfig   : reportConstants.reportConfig,
        customFromDate : StringUtils.formatCalendar(new Calendar(), 'yyyy-MM-dd'),
        customToDate   : StringUtils.formatCalendar(new Calendar(), 'yyyy-MM-dd')
    });
}

/**
 * Handle selected report type and attributes.
 */
function handleFormAttribure() {
    var params = request.httpParameterMap;
    var nameOfParamsSet = params.getParameterNames();
    nameOfParamsSet.remove('csrf_token');

    var typeReport = nameOfParamsSet.contains('report_type') ? params.get('report_type').stringValue : null;
    nameOfParamsSet.remove('report_type');

    var newPageSize = nameOfParamsSet.contains('newPageSize') ? params.get('newPageSize').stringValue : null;
    nameOfParamsSet.remove('newPageSize');

    var nextPageToken = nameOfParamsSet.contains('nextPageToken') ? params.get('nextPageToken').stringValue : null;
    nameOfParamsSet.remove('nextPageToken');

    var nextPageButton = !!nameOfParamsSet.contains('pageNext');
    nameOfParamsSet.remove('pageNext');

    var names = nameOfParamsSet.iterator();
    var queryParams = [];

    while (names.hasNext()) {
        var attrName = names.next();
        var attrValue = params.get(attrName).stringValue;
        attrValue = (attrName === 'pageSize' && !empty(newPageSize)) ? newPageSize : StringUtils.trim(attrValue);

        if (!empty(attrValue)) {
            queryParams.push({ name: attrName, value: attrValue });
        }
    }

    var reportParams = (nextPageButton && !empty(nextPageToken)) ? [{ name: 'nextPageToken', value: nextPageToken }] : queryParams;
    var reportData = reportHelper.bluesnapReportData(typeReport, reportParams);
    var hasData = reportData.hasOwnProperty('data');
    var tableTitle = hasData ? reportHelper.getTableTemplate(reportData, false) : [];
    var renderTemplate = hasData ? 'report/reportsubmit' : 'report/reporterror';

    ISML.renderTemplate(renderTemplate,
        {
            typeReport  : typeReport,
            tableTitle  : tableTitle,
            reportData  : reportData,
            continueUrl : URLUtils.https('BluesnapBMreport-Start'),
            nextPageUrl : URLUtils.https('BluesnapBMreport-HandleFormAttribure'),
            params      : queryParams
        });
}

exports.Start = start;
exports.Start.public = true;

exports.HandleFormAttribure = handleFormAttribure;
exports.HandleFormAttribure.public = true;
