'use strict';

/**
 * Helper to handle BlueSnap payment methods in hook
 */
var getBlueSnapPreference = require('*/cartridge/scripts/lib/bluesnapdata.js');
var paymentsApi = require('*/cartridge/scripts/api/payments');

/**
 *
 * @param {dw.web.Form} ACHForm - customer form
 * @param {dw.order.Basket} cart - basket
 * @returns {Object|null} - BlueSnap response
 */
function paymentACH(ACHForm, cart) {
    var account = {};

    account.authorize = ACHForm.getValue('authorizeACH');
    account.companyName = ACHForm.getValue('companyName');

    if (customer.authenticated) {
        var vaultAchData = ACHForm.getValue('vaultACH');

        if (empty(vaultAchData) || vaultAchData == 'none') {
            account.accountNumber = ACHForm.getValue('accountNumber');
            account.routingNumber = ACHForm.getValue('routingNumber');
            account.accountType = ACHForm.getValue('accountType');
        } else {
            account.vaultedShopperId = customer.getProfile().custom.bsVaultedShopperId;
            // Vaulted ACH. We need are account type, public account number and public routing number
            // Shoud be a string accountType-publicAccountNumber-publicRoutingNumber, example: 'CONSUMER_CHECKING-99992-75150'
            var achData = vaultAchData.split('-');
            account.accountType = achData[0];
            account.publicAccountNumber = achData[1];
            account.publicRoutingNumber = achData[2];
        }
    } else {
        account.accountNumber = ACHForm.getValue('accountNumber');
        account.routingNumber = ACHForm.getValue('routingNumber');
        account.accountType = ACHForm.getValue('accountType');
    }

    return paymentsApi.bluesnapACH(cart, account);
}

/**
 * @description handles both flows simple credit card form and hosted credit card form
 * @param {dw.web.Form} creditCardForm - Credit Card form
 * @param {string} hostedDataToken - token for hosted fields
 * @param {Basket} cart - basket
 * @returns {Object|null} - BlueSnap response
 */
function paymentCreditDebit(creditCardForm, hostedDataToken, cart) {
    var result = null;
    var creditCard = {};

    var vaultCardData = creditCardForm.getValue('vaultCreditCard');
    if (vaultCardData == 'none' || vaultCardData == null) {
        if (getBlueSnapPreference('HostedPayment')) {
            var hostedData =
                {
                    cardHolderInfo: {
                        firstName : creditCardForm.get('ownerFirstName').value(),
                        lastName  : creditCardForm.get('ownerLastName').value(),
                        zip       : creditCardForm.get('ownerZip').value(),
                        email     : cart.getCustomerEmail()
                    },
                    pfToken: hostedDataToken
                };
            result = paymentsApi.bluesnapHostedFieldsPaymentCall(cart, hostedData, creditCardForm.getValue('storeInBluesnapVault'));
        } else {
            creditCard.cardNumber = creditCardForm.getValue('number');
            creditCard.securityCode = creditCardForm.getValue('cvn');
            creditCard.expirationMonth = creditCardForm.getValue('expiration.month');
            creditCard.expirationYear = creditCardForm.getValue('expiration.year');
            creditCard.ownerInfo = {
                firstName : creditCardForm.getValue('ownerFirstName'),
                lastName  : creditCardForm.getValue('ownerLastName'),
                zip       : creditCardForm.getValue('ownerZip'),
                email     : cart.getCustomerEmail()
            };
        }
    } else {
        var cardData = vaultCardData.split('-'); // shoud be a string, example: 'VISA-3462', or 'MASTERCARD-9824'
        creditCard.cardType = cardData[0];
        creditCard.cardLastFourDigits = cardData[1];
        creditCard.securityCode = creditCardForm.getValue('cvn');
        creditCard.ownerInfo = {
            firstName : creditCardForm.getValue('ownerFirstName'),
            lastName  : creditCardForm.getValue('ownerLastName'),
            zip       : creditCardForm.getValue('ownerZip'),
            email     : cart.getCustomerEmail()
        };
    }
    result = result != null ? result : paymentsApi.bluesnapCreditDebit(cart, creditCard, creditCardForm.getValue('storeInBluesnapVault'));
    return result;
}

