'use strict';

/* Scripts includes */
var getBlueSnapPreference = require('*/cartridge/scripts/lib/bluesnapdata.js');
var bluesnapService = require('*/cartridge/scripts/service/bluesnapinit.js');
var constants = require('*/cartridge/scripts/constants.js');
var instance = constants[getBlueSnapPreference('Instance')];
var serviceHelper = require('*/cartridge/scripts/service/serviceHelper');
var fraudHelper = require('*/cartridge/scripts/fraudHelper.js');
var enhancedDataHelper = require('*/cartridge/scripts/enhancedDataHelper');

/**
 * @description error message and write it to log
 * @param {string} title - сaller name
 */
function _logServiceDisableError(title) {
    var logger = require('dw/system/Logger').getLogger('bluesnap');
    logger.error('\nError: {0}, \nMessage: Service is disabled', title || 'BlueSnap Service Error');
}

/**
 * @description gets details about a past transaction, such as the transaction type,
 * amount, cardholder or vaulted shopper, credit card, processing info, and so on.
 * @param {string} txId - ID of transaction
 * @returns {Object} - API response
 */
function bluesnapRerieveTransaction(txId) {
    var service = bluesnapService.init();
    service.setRequestMethod('GET');
    service.setURL(instance + '/transactions/' + txId);
    return service.call();
}

/**
 * cardTransactionType defines if it is Auth only or Auth and Capture
 * @param {dw.order.Order} cart - order
 * @param {Object} creditCard - creditCard object;
 * @param {boolean} storeInBluesnapVault - needed store card to Bluesnap Vault Shopper
 * @returns {Object|null} - API response
 */
function bluesnapCreditDebit(cart, creditCard, storeInBluesnapVault) {
    if (!getBlueSnapPreference('Enable')) {
        _logServiceDisableError('bluesnapCreditDebitPayment');
        return null;
    }

    var service = bluesnapService.init();
    service.setURL(instance + '/transactions');
    var auth = getBlueSnapPreference('CreditDebit');
    var price = cart.getTotalGrossPrice();
    var param = {
        amount                : price.getValue(),
        merchantTransactionId : cart.getOrderNo(),
        currency              : price.getCurrencyCode(),
        transactionFraudInfo  : fraudHelper.bluesnapGetFraudInfo(cart),
        cardTransactionType   : auth.valueOf()
    };

    if (getBlueSnapPreference('Level')) {
        param.level3Data = enhancedDataHelper.bluesnapGetlevel3Data(cart);
    }

    var softDesc = getBlueSnapPreference('softDescriptor');
    if (!empty(softDesc)) {
        param.softDescriptor = softDesc.length > 20 ? softDesc.substring(0, 20) : softDesc;
    }

    if (customer.authenticated) {
        /*
            Next block is to decide if we should send the vaultedShopperId or not.
            1. If we have cardLastFourDigits, it means user pays with vaulted card, and sending Id is obligatory,
            2. If user checked storeInBluesnapVault, card sould be saved in vault.
                2.1 If the user already has vault, send the id, bluesnap will add card to existing vault
                2.2 If user has no vault, send nothing,
                    Bluesnap will generate an Id and we'll save it in profile.custom.bsVaultedShopperId
            3. If storeInBluesnapVault is not checked, no not send vaultedShopperId anyway.
                Bluesnap will always generate new value, but we will just skip it
        */
        if ('cardLastFourDigits' in creditCard) { 
            param.vaultedShopperId = customer.profile.custom.bsVaultedShopperId;
        } else {
            if (storeInBluesnapVault && customer.profile.custom.bsVaultedShopperId) { // do we want to add current card to the vault?
                param.vaultedShopperId = customer.profile.custom.bsVaultedShopperId;
            }
            param.cardHolderInfo = creditCard.ownerInfo;
        }
    } else {
        param.cardHolderInfo = creditCard.ownerInfo;
    }

    delete (creditCard.ownerInfo);

    param.creditCard = creditCard;

    return serviceHelper.callJsonService('bluesnapCreditDebitPayment', service, param);
}

/**
 * bluesnapLatAm defines if it is Auth only or Auth and Capture
 * @param {dw.order.Order} cart - order
 * @param {Object} creditCard - creditCard object
 * @param {Object} cardHolder - cardHolder object
 * @param {boolean} storeInBluesnapVault - needed store card to Bluesnap Vault Shopper
 * @returns {Object|null} - API response
 */
