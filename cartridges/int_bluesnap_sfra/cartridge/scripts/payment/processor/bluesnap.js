'use strict';

/* API Includes */
var Transaction = require('dw/system/Transaction');
var collections = require('*/cartridge/scripts/util/collections');

/* Script Modules */
var bluesnapPayments = require('*/cartridge/scripts/bsPaymentHelper.js');
var bluesnapCheckoutHelper = require('*/cartridge/scripts/checkout/bluesnapCheckoutHelpers');
var paymentsApi = require('*/cartridge/scripts/api/payments');

/**
 * Handles a payment using  BLUESNAP. The payment is handled by using the BLUESNAP processor
 * @param {dw.order.Basket} basket Current users's basket
 * @param {Object} paymentInformation - the payment information
 * @return {Object} returns an error object
 */
function Handle(basket, paymentInformation) {
    switch (paymentInformation.paymentMethod.value) {
    case 'BLUESNAP_ACH_PAYMENT':
        try {
            Transaction.wrap(function () {
                collections.forEach(basket.getPaymentInstruments(), function (item) {
                    basket.removePaymentInstrument(item);
                });

                var paymentInstrument = basket.createPaymentInstrument(
                    paymentInformation.paymentMethod.value,
                    basket.totalGrossPrice
                );

                paymentInstrument.setBankAccountHolder(basket.billingAddress.fullName);
                if (paymentInformation.vaultACH.isVaultedShopper) {
                    paymentInstrument.setBankRoutingNumber(paymentInformation.vaultACH.publicRoutingNumber);
                    paymentInstrument.setBankAccountNumber(paymentInformation.vaultACH.publicAccountNumber);
                } else {
                    paymentInstrument.setBankRoutingNumber(paymentInformation.routingNumber.value);
                    paymentInstrument.setBankAccountNumber(paymentInformation.accountNumber.value);
                }
            });
        } catch (error) {
            return { error: true };
        }
        break;

    case 'BLUESNAP_CREDIT_DEBIT' :
        try {
            Transaction.wrap(function () {
                collections.forEach(basket.getPaymentInstruments(), function (item) {
                    basket.removePaymentInstrument(item);
                });

                var paymentInstrument = basket.createPaymentInstrument(
                    paymentInformation.paymentMethod.value,
                    basket.totalGrossPrice
                );

                paymentInstrument.setCreditCardHolder(basket.billingAddress.fullName);
                if (paymentInformation.vaultCreditCard.isVaultedShopper) {
                    paymentInstrument.setCreditCardType(paymentInformation.vaultCreditCard.cardType);
                    // paymentInstrument.setCreditCardNumber(paymentInformation.vaultCreditCard.lastFourDigits);
                } else {
                    paymentInstrument.setCreditCardType(paymentInformation.cardType.value);
                    paymentInstrument.setCreditCardNumber(paymentInformation.cardNumber.value);
                    paymentInstrument.setCreditCardExpirationMonth(paymentInformation.expirationMonth.value);
                    paymentInstrument.setCreditCardExpirationYear(paymentInformation.expirationYear.value);
                }
            });
        } catch (error) {
            return { error: true };
        }
        break;

    case 'BLUESNAP_LATAM' :
        try {
            Transaction.wrap(function () {
                collections.forEach(basket.getPaymentInstruments(), function (item) {
                    basket.removePaymentInstrument(item);
                });

                var paymentInstrument = basket.createPaymentInstrument(
                    paymentInformation.paymentMethod.value,
                    basket.totalGrossPrice
                );

                paymentInstrument.setCreditCardHolder(basket.billingAddress.fullName);
                if (paymentInformation.vaultCreditCard.isVaultedShopper) {
                    paymentInstrument.setCreditCardType(paymentInformation.vaultCreditCard.cardType);
                } else {
                    paymentInstrument.setCreditCardType(paymentInformation.cardType.value);
                    paymentInstrument.setCreditCardNumber(paymentInformation.cardNumber.value);
                    paymentInstrument.setCreditCardExpirationMonth(paymentInformation.expirationMonth.value);
                    paymentInstrument.setCreditCardExpirationYear(paymentInformation.expirationYear.value);
                }
            });
        } catch (error) {
            return { error: true };
        }
        break;

    case 'BLUESNAP_SEPA_PAYMENT':
        try {
            Transaction.wrap(function () {
                collections.forEach(basket.getPaymentInstruments(), function (item) {
                    basket.removePaymentInstrument(item);
                });

                var paymentInstrument = basket.createPaymentInstrument(
                    paymentInformation.paymentMethod.value,
                    basket.totalGrossPrice
                );

                paymentInstrument.setBankAccountHolder(basket.billingAddress.fullName);
                if (paymentInformation.vaultSEPA.isVaultedShopper) {
                    paymentInstrument.setBankAccountNumber(paymentInformation.vaultSEPA.value);
                } else {
                    paymentInstrument.setBankAccountNumber(paymentInformation.iban.value);
                }
            });
        } catch (error) {
            return { error: true };
        }
        break;

    case 'BLUESNAP_GOOGLE_PAY':
        try {
            Transaction.wrap(function () {
                collections.forEach(basket.getPaymentInstruments(), function (item) {
                    basket.removePaymentInstrument(item);
                });

                var paymentInstrument = basket.createPaymentInstrument(
                    paymentInformation.paymentMethod.value,
                    basket.totalGrossPrice
                );

                paymentInstrument.setCreditCardHolder(basket.billingAddress.fullName);
            });
        } catch (error) {
            return { error: true };
        }
        break;

    case 'BLUESNAP_APPLE_PAY':
        try {
            Transaction.wrap(function () {
                collections.forEach(basket.getPaymentInstruments(), function (item) {
                    basket.removePaymentInstrument(item);
                });

                var paymentInstrument = basket.createPaymentInstrument(
                    paymentInformation.paymentMethod.value,
                    basket.totalGrossPrice
                );

                paymentInstrument.setCreditCardHolder(basket.billingAddress.fullName);
            });
        } catch (error) {
            return { error: true };
        }
        break;

    case 'BLUESNAP_VISA_CHECKOUT':
        try {
            Transaction.wrap(function () {
                collections.forEach(basket.getPaymentInstruments(), function (item) {
                    basket.removePaymentInstrument(item);
                });

                var paymentInstrument = basket.createPaymentInstrument(
                    paymentInformation.paymentMethod.value,
                    basket.totalGrossPrice
                );

                paymentInstrument.setCreditCardHolder(basket.billingAddress.fullName);
            });
        } catch (error) {
            return { error: true };
        }
        break;

    default:
        break;
    }

    return { success: true };
}

