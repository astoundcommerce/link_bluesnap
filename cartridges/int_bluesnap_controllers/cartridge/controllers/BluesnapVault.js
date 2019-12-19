'use strict';

/**
 * Controller that displays credit card and other payment information and
 * lets the user change it.
 *
 * @module controllers/BluesnapVault
 */

var Resource = require('dw/web/Resource');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');
var CSRFProtection = require('dw/web/CSRFProtection');
var Status = require('dw/system/Status');

var vaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');
var PaymentModels = require('*/cartridge/scripts/models/paymentAPI');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');

/**
 * 
 * @param {Object} shopperObject - shopper object
 * @returns {Object} - Vaulted Shopper Payment Instruments model
 */
function _getVaultedPaymentInstruments(shopperObject) {
    var vaultedShopper;
    var vaultedShopperModel;

    if (!shopperObject) {
        vaultedShopper = vaultHelper.getVaultedShopper(customer.profile.custom.bsVaultedShopperId);
    } else {
        vaultedShopper = shopperObject;
    }

    vaultedShopperModel = new PaymentModels.VaultedShopperModel(vaultedShopper);

    return {
        creditCardsList : vaultedShopperModel.getCreditCardsList(),
        ecpDetailsList  : vaultedShopperModel.getEcpDetailsList(),
        sepaDirectList  : vaultedShopperModel.getSepaDirectList()
    };

}

/**
 * Display a list of customer payment soureces stored in BlueSnap Vault.
 */
function list() {
    var vaultedPaymentInstruments;

    // 1. Get the list of saved payment sources from Bluesnap

    if (!empty(customer.profile.custom.bsVaultedShopperId)) {
        vaultedPaymentInstruments = _getVaultedPaymentInstruments(null);
        app.getView({
            vaultedShopper : true,
            vaultMessage   : '',
            errorMessage   : null,
            creditCards    : vaultedPaymentInstruments.creditCardsList,
            ecpDetails     : vaultedPaymentInstruments.ecpDetailsList,
            sepaDirect     : vaultedPaymentInstruments.sepaDirectList
        }).render('paymentsourceslist');
    } else {
        app.getView({
            vaultedShopper : true,
            vaultMessage   : '',
            errorMessage   : null,
            creditCards    : null,
            ecpDetails     : null,
            sepaDirect     : null
        }).render('paymentsourceslist');
    }

    return;
}

/**
 * Clears the Payments form and renders the payments template.
 */
function add() {
    if (!request.httpParameterMap.formerror.submitted) {
        app.getForm('vaultACH').clear();
        app.getForm('vaultCreditCard').clear();
        app.getForm('vaultLatAmCreditCard').clear();
        app.getForm('vaultSEPA').clear();
    }

    app.getView({
        Action        : 'add',
        activeForm    : request.httpParameterMap.activeform.submitted ? request.httpParameterMap.activeform.stringValue : 'vaultCreditCard',
        csrfTokenName : CSRFProtection.getTokenName(),
        csrfToken     : CSRFProtection.generateToken()
    }).render('addvaultpayment');
}

/**
 * Fetch data from Credit Card Form
 * @param {string} ccType - type of Credit Card
 * @returns {Object} - Vaulted Shopper Credit Card model
 */
function _getCCFormData(ccType) {
    var creditCardInfo = new PaymentModels.CreditCardInfoModel();
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var vaultedShopper = new PaymentModels.VaultedShopperModel();
    var form;

    if (ccType == 'LATAM') {
        form = app.getForm('vaultLatAmCreditCard.data');
        vaultedShopper.setPersonalIdentificationNumber(form.object.personalIdentificationNumber.value);
    } else {
        form = app.getForm('vaultCreditCard.data');
    }

    creditCardInfo.setExpirationMonthYear(form.object.expiration.month.value, form.object.expiration.year.value);
    creditCardInfo.setCardNumber(form.object.number.value);
    creditCardInfo.setSecurityCode(form.object.cvn.value);

    paymentSources.addCreditCardInfo(creditCardInfo);
    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);
    // vaultedShopper.setSoftDescriptor('Astound ICDLP');

    return vaultedShopper.getData();
}

/**
 * Fetch data from ACH Form
 * @returns {Object} - Vaulted Shopper ACH model
 */
function _getACHFormData() {
    var ecpDetailsModel = new PaymentModels.EcpDetailsModel();
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var vaultedShopper = new PaymentModels.VaultedShopperModel();

    var form = app.getForm('vaultACH.data');

    ecpDetailsModel.setAccountNumber(form.object.accountNumber.value);
    ecpDetailsModel.setRoutingNumber(form.object.routingNumber.value);
    ecpDetailsModel.setAccountType(form.object.accountType.value);

    paymentSources.addEcpDetails(ecpDetailsModel);

    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);
    var accountType = form.object.accountType.value;
    if (accountType.indexOf('CORPORATE') >= 0) {
        vaultedShopper.setCompanyName(form.object.companyName.value);
    }

    vaultedShopper.setSoftDescriptor('Astound ICDLP');

    return vaultedShopper.getData();
}