function bluesnapLatAm(cart, creditCard, cardHolder, storeInBluesnapVault) {
    if (!getBlueSnapPreference('Enable')) {
        _logServiceDisableError('bluesnapCreditDebitPayment');
        return null;
    }

    var service = bluesnapService.init();
    service.setURL(instance + '/transactions');
    var auth = getBlueSnapPreference('CreditDebit');
    var price = cart.getTotalGrossPrice();
    var param = {
        amount                : price.getValue(),
        merchantTransactionId : cart.getOrderNo(),
        currency              : price.getCurrencyCode(),
        transactionFraudInfo  : fraudHelper.bluesnapGetFraudInfo(cart),
        cardTransactionType   : auth.valueOf()
    };

    if (getBlueSnapPreference('Level')) {
        param.level3Data = enhancedDataHelper.bluesnapGetlevel3Data(cart);
    }

    var softDesc = getBlueSnapPreference('softDescriptor');
    if (!empty(softDesc)) {
        param.softDescriptor = softDesc.length > 20 ? softDesc.substring(0, 20) : softDesc;
    }

    if (customer.authenticated) {
        /*
        */
        if ('cardLastFourDigits' in creditCard) { 
            param.vaultedShopperId = customer.profile.custom.bsVaultedShopperId;
        } else {
            if (storeInBluesnapVault && customer.profile.custom.bsVaultedShopperId) {                                       // do we want to add current card to the vault?
                param.vaultedShopperId = customer.profile.custom.bsVaultedShopperId;
            }
            param.cardHolderInfo = cardHolder;
        }
    } else {
        param.cardHolderInfo = cardHolder;
    }

    param.creditCard = creditCard;

    return serviceHelper.callJsonService('bluesnapCreditDebitPayment', service, param);
}

/**
 * Execute ACH payment transaction
 *
 * @param {dw.order.Basket} cart - basket
 * @param {Object} account - customer account
 * @returns {Object|null} - BlueSnap response
 */
function bluesnapACH(cart, account) {
    if (!getBlueSnapPreference('Enable') || !getBlueSnapPreference('ACH')) {
        _logServiceDisableError('bluesnapCreditDebitPayment');
        return null;
    }

    var service = bluesnapService.init();
    service.setURL(instance + '/alt-transactions');

    var price = cart.getTotalGrossPrice();
    var address = cart.getBillingAddress();

    var param = {
        authorizedByShopper: account.authorize
    };
    param.amount = price.getValue();
    param.merchantTransactionId = cart.getOrderNo();
    param.currency = price.getCurrencyCode();
    param.transactionFraudInfo = fraudHelper.bluesnapGetFraudInfo(cart);

    var nonVaultEcpTransaction = {
        accountType   : account.accountType,
        accountNumber : account.accountNumber,
        routingNumber : account.routingNumber
    };

    var nonVaultPayerInfo = {
        firstName : address.firstName,
        lastName  : address.lastName,
        zip       : address.postalCode,
        phone     : address.phone,
        email     : cart.getCustomerEmail()
    };

    if (account.accountType.indexOf('CORPORATE') != -1) {
        nonVaultPayerInfo.companyName = account.companyName; // required for corporate account
    }

    var softDesc = getBlueSnapPreference('softDescriptor');
    if (!empty(softDesc)) {
        param.softDescriptor = softDesc.length > 20 ? softDesc.substring(0, 20) : softDesc;
    }

    if (customer.authenticated) {
        if ('vaultedShopperId' in account) {
            param.vaultedShopperId = account.vaultedShopperId;
            param.ecpTransaction = {
                accountType         : account.accountType,
                publicAccountNumber : account.publicAccountNumber,
                publicRoutingNumber : account.publicRoutingNumber
            };
        } else {
            param.ecpTransaction = nonVaultEcpTransaction;
            param.payerInfo = nonVaultPayerInfo;
        }
    } else {
        param.payerInfo = nonVaultPayerInfo;
        param.ecpTransaction = nonVaultEcpTransaction;
    }

    return serviceHelper.callJsonService('bluesnapACH', service, param);
}
/**
 * Execute SEPA payment transaction
 *
 * @param {dw.order.Basket} cart - basket
 * @param {Object} sepaDirectDebitTransaction - SEPA Direct Debit object
 * @returns {Object|null} - BlueSnap response
 */
