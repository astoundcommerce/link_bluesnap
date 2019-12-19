'use strict';

var getBlueSnapPreference = require('*/cartridge/scripts/lib/bluesnapdata.js');
var BluesnapCOHelpers = require('~/cartridge/scripts/checkout/bluesnapCheckoutHelpers');

/**
 * Verifies the required information for billing form is provided.
 * @param {Object} req - The request object
 * @param {Object} paymentForm - the payment form
 * @param {Object} viewFormData - object contains billing form data
 * @returns {Object} an object that has error information or payment information
 */
function processForm(req, paymentForm, viewFormData) {
    var viewData = viewFormData;
    var validateFormErrors = {};
    var vaultData = [];

    switch (paymentForm.paymentMethod.value) {
    case 'BLUESNAP_CREDIT_DEBIT':
        paymentForm.bluesnapcreditcardFields.ownerFirstName.value = paymentForm.addressFields.firstName.value;
        paymentForm.bluesnapcreditcardFields.ownerLastName.value = paymentForm.addressFields.lastName.value;
        paymentForm.bluesnapcreditcardFields.ownerZip.value = paymentForm.addressFields.postalCode.value;

        var isHostedFields = getBlueSnapPreference('HostedPayment');

        if (paymentForm.bluesnapcreditcardFields.vaultCreditCard.value == 'none' || paymentForm.bluesnapcreditcardFields.vaultCreditCard.value == null) {
            validateFormErrors = isHostedFields ? [] : BluesnapCOHelpers.validateCreditCard(paymentForm);
        } else {
            paymentForm.bluesnapcreditcardFields.cvn.value = req.form.securityCode;
            var vaultCreditCard = paymentForm.bluesnapcreditcardFields.vaultCreditCard.value;
            vaultData = vaultCreditCard.split('-');
            if (vaultData.length < 2) {
                validateFormErrors[paymentForm.bluesnapcreditcardFields.vaultCreditCard.htmlName] = 'Invalid Vault Data Format';
                return {
                    fieldErrors : validateFormErrors,
                    error       : true
                };
            }        
        }

        if (Object.keys(validateFormErrors).length) {
            return {
                fieldErrors : validateFormErrors,
                error       : true
            };
        }

        viewData.paymentMethod = {
            value    : paymentForm.paymentMethod.value,
            htmlName : paymentForm.paymentMethod.value
        };

        viewData.paymentInformation = {
            paymentMethod: {
                value    : paymentForm.paymentMethod.value,
                htmlName : paymentForm.paymentMethod.value
            },
            vaultCreditCard: {
                value            : paymentForm.bluesnapcreditcardFields.vaultCreditCard.value,
                htmlName         : paymentForm.bluesnapcreditcardFields.vaultCreditCard.htmlName,
                isVaultedShopper : !!vaultData.length,
                cardType         : vaultData.length ? vaultData[0] : null,
                lastFourDigits   : vaultData.length ? vaultData[1] : null
            },
            cardType: {
                value    : isHostedFields ? 'Bluesnap Host Card' : paymentForm.bluesnapcreditcardFields.type.value,
                htmlName : isHostedFields ? '' : paymentForm.bluesnapcreditcardFields.type.htmlName
            },
            cardNumber: {
                value    : isHostedFields ? '' : paymentForm.bluesnapcreditcardFields.number.value,
                htmlName : isHostedFields ? '' : paymentForm.bluesnapcreditcardFields.number.htmlName
            },
            securityCode: {
                value    : paymentForm.bluesnapcreditcardFields.cvn.value,
                htmlName : paymentForm.bluesnapcreditcardFields.cvn.htmlName
            },
            expirationMonth: {
                value    : isHostedFields ? 0 : parseInt(paymentForm.bluesnapcreditcardFields.expiration.month.selectedOption,10),
                htmlName : isHostedFields ? '' : paymentForm.bluesnapcreditcardFields.expiration.month.htmlName
            },
            expirationYear: {
                value    : isHostedFields ? 0 : parseInt(paymentForm.bluesnapcreditcardFields.expiration.year.value, 10),
                htmlName : isHostedFields ? '' : paymentForm.bluesnapcreditcardFields.expiration.year.htmlName
            }
        };

        viewData.savePaymentInstruent = viewData.paymentInformation.vaultCreditCard.isVaultedShopper ? false : paymentForm.bluesnapcreditcardFields.storeInBluesnapVault.checked;
        break;
    case 'BLUESNAP_ACH_PAYMENT':
        if (paymentForm.BSACH.vaultACH.value == 'none' || empty(paymentForm.BSACH.vaultACH.value)) {
            validateFormErrors = BluesnapCOHelpers.validateAchPayment(paymentForm);
        } else {
            var vaultACH = paymentForm.BSACH.vaultACH.value;
            vaultData = vaultACH.split('-');
            if (vaultData.length < 3) {
                validateFormErrors[paymentForm.BSACH.vaultACH.htmlName] = 'Invalid Vault Data Format';
            }
            if (!paymentForm.BSACH.authorizeACH.valid) {
                validateFormErrors[paymentForm.BSACH.authorizeACH.htmlName] = paymentForm.BSACH.authorizeACH.error;
            }
        }

        if (Object.keys(validateFormErrors).length) {
            return {
                fieldErrors : validateFormErrors,
                error       : true
            };
        }

        viewData.paymentMethod = {
            value    : paymentForm.paymentMethod.value,
            htmlName : paymentForm.paymentMethod.htmlName
        };

        viewData.paymentInformation = {
            paymentMethod: {
                value    : paymentForm.paymentMethod.value,
                htmlName : paymentForm.paymentMethod.htmlName
            },
            vaultACH: {
                value               : paymentForm.BSACH.vaultACH.value,
                htmlName            : paymentForm.BSACH.vaultACH.htmlName,
                isVaultedShopper    : !!vaultData.length,
                accountType         : vaultData.length ? vaultData[0] : null,
                publicAccountNumber : vaultData.length ? vaultData[1] : null,
                publicRoutingNumber : vaultData.length ? vaultData[2] : null
            },
            routingNumber: {
                value    : paymentForm.BSACH.routingNumber.value,
                htmlName : paymentForm.BSACH.routingNumber.htmlName
            },
            accountNumber: {
                value    : paymentForm.BSACH.accountNumber.value,
                htmlName : paymentForm.BSACH.accountNumber.htmlName
            },
            accountType: {
                value    : paymentForm.BSACH.accountType.value,
                htmlName : paymentForm.BSACH.accountType.htmlName
            },
            companyName: {
                value    : paymentForm.BSACH.companyName.value,
                htmlName : paymentForm.BSACH.companyName.htmlName
            },
            authorize: {
                value    : paymentForm.BSACH.authorizeACH.checked,
                htmlName : paymentForm.BSACH.authorizeACH.htmlName
            }
        };
        viewData.savePaymentInstruent = viewData.paymentInformation.vaultACH.isVaultedShopper ? false : paymentForm.BSACH.storeInBluesnapVault.checked;
        break;
    case 'BLUESNAP_SEPA_PAYMENT':
        if (paymentForm.BSSEPA.vaultSEPA.value == 'none' || empty(paymentForm.BSSEPA.vaultSEPA.value)) {
            validateFormErrors = BluesnapCOHelpers.validateSepaPayment(paymentForm);
        } else {
            var vaultSEPA = paymentForm.BSSEPA.vaultSEPA.value;
            vaultData = vaultSEPA.split('-');
            if (vaultData.length < 2) {
                validateFormErrors[paymentForm.BSSEPA.vaultSEPA.htmlName] = 'Invalid Vault Data Format';
            }
            if (!paymentForm.BSSEPA.authorizeSEPA.valid) {
                validateFormErrors[paymentForm.BSSEPA.authorizeSEPA.htmlName] = paymentForm.BSSEPA.authorizeSEPA.error;
            }
        }

        if (Object.keys(validateFormErrors).length) {
            return {
                fieldErrors : validateFormErrors,
                error       : true
            };
        }

        viewData.paymentMethod = {
            value    : paymentForm.paymentMethod.value,
            htmlName : paymentForm.paymentMethod.htmlName
        };

        viewData.paymentInformation = {
            paymentMethod: {
                value    : paymentForm.paymentMethod.value,
                htmlName : paymentForm.paymentMethod.htmlName
            },
            vaultSEPA: {
                value            : paymentForm.BSSEPA.vaultSEPA.value,
                htmlName         : paymentForm.BSSEPA.vaultSEPA.htmlName,
                isVaultedShopper : !!vaultData.length,
                ibanFirstFour    : vaultData.length ? vaultData[0] : null,
                ibanLastFour     : vaultData.length ? vaultData[1] : null
            },
            iban: {
                value    : paymentForm.BSSEPA.iban.value,
                htmlName : paymentForm.BSSEPA.iban.htmlName
            }
        };
        viewData.savePaymentInstruent = viewData.paymentInformation.vaultSEPA.isVaultedShopper ? false : paymentForm.BSSEPA.storeInBluesnapVault.checked;
        break;
    case 'BLUESNAP_GOOGLE_PAY':
        viewData.paymentMethod = {
            value    : paymentForm.paymentMethod.value,
            htmlName : paymentForm.paymentMethod.htmlName
        };

        viewData.paymentInformation = {
            paymentMethod: {
                value    : paymentForm.paymentMethod.value,
                htmlName : paymentForm.paymentMethod.htmlName
            }
        };
        viewData.savePaymentInstruent = false;
        break;
    case 'BLUESNAP_APPLE_PAY':
        viewData.paymentMethod = {
            value    : paymentForm.paymentMethod.value,
            htmlName : paymentForm.paymentMethod.htmlName
        };

        viewData.paymentInformation = {
            paymentMethod: {
                value    : paymentForm.paymentMethod.value,
                htmlName : paymentForm.paymentMethod.htmlName
            }
        };
        viewData.savePaymentInstruent = false;
        break;

    case 'BLUESNAP_VISA_CHECKOUT':
        viewData.paymentMethod = {
            value    : paymentForm.paymentMethod.value,
            htmlName : paymentForm.paymentMethod.htmlName
        };

        viewData.paymentInformation = {
            paymentMethod: {
                value    : paymentForm.paymentMethod.value,
                htmlName : paymentForm.paymentMethod.htmlName
            }
        };
        viewData.savePaymentInstruent = false;
        break;
    case 'BLUESNAP_LATAM':
        paymentForm.BSlatAm.ownerFirstName.value = paymentForm.addressFields.firstName.value;
        paymentForm.BSlatAm.ownerLastName.value = paymentForm.addressFields.lastName.value;
        paymentForm.BSlatAm.ownerZip.value = paymentForm.addressFields.postalCode.value;

        if (paymentForm.BSlatAm.vaultLatamCard.value == 'none' || empty(paymentForm.BSlatAm.vaultLatamCard.value)) {
            validateFormErrors = BluesnapCOHelpers.validateLatamCreditCard(paymentForm);
        } else {
            paymentForm.BSlatAm.cvn.value = req.form.securityCode;
            paymentForm.BSlatAm.personalIdentificationNumber.value = '';
            var vaultLatamCreditCard = paymentForm.BSlatAm.vaultLatamCard.value;
            vaultData = vaultLatamCreditCard.split('-');
            if (vaultData.length < 2) {
                validateFormErrors[paymentForm.BSlatAm.vaultLatamCard.htmlName] = 'Invalid Vault Data Format';
                return {
                    fieldErrors : validateFormErrors,
                    error       : true
                };
            }
        }

        if (Object.keys(validateFormErrors).length) {
            return {
                fieldErrors : validateFormErrors,
                error       : true
            };
        }

        viewData.paymentMethod = {
            value    : paymentForm.paymentMethod.value,
            htmlName : paymentForm.paymentMethod.htmlName
        };

        viewData.paymentInformation = {
            paymentMethod: {
                value    : paymentForm.paymentMethod.value,
                htmlName : paymentForm.paymentMethod.htmlName
            },
            vaultCreditCard: {
                value            : paymentForm.BSlatAm.vaultLatamCard.value,
                htmlName         : paymentForm.BSlatAm.vaultLatamCard.htmlName,
                isVaultedShopper : !!vaultData.length,
                cardType         : vaultData.length ? vaultData[0] : null,
                lastFourDigits   : vaultData.length ? vaultData[1] : null
            },
            cardType: {
                value    : paymentForm.BSlatAm.type.value,
                htmlName : paymentForm.BSlatAm.type.htmlName
            },
            cardNumber: {
                value    : paymentForm.BSlatAm.number.value,
                htmlName : paymentForm.BSlatAm.number.htmlName
            },
            personalIdentificationNumber: {
                value    : paymentForm.BSlatAm.personalIdentificationNumber.value,
                htmlName : paymentForm.BSlatAm.personalIdentificationNumber.htmlName
            },
            securityCode: {
                value    : paymentForm.BSlatAm.cvn.value,
                htmlName : paymentForm.BSlatAm.cvn.htmlName
            },
            expirationMonth: {
                value: parseInt(
                    paymentForm.BSlatAm.expiration.month.selectedOption,
                    10
                ),
                htmlName: paymentForm.BSlatAm.expiration.month.htmlName
            },
            expirationYear: {
                value    : parseInt(paymentForm.BSlatAm.expiration.year.value, 10),
                htmlName : paymentForm.BSlatAm.expiration.year.htmlName
            }
        };
        viewData.savePaymentInstruent = viewData.paymentInformation.vaultCreditCard.isVaultedShopper ? false : paymentForm.BSlatAm.storeInBluesnapVault.checked;
        break;
    default:
        break;
    }

    return {
        error    : false,
        viewData : viewData
    };
}

