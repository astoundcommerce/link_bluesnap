'use strict';

var server = require('server');

var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

var Transaction = require('dw/system/Transaction');
var Status = require('dw/system/Status');

var vaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');
var PaymentModels = require('*/cartridge/scripts/models/paymentAPI');

/**
 * Fetch data from Credit Card Form
 * @param {dw.web.Form} form - Credit Care Form
 * @returns {Object} - Vaulted Shopper Credit Card model
 */
function _getCCFormData(form) {
    var creditCardInfo = new PaymentModels.CreditCardInfoModel();
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var vaultedShopper = new PaymentModels.VaultedShopperModel();

    creditCardInfo.setExpirationMonthYear(form.expiration.month.value, form.expiration.year.value);
    creditCardInfo.setCardNumber(form.number.value);
    if (!empty(form.cvn.value)) {
        creditCardInfo.setSecurityCode(form.cvn.value);
    }

    paymentSources.addCreditCardInfo(creditCardInfo);
    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);
    vaultedShopper.setSoftDescriptor('Astound ICDLP');

    return vaultedShopper.getData();
}

/**
 * Fetch data from ACH Form
 * @param {dw.web.Form} form - ACH Form
 * @returns {Object} - Vaulted Shopper ACH model
 */
function _getACHFormData() {
    var ecpDetailsModel = new PaymentModels.EcpDetailsModel();
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var vaultedShopper = new PaymentModels.VaultedShopperModel();

    var form = server.forms.getForm('bluesnapPayment').BSACH;

    ecpDetailsModel.setAccountNumber(form.accountNumber.value);
    ecpDetailsModel.setRoutingNumber(form.routingNumber.value);
    ecpDetailsModel.setAccountType(form.accountType.value);

    paymentSources.addEcpDetails(ecpDetailsModel);

    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);
    var accountType = form.accountType.value;
    if (accountType.indexOf('CORPORATE') >= 0) {
        vaultedShopper.setCompanyName(form.companyName.value);
    }
    vaultedShopper.setSoftDescriptor('Astound ICDLP');

    return vaultedShopper.getData();
}

/**
 * Fetch data from SEPA Form
 * @param {dw.web.Form} form - SEPA Form
 * @returns {Object} - Vaulted Shopper SEPA model
 */
function _getSepaFormData() {
    var sepaModel = new PaymentModels.SepaDirectDebitInfoModel();
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    var vaultedShopper = new PaymentModels.VaultedShopperModel();

    var form = server.forms.getForm('bluesnapPayment').BSSEPA;

    sepaModel.setIban(form.iban.value);

    paymentSources.addSepaDirectDebitInfo(sepaModel);

    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);
    vaultedShopper.setSoftDescriptor('Astound ICDLP');

    return vaultedShopper.getData();
}

/**
 * Checks if a credit card is valid or not
 * @param {Object} form - form object
 * @returns {boolean} a boolean representing card validation
 */
function verifyCard(form) {
    var collections = require('*/cartridge/scripts/util/collections');
    var Resource = require('dw/web/Resource');
    var PaymentMgr = require('dw/order/PaymentMgr');
    var PaymentStatusCodes = require('dw/order/PaymentStatusCodes');

    var paymentCard = PaymentMgr.getPaymentCard(form.type.value);
    var error = false;
    var creditCardStatus;
    var cardNumber = form.number.value;
    cardNumber = cardNumber.replace(/\s/g, '');

    if (paymentCard) {
        creditCardStatus = paymentCard.verify(
            form.expiration.month.value,
            form.expiration.year.value,
            cardNumber
        );
    } else {
        form.number.valid = false;
        form.number.error =
            Resource.msg('error.message.creditnumber.invalid', 'forms', null);
        error = true;
    }

    if (creditCardStatus && creditCardStatus.error) {
        collections.forEach(creditCardStatus.items, function (item) {
            switch (item.code) {
            case PaymentStatusCodes.CREDITCARD_INVALID_CARD_NUMBER:
                form.number.valid = false;
                form.number.error =
                        Resource.msg('error.message.creditnumber.invalid', 'forms', null);
                error = true;
                break;

            case PaymentStatusCodes.CREDITCARD_INVALID_EXPIRATION_DATE:
                form.expiration.month.valid = false;
                form.expiration.year.error =
                        Resource.msg('error.message.creditexpiration.expired', 'forms', null);
                form.expiration.mont.valid = false;
                error = true;
                break;
            default:
                error = true;
            }
        });
    }
    return error;
}

