'use strict';

/**
 * Extension of the base module PaymentModel
 * See also {@link app_storefront_base/cartridge/models/payment.js}
 */
var _super = module.superModule;
var collections = require('*/cartridge/scripts/util/collections');

/**
 * Creates an array of objects containing selected payment information
 * @param {dw.util.ArrayList<dw.order.PaymentInstrument>} selectedPaymentInstruments - ArrayList
 *      of payment instruments that the user is using to pay for the current basket
 * @returns {Array} Array of objects that contain information about the selected payment instruments
 */
function getSelectedPaymentInstruments(selectedPaymentInstruments) {
    return collections.map(selectedPaymentInstruments, function (paymentInstrument) {
        var results = {
            paymentMethod : paymentInstrument.paymentMethod,
            amount        : paymentInstrument.paymentTransaction.amount.value
        };
        switch (paymentInstrument.paymentMethod) {
        case 'CREDIT_CARD':
            results.lastFour = paymentInstrument.creditCardNumberLastDigits;
            results.owner = paymentInstrument.creditCardHolder;
            results.expirationYear = paymentInstrument.creditCardExpirationYear;
            results.type = paymentInstrument.creditCardType;
            results.maskedCreditCardNumber = paymentInstrument.maskedCreditCardNumber;
            results.expirationMonth = paymentInstrument.creditCardExpirationMonth;
            break;
        case 'GIFT_CERTIFICATE':
            results.giftCertificateCode = paymentInstrument.giftCertificateCode;
            results.maskedGiftCertificateCode = paymentInstrument.maskedGiftCertificateCode;
            break;
        case 'BLUESNAP_ACH_PAYMENT':
            results.bankAccountHolder = paymentInstrument.bankAccountHolder;
            results.bankRoutingNumber = paymentInstrument.bankRoutingNumber;
            results.bankAccountNumberLastDigits = paymentInstrument.bankAccountNumberLastDigits;
            break;
        case 'BLUESNAP_CREDIT_DEBIT':
            results.lastFour = paymentInstrument.creditCardNumberLastDigits;
            results.owner = paymentInstrument.creditCardHolder;
            results.expirationYear = paymentInstrument.creditCardExpirationYear;
            results.type = paymentInstrument.creditCardType;
            results.maskedCreditCardNumber = paymentInstrument.maskedCreditCardNumber;
            results.expirationMonth = paymentInstrument.creditCardExpirationMonth;
            break;
        case 'BLUESNAP_LATAM':
            results.lastFour = paymentInstrument.creditCardNumberLastDigits;
            results.owner = paymentInstrument.creditCardHolder;
            results.expirationYear = paymentInstrument.creditCardExpirationYear;
            results.type = paymentInstrument.creditCardType;
            results.maskedCreditCardNumber = paymentInstrument.maskedCreditCardNumber;
            results.expirationMonth = paymentInstrument.creditCardExpirationMonth;
            break;
        case 'BLUESNAP_SEPA_PAYMENT':
            results.iban = paymentInstrument.bankAccountNumberLastDigits;
            break;
        default:
            break;
        }

        return results;
    });
}

/**
 * Payment class that represents payment information for the current basket
 * @param {dw.order.Basket} currentBasket - the target Basket object
 * @param {dw.customer.Customer} currentCustomer - the associated Customer object
 * @param {string} countryCode - the associated Site countryCode
 * @constructor
 */
function Payment(currentBasket, currentCustomer, countryCode) {
    _super.call(this, currentBasket, currentCustomer, countryCode);
    var paymentInstruments = currentBasket.paymentInstruments;
    this.selectedPaymentInstruments = paymentInstruments ?
        getSelectedPaymentInstruments(paymentInstruments) : null;
}

module.exports = Payment;
