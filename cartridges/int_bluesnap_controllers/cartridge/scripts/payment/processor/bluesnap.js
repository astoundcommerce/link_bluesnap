/* API Includes */
var Transaction = require('dw/system/Transaction');
var Cart = require('*/cartridge/scripts/models/CartModel');
var PaymentMgr = require('dw/order/PaymentMgr');
/* Script Modules */
var app = require('*/cartridge/scripts/app');
var bluesnapPayments = require('*/cartridge/scripts/bsPaymentHelper.js');
/**
 * Handles a payment using  BLUESNAP. The payment is handled by using the BLUESNAP processor
 * @param {Object} args - payment parameters
 * @returns {Object} - successful status
 */
function Handle(args) {
    var cart = Cart.get(args.Basket);

    Transaction.wrap(function () {
        cart.removeExistingPaymentInstruments(args.PaymentMethodID);
        cart.createPaymentInstrument(args.PaymentMethodID, cart.getNonGiftCertificateAmount());
    });
    return { success: true };
}

/**
 * Authorizes a payment using  BLUESNAP. The payment is authorized by using the BLUESNAP processor
 * @param {Object} args - payment parameters
 * @returns {Object} - successful status
 */
function Authorize(args) {
    var cart = Cart.get(args.Order);
    var response = null;
    var paymentInstrument = args.PaymentInstrument;
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();
    Transaction.wrap(function () {
        paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
    });
    switch (args.PaymentInstrument.paymentMethod) {
    case 'BLUESNAP_ACH_PAYMENT':
        var ACHForm = app.getForm('billing.paymentMethods.BSACH');
        response = bluesnapPayments.paymentACH(ACHForm, cart);

        if (response && customer.authenticated && ACHForm.getValue('storeInBluesnapVault')) {
            bluesnapPayments.saveACHToVault(response, ACHForm);
        }
        break;

    case 'BLUESNAP_SEPA_PAYMENT':
        var SEPAForm = app.getForm('billing.paymentMethods.BSSEPA');
        response = bluesnapPayments.paymentSEPA(SEPAForm, cart);
        if (response && customer.authenticated && SEPAForm.getValue('storeInBluesnapVault')) {
            bluesnapPayments.saveSEPAToVault(response, SEPAForm);
        }
        break;

    case 'BLUESNAP_CREDIT_DEBIT':
        var creditCardForm = app.getForm('billing.paymentMethods.BScreditCard');
        var hostedDatatoken = session.privacy.hostedDataToken;
        response = bluesnapPayments.paymentCreditDebit(creditCardForm, hostedDatatoken, cart);

        if (response) {
            if (response.transactionId) {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                });
            }

            if (customer.registered && customer.profile.custom.bsVaultedShopperId == '' && creditCardForm.getValue('storeInBluesnapVault')) {
                Transaction.wrap(function () {
                    customer.profile.custom.bsVaultedShopperId = response.vaultedShopperId;
                });
            }
        }
        break;

    case 'BLUESNAP_LATAM':
        var latCreditCardForm = app.getForm('billing.paymentMethods.BSlatAm');
        var latHostedDatatoken = session.privacy.hostedDataToken;
        response = bluesnapPayments.paymentLatAM(latCreditCardForm, latHostedDatatoken, cart);

        if (response) {
            if (response.transactionId) {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                });
            }
            if (customer.registered && customer.profile.custom.bsVaultedShopperId == '' && latCreditCardForm.getValue('storeInBluesnapVault')) {
                Transaction.wrap(function () {
                    customer.profile.custom.bsVaultedShopperId = response.vaultedShopperId;
                });
            }
        }
        break;

    case 'BLUESNAP_GOOGLE_PAY':
        // all validation was in controller and google side
        response = true;
        break;
    case 'BLUESNAP_APPLE_PAY':
        // all validation was in controller and apple pay side
        try {
            var requestObject = JSON.parse(session.privacy.applePay);
            response = bluesnapPayments.bluesnapApplePayProccessing(requestObject, args.OrderNo);
        } catch (error) {
            response = false;
        }
        break;
    case 'BLUESNAP_VISA_CHECKOUT':
        var walletID = session.privacy.visacheckoutwallet;
        session.privacy.visacheckoutwallet = null;
        response = bluesnapPayments.paymentVisaCheckout(cart, walletID, args.OrderNo);

        break;

    default:
    }

    return response ? { authorized: true } : { error: true };
}

exports.Handle = Handle;
exports.Authorize = Authorize;