/**
 * @description handles LatAm simple credit card form
 * @param {dw.web.Form} creditCardForm - Credit Card form
 * @param {string} hostedDataToken - token for hosted fields
 * @param {dw.order.Basket} cart - basket
 * @returns {Object|null} - BlueSnap response
 */
function paymentLatAM(creditCardForm, hostedDataToken, cart) {
    var result = null;
    var creditCard = {};
    var cardHolder = null;
    var vaultCardData = creditCardForm.getValue('vaultLatamCard');

    if (empty(vaultCardData) || vaultCardData == 'none') {
        creditCard.cardNumber = creditCardForm.getValue('number');
        creditCard.securityCode = creditCardForm.getValue('cvn');
        creditCard.expirationMonth = creditCardForm.getValue('expiration.month');
        creditCard.expirationYear = creditCardForm.getValue('expiration.year');

        cardHolder = {
            firstName                    : creditCardForm.getValue('ownerFirstName'),
            lastName                     : creditCardForm.getValue('ownerLastName'),
            zip                          : creditCardForm.getValue('ownerZip'),
            personalIdentificationNumber : creditCardForm.get('personalIdentificationNumber').value(),
            email                        : cart.getCustomerEmail()
        };
    } else {
        // wow, we've got a vaulted credit card! all we need is card type, last four digits and cvn
        var cardData = vaultCardData.split('-'); // shoud be a string, example: 'VISA-3462', or 'MASTERCARD-9824'
        creditCard.cardType = cardData[0];
        creditCard.cardLastFourDigits = cardData[1];
        creditCard.securityCode = creditCardForm.getValue('cvn');
    }
    result = paymentsApi.bluesnapLatAm(cart, creditCard, cardHolder, creditCardForm.getValue('storeInBluesnapVault'));


    return result;
}

/**
 * Handle Visa Checkuot payment
 * @param {dw.order.Order} order - Order
 * @param {string} walletId - wallet ID
 * @param {string} orderNo - order number
 * @returns {Object|null} - API BlueSnap response
 */
function paymentVisaCheckout(order, walletId, orderNo) {
    var wallet = {
        merchantTransactionId : orderNo,
        walletId              : walletId,
        amount                : order.getTotalGrossPrice().getValue(),
        currency              : order.getTotalGrossPrice().getCurrencyCode()
    };
    return paymentsApi.bluesnapVisaCheckout(wallet);
}

/**
 * Handle SEPA Checkuot payment
 * @param {dw.web.Form} SEPAForm - SEPA customer form
 * @param {dw.order.Basket} cart - basket
 * @returns {Object} - API BlueSnap response
 */
function paymentSEPA(SEPAForm, cart) {
    var sepaDirectDebitTransaction = {};
    if (customer.authenticated) {
        var vaultSepaData = SEPAForm.getValue('vaultSEPA');
        if (empty(vaultSepaData) || vaultSepaData == 'none') {
            sepaDirectDebitTransaction.iban = SEPAForm.get('iban').value();
        } else {
            sepaDirectDebitTransaction.vaultedShopperId = customer.getProfile().custom.bsVaultedShopperId;
            // Vaulted SEPA! We need are first four digits and last four digits of IBAN
            // Shoud be a string ibanFirstFour-ibanLastFour, example: '9992-7150'
            var sepaData = vaultSepaData.split('-');
            sepaDirectDebitTransaction.ibanFirstFour = sepaData[0];
            sepaDirectDebitTransaction.ibanLastFour = sepaData[1];
        }
    } else {
        sepaDirectDebitTransaction.iban = SEPAForm.get('iban').value();
    }
    return paymentsApi.bluesnapSEPA(cart, sepaDirectDebitTransaction);
}

/**
 * Handle ApplePay payment
 * @param {Object} requestObject - request data object
 * @param {string} OrderNo - order number
 * @returns {Object|null} - API BlueSnap response
 */