/**
 * Fetch data from SEPA Form
 * @returns {Object} - Vaulted Shopper SEPA model
 */
function _getSepaFormData() {
    var sepaModel = new PaymentModels.SepaDirectDebitInfoModel();
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var vaultedShopper = new PaymentModels.VaultedShopperModel();

    var form = app.getForm('vaultSEPA.data');

    sepaModel.setIban(form.object.iban.value);

    paymentSources.addSepaDirectDebitInfo(sepaModel);

    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);
    vaultedShopper.setSoftDescriptor('Astound ICDLP');

    return vaultedShopper.getData();
}

/**
 * Create/update Vaulted Shopper
 * @param {Object} shopperData - Vaulted Shopper data
 * @param {dw.web.Form} formId - form ID
 * @param {string} action - action
 */
function _createOrUpdateVaultPayment(shopperData, formId, action) {
    var result = null;

    if (customer.profile.custom.bsVaultedShopperId) {
        result = vaultHelper.updateVaultedShopper(customer.profile.custom.bsVaultedShopperId, shopperData);
    } else {
        result = vaultHelper.createVaultedShopper(shopperData);
        if (result.status == Status.OK) {
            Transaction.wrap(function () {
                customer.profile.custom.bsVaultedShopperId = result.getDetail('object').vaultedShopperId;
            });
        }
    }

    if (result.status == Status.OK) {
        response.redirect(URLUtils.https('BluesnapVault-List'));
    } else {
        /**
         * By default we show the messages from `result.getDetail('bluesnapPublicErrorMessages')` array.
         * If you need customized error handling, get the error codes array from `result.getDetail('bluesnapErrorCodes')`
         * and handle it as according to your requirements.
         * @see description of `_getBluesnapErrors()` method in int_bluesnap/cartridge/scripts/service/serviceHelper.js
         */
        app.getView({
            Action        : action,
            errorMessages : result.getDetail('bluesnapPublicErrorMessages') || [Resource.msg('bluesnapapi.publicerror.general', 'bluesnap', null)],
            activeForm    : formId,
            csrfTokenName : CSRFProtection.getTokenName(),
            csrfToken     : CSRFProtection.generateToken()
        }).render('addvaultpayment');
    }  
}

/**
 * CreditCard Form
 */
function handleCreditCard() {
    var bsCreditCardForm = app.getForm('vaultCreditCard');

    bsCreditCardForm.handleAction({
        create: function () {
            var shopperData = _getCCFormData('CC');
            _createOrUpdateVaultPayment(shopperData, bsCreditCardForm.object.formId, 'add');
        },
        cancel: function () {
            response.redirect(URLUtils.https('BluesnapVault-List'));
        },
        error: function () {
            response.redirect(URLUtils.https('BluesnapVault-Add', 'formerror', 'true', 'activeform', bsCreditCardForm.object.formId));
        }
    });
}

/**
 * LatAm CreditCard Form
 */
function handleLatAmCreditCard() {
    var latAmCreditCardForm = app.getForm('vaultLatAmCreditCard');

    latAmCreditCardForm.handleAction({
        create: function () {
            var shopperData = _getCCFormData('LATAM');
            _createOrUpdateVaultPayment(shopperData, latAmCreditCardForm.object.formId, 'add');
        },
        cancel: function () {
            response.redirect(URLUtils.https('BluesnapVault-List'));
        },
        error: function () {
            response.redirect(URLUtils.https('BluesnapVault-Add', 'formerror', 'true', 'activeform', latAmCreditCardForm.object.formId));
        }
    });
}

/**
 * ACH Form
 */
function handleACH() {
    var bsACHForm = app.getForm('vaultACH');

    bsACHForm.handleAction({
        create: function () {
            var shopperData = _getACHFormData();
            _createOrUpdateVaultPayment(shopperData, bsACHForm.object.formId, 'add');
        },
        cancel: function () {
            response.redirect(URLUtils.https('BluesnapVault-List'));
        },
        error: function () {
            response.redirect(URLUtils.https('BluesnapVault-Add', 'formerror', 'true', 'activeform', bsACHForm.object.formId));
        }
    });
}

/**
 * SEPA Form
 */
