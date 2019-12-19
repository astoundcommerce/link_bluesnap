'use strict';

/**
 * @typedef {Object} CreditCard
 * @property {string} cardLastFourDigits - Last four digits of the credit card.
 * @property {string} cardType - Credit card type.
 * @property {string} cardSubType - Card sub-type, such as Credit or Debit
 * @property {string} cardCategory - Card category, such as business or prepaid. Appears only if relevant.
 * @property {number} expirationMonth - Credit card expiration month. Appears only in responses for Create and Retrieve Vaulted Shopper.
 * @property {number} expirationyear - Credit card expiration 4-digit year. Appears only in responses for Create and Retrieve Vaulted Shopper.
 * @property {string} issueNumber - Issue number on the credit card.
 */

/**
 * @typedef {Object} CreditCardInfo
 * @property {object} billingContactInfo - Last four digits of the credit card.
 * @property {object} creditCard - Credit card type.
 * @property {object} processingInfo - Card sub-type, such as Credit or Debit
 */

/**
 * @typedef {Object} PaymentSources
 * @property {CreditCardInfo[]} creditCardInfo - Array containing billingContactInfo(optional), creditCard, processingInfo for each payments source(there may be multiple payment sources):
 * @property {EcpDetails[]} ecpDetails - Array containing the ecp detail properties. See ecpDetails.
 * @property {SepaDirectDebitInfo[]} sepaDirectDebitInfo - Array containing the following for each payment source (there may be multiple payment sources):
 *             billingContactInfo {object} optional
 *             sepaDirectDebit {object} optional
*/

/**
 * @typedef {Object} VaultedShopper
 *
 * @property {number} vaultedShopperId    - ID of an existing vaulted shopper.
 * @property {string} firstName           - Shopper's first name. Maximum 100 characters.
 * @property {string} lastName            - Shopper's last name. Maximum 100 characters.
 * @property {string} country             - Shopper's country code. See Country codes
 * @property {string} state               - Shopper's state code. See State and province codes
 * @property {string} address             - Shopper's address line 1. Maximum 100 characters.
 * @property {string} address2            - Shopper's address line 2. Maximum 100 characters.
 * @property {string} email               - Shopper's email address.
 * @property {string} zip                 - Shopper's ZIP code.
 * @property {string} phone               - Shopper's phone number. Between 2-36 characters.
 * @property {string} companyName         - Shopper's company name
 * @property {string} shopperCurrency     - Shopper's currency. See Currency codes.
 * @property {string} personalIdentificationNumber   - The shopper's local personal identification number. These are the ID types per country: Argentina - DNI (length 7-11 chars), Brazil - CPF/CNPJ (length 11-14 chras), Chile - RUN (length 8-9 chars), Colombia - CC (length 6-10 chars), Mexico - CURP/RFC (length 10-18 chars)
 * @property {string} softDescriptor          - Description that may appear on the shopper's bank statement when BlueSnap validates the card.
 * @property {string} descriptorPhoneNumber   - Merchant's support phone number that may appear on the shopper's bank statement when BlueSnap validates the card.
 * @property {PaymentSources} paymentSources  - See paymentSources.
 * @property {object} lastPaymentInfo         - See lastPaymentInfo.
 * @property {object} shippingContactInfo     - See shippingContactInfo.
 * @property {object} transactionFraudInfo    - See transactionFraudInfo.
 * @property {object} fraudResultInfo         - See fraudResultInfo.
 */

/**
 * Functions to work with Bluesnap Shoppers Vault
 *
 * @module scripts/VaultHelper
 */

var config = require('*/cartridge/scripts/lib/bluesnapdata.js');
var constants = require('*/cartridge/scripts/constants.js');
var instance = constants[config('Instance')];

var bluesnapService = require('*/cartridge/scripts/service/bluesnapinit');
var serviceHelper = require('*/cartridge/scripts/service/serviceHelper');

/**
 * Get Vaulted Shopper Data from Bluesnap
 * @param   {string} shopperId - ID of Vaulted Shopper
 * @returns {VaultedShopper} Data if the call was successfull `null` in case of error
 */