/**
 * Save the Bluesnap Payment information to Vaulted Shppeer if save payment option is selected
 * @param {Object} req - The request object
 * @param {dw.order.Basket} basket - The current basket
 * @param {Object} billingData - payment information
 */
function savePaymentInformation(req, basket, billingData) {
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var Transaction = require('dw/system/Transaction');
    var Status = require('dw/system/Status');
    var PaymentModels = require('*/cartridge/scripts/models/paymentAPI');
    var vaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');

    var customer = (req.currentCustomer.raw.authenticated
        && req.currentCustomer.raw.registered)
        ? CustomerMgr.getCustomerByCustomerNumber(
            req.currentCustomer.profile.customerNo
        ) : null;

    if (!billingData.savePaymentInstruent || !customer) {
        return;
    }

    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var companyName = null;

    switch (billingData.paymentMethod.value) {
    case 'BLUESNAP_CREDIT_DEBIT':
        var creditCardInfo = new PaymentModels.CreditCardInfoModel();
        creditCardInfo.setExpirationMonthYear(billingData.paymentInformation.expirationMonth.value, billingData.paymentInformation.expirationYear.value);
        creditCardInfo.setCardNumber(billingData.paymentInformation.cardNumber.value);
        creditCardInfo.setSecurityCode(billingData.paymentInformation.securityCode.value);
        paymentSources.addCreditCardInfo(creditCardInfo);
        break;
    case 'BLUESNAP_LATAM':
        var latamCreditCardInfo = new PaymentModels.CreditCardInfoModel();
        latamCreditCardInfo.setExpirationMonthYear(billingData.paymentInformation.expirationMonth.value, billingData.paymentInformation.expirationYear.value);
        latamCreditCardInfo.setCardNumber(billingData.paymentInformation.cardNumber.value);
        latamCreditCardInfo.setSecurityCode(billingData.paymentInformation.securityCode.value);
        paymentSources.addCreditCardInfo(latamCreditCardInfo);
        break;
    case 'BLUESNAP_ACH_PAYMENT':
        var ecpDetailsModel = new PaymentModels.EcpDetailsModel();
        ecpDetailsModel.setAccountNumber(billingData.paymentInformation.accountNumber.value);
        ecpDetailsModel.setRoutingNumber(billingData.paymentInformation.routingNumber.value);
        ecpDetailsModel.setAccountType(billingData.paymentInformation.accountType.value);
        paymentSources.addEcpDetails(ecpDetailsModel);
        var accountType = billingData.paymentInformation.accountType.value;
        companyName = accountType.indexOf('CORPORATE') >= 0 ? billingData.paymentInformation.companyName.value : null;
        break;
    case 'BLUESNAP_SEPA_PAYMENT':
        var sepaModel = new PaymentModels.SepaDirectDebitInfoModel();
        sepaModel.setIban(billingData.paymentInformation.iban.value);
        paymentSources.addSepaDirectDebitInfo(sepaModel);
        break;
    default:
        break;
    }

    var vaultedShopper = new PaymentModels.VaultedShopperModel();
    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);
    if (companyName) {
        vaultedShopper.setCompanyName(companyName);
    }
    vaultedShopper.setSoftDescriptor('Astound ICDLP');

    if (customer.profile.custom.bsVaultedShopperId) {
        vaultHelper.updateVaultedShopper(customer.profile.custom.bsVaultedShopperId, vaultedShopper.getData());
    } else {
        var result = vaultHelper.createVaultedShopper(vaultedShopper.getData());
        if (result.status == Status.OK) {
            Transaction.wrap(function () {
                customer.profile.custom.bsVaultedShopperId = result.getDetail('object').vaultedShopperId;
            });
        }
    }
}

exports.processForm = processForm;
exports.savePaymentInformation = savePaymentInformation;