/**
 * Creates a list of expiration years from the current year
 * @returns {dw.util.List} - a plain list of expiration years from current year
 */
function getExpirationYears() {
    var currentYear = new Date().getFullYear();
    var creditCardExpirationYears = [];

    for (var i = 0; i < 10; i++) {
        creditCardExpirationYears.push((currentYear + i).toString());
    }

    return creditCardExpirationYears;
}

server.get('List', userLoggedIn.validateLoggedIn, consentTracking.consent, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var VaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');
    var vaultedShopper = null;

    var customer = CustomerMgr.getCustomerByCustomerNumber(req.currentCustomer.profile.customerNo);

    if (!empty(customer.profile.custom.bsVaultedShopperId)) {
        var shopper = VaultHelper.getVaultedShopper(customer.profile.custom.bsVaultedShopperId);
        if (shopper) {
            vaultedShopper = {
                firstName   : shopper.firstName || '',
                lastName    : shopper.lastName || '',
                creditCards : shopper.paymentSources.hasOwnProperty('creditCardInfo') ? shopper.paymentSources.creditCardInfo : [],
                ecp         : shopper.paymentSources.hasOwnProperty('ecpDetails') ? shopper.paymentSources.ecpDetails : [],
                sepa        : shopper.paymentSources.hasOwnProperty('sepaDirectDebitInfo') ? shopper.paymentSources.sepaDirectDebitInfo : []
            };
        }
    }

    res.render('account/payment/bluesnapVaultPayment', {
        vaultedShopper : vaultedShopper,
        deleteUrl      : URLUtils.url('BluesnapVault-DeletePayment').toString(),
        updateUrl      : URLUtils.url('BluesnapVault-UpdatePayment').toString(),
        breadcrumbs    : [
            {
                htmlValue : Resource.msg('global.home', 'common', null),
                url       : URLUtils.home().toString()
            },
            {
                htmlValue : Resource.msg('page.title.myaccount', 'account', null),
                url       : URLUtils.url('Account-Show').toString()
            }
        ]
    });
    next();
});

server.get(
    'AddPayment',
    csrfProtection.generateToken,
    consentTracking.consent,
    userLoggedIn.validateLoggedIn,
    function (req, res, next) {
        var URLUtils = require('dw/web/URLUtils');
        var Resource = require('dw/web/Resource');

        var creditCardExpirationYears = getExpirationYears();
        var paymentForm = server.forms.getForm('bluesnapPayment');
        paymentForm.clear();
        var months = paymentForm.bluesnapcreditcardFields.expiration.month.options;
        for (var j = 0, k = months.length; j < k; j++) {
            months[j].selected = false;
        }

        res.render('account/payment/addBluesnapPayment', {
            paymentForm     : paymentForm,
            expirationYears : creditCardExpirationYears,
            breadcrumbs     : [
                {
                    htmlValue : Resource.msg('global.home', 'common', null),
                    url       : URLUtils.home().toString()
                },
                {
                    htmlValue : Resource.msg('page.title.myaccount', 'account', null),
                    url       : URLUtils.url('Account-Show').toString()
                },
                {
                    htmlValue : Resource.msg('page.heading.payments', 'payment', null),
                    url       : URLUtils.url('BluesnapVault-List').toString()
                }
            ]
        });

        next();
    }
);

