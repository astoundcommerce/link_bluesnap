'use strict';

var getBlueSnapPreference = require('~/cartridge/scripts/lib/bluesnapdata.js');

/**
 * @description create fraudInfo object for transaction
 * @param {dw.order.Order} cart - Order
 * @returns {Object} - BlueSnap transactionFraudInfo object
 */
function bluesnapGetFraudInfo(cart) {
    var address = cart.getDefaultShipment().getShippingAddress();
    var transactionFraudInfo = {
        fraudSessionId      : cart.getUUID(),
        // In production, value company must be taken from the CRM system of client.
        company             : 'testCompany',
        shippingContactInfo : {
            zip       : address.postalCode,
            country   : address.countryCode.valueOf(),
            firstName : address.firstName,
            lastName  : address.lastName,
            city      : address.city,
            address2  : address.address2 || '',
            address1  : address.address1
        }
    };
    // just for addresses where no states
    if (address.stateCode && address.stateCode != 'undefined') {
        transactionFraudInfo.shippingContactInfo.state = address.stateCode;
    }

    if (getBlueSnapPreference('FraudEnterprise')) {
        transactionFraudInfo.enterpriseSiteId = getBlueSnapPreference('SiteId');
        var udfsPref = getBlueSnapPreference('FraudUDFs');
        var udfs = null;
        if (!empty(udfsPref)) {
            try {
                udfs = JSON.parse(udfsPref);
            } catch (error) {
                udfs = null;
            }
            if (!empty(udfs) && udfs.hasOwnProperty('udf')) {
                transactionFraudInfo.enterpriseUdfs = udfs;
            }
        }
    }

    return transactionFraudInfo;
}

exports.bluesnapGetFraudInfo = bluesnapGetFraudInfo;