function bluesnapSEPA(cart, sepaDirectDebitTransaction) {
    if (!getBlueSnapPreference('Enable') || !getBlueSnapPreference('SEPA')) {
        _logServiceDisableError('bluesnapCreditDebitPayment');
        return null;
    }

    var service = bluesnapService.init();
    service.setURL(instance + '/alt-transactions');
    var price = cart.getTotalGrossPrice();
    var address = cart.getBillingAddress();

    var param = {
        amount                     : price.getValue(),
        merchantTransactionId      : cart.getOrderNo(),
        authorizedByShopper        : true,
        currency                   : price.getCurrencyCode(),
        sepaDirectDebitTransaction : {},
        transactionFraudInfo       : fraudHelper.bluesnapGetFraudInfo(cart)
    };

    if (sepaDirectDebitTransaction.hasOwnProperty('vaultedShopperId')) {
        param.vaultedShopperId = sepaDirectDebitTransaction.vaultedShopperId;
        param.sepaDirectDebitTransaction.ibanFirstFour = sepaDirectDebitTransaction.ibanFirstFour;
        param.sepaDirectDebitTransaction.ibanLastFour = sepaDirectDebitTransaction.ibanLastFour;
    } else {
        var payerInfo = {
            firstName : address.firstName,
            lastName  : address.lastName,
            zip       : address.postalCode,
            phone     : address.phone,
            email     : cart.getCustomerEmail()
        };
        param.payerInfo = payerInfo;
        param.sepaDirectDebitTransaction.iban = sepaDirectDebitTransaction.iban;
    }

    var softDesc = getBlueSnapPreference('softDescriptor');
    if (!empty(softDesc)) {
        param.softDescriptor = softDesc.length > 20 ? softDesc.substring(0, 20) : softDesc;
    }

    return serviceHelper.callJsonService('bluesnapSEPA', service, param);
}


/**
 * Gets payment hostedfields token ID
 * @returns { Object | null } - hostedfields token
 */
function bluesnapCreateHostedFieldsToken() {
    var service = bluesnapService.init();
    var url = instance + '/payment-fields-tokens';
    service.setRequestMethod('POST');
    service.setURL(url);
    var result = service.call();
    if (result.status == 'OK') {
        result = result.object.headers.Location[0];
        result = result.replace(url + '/', '');
    } else {
        result = null;
    }
    return result;
}

/**
 * Create wallet Api call
 * @param {Object} walletObject - Bluesnap Wallet object
 * @returns {Object|null} - BlueSnap response
 */
function bluesnapCreateWallet(walletObject) {
    var service = bluesnapService.init();
    var url = instance + '/wallets';
    service.setRequestMethod('POST');
    service.setURL(url);
    return serviceHelper.callJsonService('bluesnapCreateWallet', service, walletObject);
}

/**
 * GooglePay send token
 * @param {string} token - GooglePay token
 * @param {Object} basket - basket data for GooglePay
 * @returns {Object|null} - BlueSnap response
 */
function bluesnapProccessingGooglrPay(token, basket) {
    var service = bluesnapService.init();
    var url = instance + '/transactions';
    var auth = getBlueSnapPreference('CreditDebit');
    service.setRequestMethod('POST');
    service.setURL(url);
    var param = {
        cardTransactionType : auth.valueOf(),
        amount              : basket.totalPrice,
        currency            : basket.currencyCode,
        wallet              : {
            walletType          : 'GOOGLE_PAY',
            encodedPaymentToken : token
        }
    };
    
    var softDesc = getBlueSnapPreference('softDescriptor');
    if (!empty(softDesc)) {
        param.softDescriptor = softDesc.length > 20 ? softDesc.substring(0, 20) : softDesc;
    }
       
    return serviceHelper.callJsonService('bluesnapProccessingGooglrPay', service, param);
}

/**
 * 
 * @param {Object} walletObject - BlueSnap wallet dbject
 * @returns {Object|null} - BlueSnap response
 */
function bluesnapOnboardApplePay(walletObject) {
    var service = bluesnapService.init();
    var url = instance + '/wallets/onboarding';
    service.setRequestMethod('POST');
    service.setURL(url);
    var result = serviceHelper.callService('bluesnapOnboardApplePay', service, walletObject);// callJsonService
    return result ? result.response : null;
}

/**
 * BlueSnap ApplePay Proccessing
 * @param {Object} procObj - processing object
 * @returns {Object|null} - BlueSnap response
 */