function getVaultedShopper(shopperId) {
    var service = bluesnapService.init();

    service.setRequestMethod('GET');
    service.setURL(instance + '/vaulted-shoppers/' + shopperId);

    return serviceHelper.callJsonService('GetVaultedShopper', service, null);
}

/**
 * Create Vaulted Shopper
 * @param   {Object} shopperData - Shopper data according to Bluesnap API
 * @returns {dw.system.Status} for success calls result data is available via getDetail('object');
 */
function createVaultedShopper(shopperData) {
    var service = bluesnapService.init();

    service.setRequestMethod('POST');
    service.setURL(instance + '/vaulted-shoppers');

    return serviceHelper.callJsonServiceExt('CreateVaultedShopper', service, shopperData);
}

/**
 * Update Vaulted Shopper
 * @param   {string} shopperId - Bluesnap Vault Shopper ID
 * @param   {Object} shopperData - Shopper data according to Bluesnap API
 * @returns {dw.system.Status} for success calls, result data is available via getDetail('object');
 */
function updateVaultedShopper(shopperId, shopperData) {
    if (!shopperData) {
        throw new Error('Vaulted Shopper Data cannot be empty for updateVaultedShopper operation');
    }

    var service = bluesnapService.init();

    service.setRequestMethod('PUT');
    service.setURL(instance + '/vaulted-shoppers/' + shopperId);

    return serviceHelper.callJsonServiceExt('UpdateVaultedShopper', service, shopperData);
}
/**
 * Get the unified list of payment methods stored in vault
 * for the payment methods selection feature
 * 
 * @returns {Object} - Vaulted payments list object
 */
function getVaultedPaymentsList() {
    var PaymentModels = require('*/cartridge/scripts/models/paymentAPI');
    var vaultedShopper;

    var creditCardsList = null;
    var ecpDetailsList = null;
    var sepaDirectList = null;

    var unifiedList = {
        creditCards : [],
        ecp         : [],
        sepa        : []
    };
    var vaultedShopperModel;

    if (!customer.registered || empty(customer.profile.custom.bsVaultedShopperId)) {
        return null;
    }

    vaultedShopper = getVaultedShopper(customer.profile.custom.bsVaultedShopperId);

    if (vaultedShopper) {
        vaultedShopperModel = new PaymentModels.VaultedShopperModel(vaultedShopper);

        creditCardsList = vaultedShopperModel.getCreditCardsList();
        unifiedList.creditCards = creditCardsList.map(function (pm) {
            return {
                paymentSignature : pm.firstName + ' ' + pm.lastName + ' ' + pm.cardType + '-' + pm.cardLastFourDigits,
                paymentData      : pm.cardType + '-' + pm.cardLastFourDigits,
                method           : pm
            };
        });

        ecpDetailsList = vaultedShopperModel.getEcpDetailsList();
        unifiedList.ecp = ecpDetailsList.map(function (pm) {
            return {
                paymentSignature : pm.firstName + ' ' + pm.lastName + ' ' + pm.publicAccountNumber + '-' + pm.publicRoutingNumber,
                paymentData      : pm.accountType + '-' + pm.publicAccountNumber + '-' + pm.publicRoutingNumber,
                method           : pm
            };
        });

        sepaDirectList = vaultedShopperModel.getSepaDirectList();
        unifiedList.sepa = sepaDirectList.map(function (pm) {
            return {
                paymentSignature : pm.firstName + ' ' + pm.lastName + ' ' + pm.ibanFirstFour + '-' + pm.ibanLastFour,
                paymentData      : pm.ibanFirstFour + '-' + pm.ibanLastFour,
                method           : pm
            };
        });
    }
    return unifiedList;
}

module.exports.createVaultedShopper = createVaultedShopper;
module.exports.updateVaultedShopper = updateVaultedShopper;
module.exports.getVaultedShopper = getVaultedShopper;
module.exports.getVaultedPaymentsList = getVaultedPaymentsList;
