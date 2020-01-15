'use strict';

var ISML = require('dw/template/ISML');
var Transaction = require('dw/system/Transaction');
var Site = require('dw/system/Site').getCurrent();
var SystemObjectMgr = require('dw/object/SystemObjectMgr');

var group = 'BLUESNAP';
var sitepref = Site.getPreferences().getCustom();
var preferences = SystemObjectMgr.describe('SitePreferences').getAttributeGroup(group).getAttributeDefinitions();

/**
 * @description get BlueSnap UDFs object from SitePreferences custom attribute field
 * @returns {Object} - contains array of UDFs objects
 */
function getUdfsFromPref() {
    var udfspref = sitepref['bluesnap_FraudUDFs'];
    var result = { udf: [] };
    if (!empty(udfspref)) {
        try {
            result = JSON.parse(udfspref);
        } catch (error) {
            result = { udf: [] };
        }
    }

    if (!result.hasOwnProperty('udf')) {
        result.udf = [];
    }
    return result;
}

/**
 * @description Get BlueSnap UDFs object from HttpParameterMap
 * @param {dw.web.HttpParameterMap} params - map of HTTP parameters
 * @returns {Object} - contains array of UDFs objects
 */
function getUdfsFromParams(params) {
    var udfParams = params.getParameterMap('udf_');
    var parameterCount = Math.ceil(udfParams.getParameterCount() / 2);
    var result = { udf: [] };

    for (var i = 0; i < parameterCount; i++) {
        var udfNameField = udfParams.get(i + '_name');
        var udfValueField = udfParams.get(i + '_value');
        result.udf.push({
            udfName  : udfNameField.value,
            udfValue : udfValueField.value
        });
    }
    return result;
}

/**
 * @description render dashboard
 */
function Start() {
    var params = request.httpParameterMap.getParameterMap('custom_');
    var error = 'false';
    var bluesnapUDFs = { udf: [] };

    switch (params['submit'].value) {
    case 'save':
        handleForm(params);
        bluesnapUDFs = getUdfsFromPref();
        break;
    case 'add':
        bluesnapUDFs = getUdfsFromParams(params);
        bluesnapUDFs.udf.push({
            udfName  : '',
            udfValue : ''
        });
        break;
    default:
        var key = params['submit'].intValue;
        if (!empty(key)) {
            bluesnapUDFs = getUdfsFromParams(params);
            bluesnapUDFs.udf.splice(key, 1);
        } else {
            bluesnapUDFs = getUdfsFromPref();
        }
    }

    ISML.renderTemplate('bmext', {
        sitepref    : sitepref,
        preferences : preferences,
        group       : group,
        error       : error,
        udfs        : bluesnapUDFs
    });
}

/**
 * @description handle form
 * @param {dw.web.HttpParameterMap} params - map of HTTP parameters
 */
function handleForm(params) {
    if (params.getParameterCount() > 1) {
        var prefs = preferences.iterator(); // Method return an Object of type {dw.util.Iterator} that doesn't have a close() method
        while (prefs.hasNext()) {
            var pref = prefs.next();
            var id = pref.getID();
            var type = pref.valueTypeCode;
            var value = null;
            switch (type) {
            // string, text
            case 4:
            case 3:
                value = params[id].value;
                break;
                // boolean
            case 8:
                value = params[id].value == 'on';
                break;
                // enum of strings
            case 23:
                value = params[id].value.split(',');
                break;
                // set of strings
            case 33:
                value = params[id].value;
                break;
            default:
                break;
            }

            if (id === 'bluesnap_FraudUDFs') {
                var bluesnapUDFs = getUdfsFromParams(params);
                value = JSON.stringify(bluesnapUDFs);
            }

            if (value !== null) {
                Transaction.wrap(function () {
                    Site.setCustomPreferenceValue(id, value);
                });
            }
        }
    }
}

exports.Start = Start;
exports.Start.public = true;
