'use strict';

/**
 * @description function for getting preferences for BlueSnap
 *
 *   id             | Description                          | type of preference|    Result
 *   ------------------------------------------------------------------------------------------------------------
 *   Enable         | Enable BlueSnap                      | Boolean           | true/false
 *   ACH            | Enable ACH Payment                   | Boolean           | true/false
 *   CreditDebit    | Credit/Debit Cards Payment procesing | Enum of Strings   | Auth only / Auth and Capture
 *   Instance       | BlueSnap instance type               | Enum of Strings   | production/sandbox
 *   IPNs           | Enable IPNs                          | Boolean           | true/false
 *   SEPA           | Enable SEPA Payment                  | Boolean           | true/false
 *   Level          | Level 2/3 Data                       | Boolean           | true/false
 *   Masterpass     | Enable Masterpass                    | Boolean           | true/false
 *   GooglePay      | Enable Bluesnap Google Pay           | Boolean           | true/false
 *   3DSecure       | Enable 3D Secure Payments            | Boolean           | true/false
 *   HostedPayment  | Enable Hosted Payment                | Boolean           | true/false
 *   VisaCheckout   | Enable Visa Checkout                 | Boolean           | true/false
 *   ApplePay       | Enable Bluesnap Apple Pay            | Boolean           | true/false
 *   LATAM          | Enable LATAM Payments                | Boolean           | true/false
 *   FraudDeviceData| Enable fraud device data collector   | Boolean           | true/false
 *   FraudEnterprise| Enable Enterprise level fraud service| Boolean           | true/false
 *   SiteId         | Site IDs for Enterprise fraud service| String            | (BlueSnap Site IDs)
 *   FraudUDFs      | UDFs for Enterprise fraud service    | String            | (JSON BlueSnap UDFs)
 *   softDescriptor | Description of the transaction       | String            | String
 *   -------------------------------------------------------------------------------------------------------------
 *   Example:
 *    var bluesnap = require('int_bluesnap/cartridge/scripts/lib/bluesnapdata.js');
 *    bluesnap('CreditDebit');
 * ---------------------------------------------------------------------------------------------------------------
 * @param {string} id - ID preferences
 * @returns {*} - value preferences
 */
function getPreference(id) {
    var site = require('dw/system/Site').getCurrent();
    var result = site.getCustomPreferenceValue('bluesnap_' + id) !== null ? site.getCustomPreferenceValue('bluesnap_' + id) : false;
    return result;
}

module.exports = getPreference;