function bluesnapApplePayProccessing(requestObject, OrderNo) {
    var obj = requestObject;
    obj.merchantTransactionId = OrderNo;
    return paymentsApi.bluesnapApplePayProccessing(obj);
}

/**
 * Save ACH payment instrument to vault shopper
 * @param {Object} bsResponse - bsResponse
 * @param {dw.web.Form} ACHForm - ACH customer form
 * @returns {boolean} - succesful status
 */
function saveACHToVault(bsResponse, ACHForm) {
    var result;
    var success = false;

    var PaymentModels = require('*/cartridge/scripts/models/paymentAPI');
    var vaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');

    var Transaction = require('dw/system/Transaction');
    var Status = require('dw/system/Status');

    if (bsResponse.processingInfo != 'FAIL') {
        var ecpDetailsModel = new PaymentModels.EcpDetailsModel();
        var paymentSources = new PaymentModels.PaymentSourcesModel();
        var vaultShopper = new PaymentModels.VaultedShopperModel();

        ecpDetailsModel.setAccountNumber(ACHForm.getValue('accountNumber'));
        ecpDetailsModel.setRoutingNumber(ACHForm.getValue('routingNumber'));
        ecpDetailsModel.setAccountType(ACHForm.getValue('accountType'));

        paymentSources.addEcpDetails(ecpDetailsModel);

        vaultShopper.setPaymentSources(paymentSources);
        vaultShopper.setFirstName(customer.profile.firstName);
        vaultShopper.setLastName(customer.profile.lastName);

        if (customer.profile.custom.bsVaultedShopperId) {
            result = vaultHelper.updateVaultedShopper(customer.profile.custom.bsVaultedShopperId, vaultShopper.getData());
        } else {
            result = vaultHelper.createVaultedShopper(vaultShopper.getData());
            if (result.status == Status.OK) {
                Transaction.wrap(function () {
                    customer.profile.custom.bsVaultedShopperId = result.getDetail('object').vaultedShopperId;
                });
            }
        }
        success = (result.status == Status.OK);
    }

    return success;
}

/**
 * Save ACH payment instrument to vault shopper
 * @param {Object} bsResponse - bsResponse
 * @param {dw.web.Form} SEPAForm - SEPA customer form
 * @returns {boolean} - succesful status
 */
function saveSEPAToVault(bsResponse, SEPAForm) {
    var result;
    var success = false;

    var PaymentModels = require('*/cartridge/scripts/models/paymentAPI');
    var vaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');

    var Transaction = require('dw/system/Transaction');
    var Status = require('dw/system/Status');

    if (bsResponse.processingInfo != 'FAIL') {
        var sepaModel = new PaymentModels.SepaDirectDebitInfoModel();
        var paymentSources = new PaymentModels.PaymentSourcesModel();
        var vaultShopper = new PaymentModels.VaultedShopperModel();

        sepaModel.setIban(SEPAForm.getValue('iban'));
        paymentSources.addSepaDirectDebitInfo(sepaModel);

        vaultShopper.setPaymentSources(paymentSources);
        vaultShopper.setFirstName(customer.profile.firstName);
        vaultShopper.setLastName(customer.profile.lastName);

        if (customer.profile.custom.bsVaultedShopperId) {
            result = vaultHelper.updateVaultedShopper(customer.profile.custom.bsVaultedShopperId, vaultShopper.getData());
        } else {
            result = vaultHelper.createVaultedShopper(vaultShopper.getData());
            if (result.status == Status.OK) {
                Transaction.wrap(function () {
                    customer.profile.custom.bsVaultedShopperId = result.getDetail('object').vaultedShopperId;
                });
            }
        }
        success = (result.status == Status.OK);
    }

    return success;
}

module.exports.paymentSEPA = paymentSEPA;
module.exports.paymentACH = paymentACH;
module.exports.paymentCreditDebit = paymentCreditDebit;
module.exports.paymentVisaCheckout = paymentVisaCheckout;
module.exports.paymentLatAM = paymentLatAM;
module.exports.bluesnapApplePayProccessing = bluesnapApplePayProccessing;
module.exports.saveSEPAToVault = saveSEPAToVault;
module.exports.saveACHToVault = saveACHToVault;