function bluesnapApplePayProccessing(procObj) {
    var service = bluesnapService.init();
    var url = instance + '/transactions';
    service.setRequestMethod('POST');
    service.setURL(url);
    var result = serviceHelper.callService('bluesnapApplePayProccessing', service, procObj);
    return result ? result.response : null;
}

/**
 * Handles hosted payment fields and proceed payment
 * @param {Basket} cart - basket
 * @param {Object} hostedData - BlueSnap hosted data object
 * @param {boolean} storeInBluesnapVault - store payment instrument to BlueSnap vault shopper
 * @returns {Object|null} - BlueSnap response
 */
function bluesnapHostedFieldsPaymentCall(cart, hostedData, storeInBluesnapVault) {
    if (!getBlueSnapPreference('Enable') || !getBlueSnapPreference('HostedPayment')) {
        _logServiceDisableError('bluesnapCreditDebitPayment');
        return null;
    }

    var service = bluesnapService.init();
    service.setURL(instance + '/transactions');
    var auth = getBlueSnapPreference('CreditDebit');
    var price = cart.getTotalGrossPrice();
    var param = {
        amount                : price.getValue(),
        cardHolderInfo        : hostedData.cardHolderInfo,
        merchantTransactionId : cart.getOrderNo(),
        currency              : price.getCurrencyCode(),
        transactionFraudInfo  : fraudHelper.bluesnapGetFraudInfo(cart),
        pfToken               : hostedData.pfToken,
        cardTransactionType   : auth.valueOf()
    };

    if (getBlueSnapPreference('Level')) {
        param.level3Data = enhancedDataHelper.bluesnapGetlevel3Data(cart);
    }

    var softDesc = getBlueSnapPreference('softDescriptor');
    if (!empty(softDesc)) {
        param.softDescriptor = softDesc.length > 20 ? softDesc.substring(0, 20) : softDesc;
    }

    if (customer.authenticated) {
        if (storeInBluesnapVault && customer.profile.custom.bsVaultedShopperId) {                                       
            // do we want to add current card to the vault?
            param.vaultedShopperId = customer.profile.custom.bsVaultedShopperId;
        }
    }
    return serviceHelper.callJsonService('bluesnapHostedFieldsPaymentCall', service, param);
}

/**
 * Api Key for visa checkout call
 * @returns {string | null} -  visa checkout Api Key
 */
function bluesnapVisaCheckoutApiKeyCall() {
    var service = bluesnapService.init();
    var url = instance + '/wallets/visa/apikey';
    service.setRequestMethod('POST');
    service.setURL(url);
    var result = serviceHelper.callService('bluesnapVisaCheckoutApiKeyCall', service);
    if (result) {
        result = result.headers.Location[0];
        result = result.replace(url + '/', '');
    } else {
        result = null;
    }
    return result;
}

/**
 * Api Key for visa checkout call
 * @param {Object} walletObject - BlueSnap wallet object
 * @returns {Object | null} - visa checkout response
 */
function bluesnapVisaCheckout(walletObject) {
    var service = bluesnapService.init();
    var url = instance + '/transactions';
    service.setRequestMethod('POST');
    service.setURL(url);
    walletObject.cardTransactionType = getBlueSnapPreference('CreditDebit').valueOf();
    return serviceHelper.callJsonService('bluesnapVisaCheckout', service, walletObject);
}

module.exports.bluesnapHostedFieldsPaymentCall = bluesnapHostedFieldsPaymentCall;
module.exports.bluesnapCreateHostedFieldsToken = bluesnapCreateHostedFieldsToken;
module.exports.bluesnapSEPA = bluesnapSEPA;
module.exports.bluesnapACH = bluesnapACH;
module.exports.bluesnapCreditDebit = bluesnapCreditDebit;
module.exports.bluesnapRerieveTransaction = bluesnapRerieveTransaction;
module.exports.bluesnapCreateWallet = bluesnapCreateWallet;
module.exports.bluesnapOnboardApplePay = bluesnapOnboardApplePay;
module.exports.bluesnapApplePayProccessing = bluesnapApplePayProccessing;
module.exports.bluesnapProccessingGooglrPay = bluesnapProccessingGooglrPay;
module.exports.bluesnapVisaCheckoutApiKeyCall = bluesnapVisaCheckoutApiKeyCall;
module.exports.bluesnapVisaCheckout = bluesnapVisaCheckout;
module.exports.bluesnapLatAm = bluesnapLatAm;