/**
 *  Authorizes a payment using  BLUESNAP. The payment is authorized by using the BLUESNAP processor
 * @param {number} orderNo - The current order's number
 * @param {dw.order.PaymentInstrument} paymentInstrument -  The payment instrument to authorize
 * @param {dw.order.PaymentProcessor} paymentProcessor -  The payment processor of the current payment method
 * @return {Object} returns an error object
 */
function Authorize(orderNo, paymentInstrument, paymentProcessor) {
    var order = dw.order.OrderMgr.getOrder(orderNo);
    var response = null;
    var server = require('server');

    switch (paymentInstrument.paymentMethod) {
    case 'BLUESNAP_ACH_PAYMENT':
        var ACHForm = server.forms.getForm('billing').BSACH;
        // This code needed to ensure compatibility of methods with SiteGenesis Forms, with have used in function paymentACH()
        var ACHFormModel = bluesnapCheckoutHelper.convertFormToObject(ACHForm);

        response = bluesnapPayments.paymentACH(ACHFormModel, order);

        if (response) {
            try {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                    paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                });
            } catch (e) {
                return { error: true };
            }
        }
        break;

    case 'BLUESNAP_CREDIT_DEBIT':
        var creditCardForm = server.forms.getForm('billing').bluesnapcreditcardFields;

        // This code needed to ensure compatibility of methods with SiteGenesis Forms, with have used in function paymentCreditDebit()
        var creditCardModel = bluesnapCheckoutHelper.convertFormToObject(creditCardForm);

        var hostedDatatoken = session.privacy.hostedDataToken;
        response = bluesnapPayments.paymentCreditDebit(creditCardModel, hostedDatatoken, order);

        if (response) {
            try {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                    paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                });
            } catch (e) {
                return { error: true };
            }

            if (customer.registered) {
                if (customer.profile.custom.bsVaultedShopperId == '' && creditCardModel.getValue('storeInBluesnapVault')) {
                    Transaction.wrap(function () {
                        customer.profile.custom.bsVaultedShopperId = response.vaultedShopperId;
                    });
                }
            }
        }
        break;

    case 'BLUESNAP_LATAM':
        var latamCardForm = server.forms.getForm('billing').BSlatAm;

        // This code needed to ensure compatibility of methods with SiteGenesis Forms, with have used in function paymentCreditDebit()
        var latamCardModel = bluesnapCheckoutHelper.convertFormToObject(latamCardForm);

        var hostedLatamDatatoken = session.privacy.hostedDataToken;
        response = bluesnapPayments.paymentLatAM(latamCardModel, hostedLatamDatatoken, order);

        if (response) {
            try {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                    paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                });
            } catch (e) {
                return { error: true };
            }

            if (customer.registered) {
                if (customer.profile.custom.bsVaultedShopperId == '' && latamCardModel.getValue('storeInBluesnapVault')) {
                    Transaction.wrap(function () {
                        customer.profile.custom.bsVaultedShopperId = response.vaultedShopperId;
                    });
                }
            }
        }
        break;

    case 'BLUESNAP_SEPA_PAYMENT':
        var SEPAForm = server.forms.getForm('billing').BSSEPA;
        // This code needed to ensure compatibility of methods with SiteGenesis Forms, with have used in function paymentSEPA()
        var SEPAFormModel = bluesnapCheckoutHelper.convertFormToObject(SEPAForm);

        response = bluesnapPayments.paymentSEPA(SEPAFormModel, order);

        if (response) {
            try {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                    paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                });
            } catch (e) {
                return { error: true };
            }
        }
        break;

    case 'BLUESNAP_GOOGLE_PAY':
        var token = session.privacy.googletoken;
        var basketData = session.privacy.googledata;
        try {
            basketData = JSON.parse(basketData);
        } catch (e) {
            return { error: true };
        }

        response = paymentsApi.bluesnapProccessingGooglrPay(token, basketData);
        if (response) {
            try {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                    paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                });
            } catch (e) {
                return { error: true };
            }
        }
        break;

    case 'BLUESNAP_APPLE_PAY':
        try {
            var requestObject = JSON.parse(session.privacy.applePay);
            response = bluesnapPayments.bluesnapApplePayProccessing(requestObject, orderNo);
        } catch (error) {
            return { error: true };
        }

        if (response) {
            try {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                    paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                });
            } catch (e) {
                return { error: true };
            }
        }
        break;

    case 'BLUESNAP_VISA_CHECKOUT':
        var walletID = session.privacy.visacheckoutwallet;
        session.privacy.visacheckoutwallet = null;
        response = bluesnapPayments.paymentVisaCheckout(order, walletID, orderNo);
        if (response) {
            try {
                Transaction.wrap(function () {
                    paymentInstrument.paymentTransaction.setTransactionID(response.transactionId);
                    paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
                });
            } catch (e) {
                return { error: true };
            }
        }
        break;

    default:
        break;
    }
    return response ? { authorized: true } : { error: true };
}

exports.Handle = Handle;
exports.Authorize = Authorize;