function handleSEPA() {
    var bsSepaForm = app.getForm('vaultSEPA');

    bsSepaForm.handleAction({
        create: function () {
            var shopperData = _getSepaFormData();
            _createOrUpdateVaultPayment(shopperData, bsSepaForm.object.formId, 'add');
        },
        cancel: function () {
            response.redirect(URLUtils.https('BluesnapVault-List'));
        },
        error: function () {
            response.redirect(URLUtils.https('BluesnapVault-Add', 'formerror', 'true', 'activeform', bsSepaForm.object.formId));
        }
    });
}
/**
 * Delete payment
 */
function deletePayment() {
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var vaultedShopper = new PaymentModels.VaultedShopperModel();
    var updateResult;
    var vaultedPaymentInstruments;
    var vaultMessage = '';
    var errorMessage = null;

    switch (request.httpParameterMap.type.stringValue) {
    case 'card':
        var creditCardInfo = new PaymentModels.CreditCardInfoModel();
        var lastFour = request.httpParameterMap.lastFour.stringValue;
        var cardType = request.httpParameterMap.cardType.stringValue;

        creditCardInfo.setCardType(cardType);
        creditCardInfo.setLastFourDigits(lastFour);
        creditCardInfo.setDeleteStatus();
        paymentSources.addCreditCardInfo(creditCardInfo);
        break;

    case 'ecp':
        var ecpDetailsModel = new PaymentModels.EcpDetailsModel();

        var publicAccountNumber = request.httpParameterMap.publicAccountNumber.stringValue;
        var publicRoutingNumber = request.httpParameterMap.publicRoutingNumber.stringValue;
        var accountType = request.httpParameterMap.accountType.stringValue;

        ecpDetailsModel.setPublicAccountNumber(publicAccountNumber);
        ecpDetailsModel.setPublicRoutingNumber(publicRoutingNumber);
        ecpDetailsModel.setAccountType(accountType);
        ecpDetailsModel.setDeleteStatus();

        paymentSources.addEcpDetails(ecpDetailsModel);
        break;

    case 'sepa':
        var sepaModel = new PaymentModels.SepaDirectDebitInfoModel();
        var ibanFirstFour = request.httpParameterMap.ibanFirstFour.stringValue;
        var ibanLastFour = request.httpParameterMap.ibanLastFour.stringValue;

        sepaModel.setIbanFirstFour(ibanFirstFour);
        sepaModel.setIbanLastFour(ibanLastFour);
        sepaModel.setDeleteStatus();

        paymentSources.addSepaDirectDebitInfo(sepaModel);
        break;
    }

    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);

    updateResult = vaultHelper.updateVaultedShopper(customer.profile.custom.bsVaultedShopperId, vaultedShopper.getData());

    if (updateResult.status == Status.OK) {
        vaultMessage = Resource.msg('myaccount.vault.success', 'bluesnap', null);
        vaultedPaymentInstruments = _getVaultedPaymentInstruments(updateResult.getDetail('object'));
    } else {
        vaultedPaymentInstruments = _getVaultedPaymentInstruments(null);
        errorMessage = Resource.msg('myaccount.vault.generalerror', 'bluesnap', null);
    }

    app.getView({
        vaultedShopper : true,
        vaultMessage   : vaultMessage,
        errorMessage   : errorMessage,
        creditCards    : vaultedPaymentInstruments.creditCardsList,
        ecpDetails     : vaultedPaymentInstruments.ecpDetailsList,
        sepaDirect     : vaultedPaymentInstruments.sepaDirectList
    }).render('paymentsourceslist');

    return;
    // response.redirect(URLUtils.https('BluesnapVault-List'));
}

/**
 * Vaulted Shopper payments selector
 */
function vaultPaymentsSelector() {
    var type = request.httpParameterMap.isParameterSubmitted('type') ? request.httpParameterMap.type.stringValue : '';
    var paymentsList = vaultHelper.getVaultedPaymentsList(customer, type);
    app.getView({
        paymentSourcesList: paymentsList
    }).render('vaultpaymentselector');
}

exports.List = guard.ensure(['https', 'get', 'loggedIn'], list);

exports.Add = guard.ensure(['https', 'get', 'loggedIn'], add);
exports.Delete = guard.ensure(['https', 'get', 'loggedIn'], deletePayment);

exports.HandleCreditCard = guard.ensure(['post', 'https', 'loggedIn', 'csrf'], handleCreditCard);
exports.HandleLatAmCreditCard = guard.ensure(['post', 'https', 'loggedIn', 'csrf'], handleLatAmCreditCard);
exports.HandleACH = guard.ensure(['post', 'https', 'loggedIn', 'csrf'], handleACH);
exports.HandleSEPA = guard.ensure(['post', 'https', 'loggedIn', 'csrf'], handleSEPA);

exports.VaultPaymentsSelector = guard.ensure(['https', 'get', 'loggedIn'], vaultPaymentsSelector);