server.post('SavePayment', csrfProtection.validateAjaxRequest, function (req, res, next) {
    var formErrors = require('*/cartridge/scripts/formErrors');
    var URLUtils = require('dw/web/URLUtils');

    var paymentForm = server.forms.getForm('bluesnapPayment');
    var paymentMethod = paymentForm.paymentMethod.value;
    var isValidCard = true;
    switch (paymentMethod) {
    case 'BLUESNAP_CREDIT_DEBIT':
        isValidCard = !verifyCard(paymentForm.bluesnapcreditcardFields);
        break;
    case 'BLUESNAP_LATAM':
        isValidCard = !verifyCard(paymentForm.BSlatAm);
        break;
    default:
        isValidCard = true;
        break;
    }

    if (paymentForm.valid && isValidCard) {
        this.on('route:BeforeComplete', function (req, res) {
            var shopperData = null;
            var paynentForm = server.forms.getForm('bluesnapPayment');

            switch (paymentMethod) {
            case 'BLUESNAP_CREDIT_DEBIT':
                shopperData = _getCCFormData(paynentForm.bluesnapcreditcardFields);
                break;
            case 'BLUESNAP_ACH_PAYMENT':
                shopperData = _getACHFormData();
                break;
            case 'BLUESNAP_SEPA_PAYMENT':
                shopperData = _getSepaFormData();
                break;
            case 'BLUESNAP_LATAM':
                shopperData = _getCCFormData(paynentForm.BSlatAm);
                shopperData.personalIdentificationNumber = paynentForm.BSlatAm.personalIdentificationNumber.value;
                break;
            default:
                break;
            }

            if (customer.profile.custom.bsVaultedShopperId) {
                vaultHelper.updateVaultedShopper(customer.profile.custom.bsVaultedShopperId, shopperData);
            } else {
                var result = vaultHelper.createVaultedShopper(shopperData);
                if (result.status == Status.OK) {
                    Transaction.wrap(function () {
                        customer.profile.custom.bsVaultedShopperId = result.getDetail('object').vaultedShopperId;
                    });
                }
            }

            res.json({
                success     : true,
                redirectUrl : URLUtils.url('BluesnapVault-List').toString()
            });
        });
    } else {
        res.json({
            success : false,
            fields  : formErrors.getFormErrors(paymentForm)
        });
    }
    return next();
});

server.get('DeletePayment', userLoggedIn.validateLoggedInAjax, function (req, res, next) {
    var data = res.getViewData();
    if (data && !data.loggedin) {
        res.json();
        return next();
    }

    var Resource = require('dw/web/Resource');
    var uuid = req.querystring.UUID;
    var vaultedShopper = new PaymentModels.VaultedShopperModel();
    var paymentSources = new PaymentModels.PaymentSourcesModel();
    switch (req.querystring.type) {
    case 'card':
        var creditCardInfo = new PaymentModels.CreditCardInfoModel();
        var lastFour = req.querystring.lastFour;
        var cardType = req.querystring.cardType;

        creditCardInfo.setCardType(cardType);
        creditCardInfo.setLastFourDigits(lastFour);
        creditCardInfo.setDeleteStatus();
        paymentSources.addCreditCardInfo(creditCardInfo);
        break;
    case 'ecp':
        var ecpDetailsModel = new PaymentModels.EcpDetailsModel();
        var publicAccountNumber = req.querystring.publicAccountNumber;
        var publicRoutingNumber = req.querystring.publicRoutingNumber;
        var accountType = req.querystring.accountType;

        ecpDetailsModel.setPublicAccountNumber(publicAccountNumber);
        ecpDetailsModel.setPublicRoutingNumber(publicRoutingNumber);
        ecpDetailsModel.setAccountType(accountType);
        ecpDetailsModel.setDeleteStatus();
        paymentSources.addEcpDetails(ecpDetailsModel);
        break;
    case 'sepa':
        var sepaModel = new PaymentModels.SepaDirectDebitInfoModel();
        var ibanFirstFour = req.querystring.firstFour;
        var ibanLastFour = req.querystring.lastFour;

        sepaModel.setIbanFirstFour(ibanFirstFour);
        sepaModel.setIbanLastFour(ibanLastFour);
        sepaModel.setDeleteStatus();
        paymentSources.addSepaDirectDebitInfo(sepaModel);
        break;
    default:
        break;
    }

    vaultedShopper.setPaymentSources(paymentSources);
    vaultedShopper.setFirstName(customer.profile.firstName);
    vaultedShopper.setLastName(customer.profile.lastName);

    var result = vaultHelper.updateVaultedShopper(customer.profile.custom.bsVaultedShopperId, vaultedShopper.getData());

    this.on('route:BeforeComplete', function () {
        if (empty(result)) {
            res.json({
                UUID    : '',
                message : Resource.msg('billing.instruments.notdeleted', 'bluesnap', null)
            });
        } else {
            res.json({
                UUID    : uuid,
                message : Resource.msg('billing.instruments.deleted', 'bluesnap', null)
            });
        }
    });

    return next();
});

module.exports = server.exports();
