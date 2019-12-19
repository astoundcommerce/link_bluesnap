var app = require('*/cartridge/scripts/app');
var PaymentInstrument = require('dw/order/PaymentInstrument');
var cart = app.getModel('Cart').get();
var getBlueSnapPreference = require('*/cartridge/scripts/lib/bluesnapdata.js');

/* list of payments should be added with every new payment like following:
 {PAYMENT_ID : payment_form}
*/
var payments = {
    BLUESNAP_CREDIT_DEBIT  : 'BScreditCard',
    BLUESNAP_ACH_PAYMENT   : 'BSACH',
    BLUESNAP_SEPA_PAYMENT  : 'BSSEPA',
    BLUESNAP_LATAM         : 'BSlatAm',
    BLUESNAP_VISA_CHECKOUT : false,
    PayPal                 : false,
    BLUESNAP_GOOGLE_PAY    : false,
    BLUESNAP_APPLE_PAY     : false

};
payments[PaymentInstrument.METHOD_CREDIT_CARD] = 'creditCard';
payments[PaymentInstrument.METHOD_BML] = 'bml';

/**
 * Clear bluesnap payment form elements
 * @param {Object} param - parameters form elements
 */
function resetPayments(param) {
    var selectedPayment = param || null;
    if (getBlueSnapPreference('HostedPayment')) {
        app.getForm('billing.paymentMethods.BSHostedPayment').clearFormElement();
    }
    for (var key in payments) {
        if (payments.hasOwnProperty(key)) {
            if (key !== selectedPayment) {
                if (payments[key]) {
                    app.getForm('billing.paymentMethods.' + payments[key]).clearFormElement();
                }
                cart.removePaymentInstruments(cart.getPaymentInstruments(key));
            }
        }
    }
}
module.exports = resetPayments;

