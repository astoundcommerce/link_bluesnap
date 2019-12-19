'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var Resource = require('dw/web/Resource');
var formErrors = require('*/cartridge/scripts/formErrors');

/**
 * Validate credit card form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @returns {Object} the names of the invalid form fields
 */
function validateCreditCard(form) {
    var result = {};
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!form.paymentMethod.value) {
        if (currentBasket.totalGrossPrice.value > 0) {
            result[form.paymentMethod.htmlName] =
                Resource.msg('error.no.selected.payment.method', 'creditCard', null);
        }

        return result;
    }

    return validateFields(form.bluesnapcreditcardFields);
}

/**
 * Validate Hosted Payment credit card form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @returns {Object} the names of the invalid form fields
 */
function validateHostedPayment(form) {
    var result = {};
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!form.paymentMethod.value) {
        if (currentBasket.totalGrossPrice.value > 0) {
            result[form.paymentMethod.htmlName] =
                Resource.msg('error.no.selected.payment.method', 'creditCard', null);
        }

        return result;
    }

    return validateFields(form.BSHostedPayment);
}

/**
 * Validate ACH payment form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @returns {Object} the names of the invalid form fields
 */
function validateAchPayment(form) {
    var result = {};
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!form.paymentMethod.value) {
        if (currentBasket.totalGrossPrice.value > 0) {
            result[form.paymentMethod.htmlName] =
                Resource.msg('error.no.selected.payment.method', 'creditCard', null);
        }

        return result;
    }

    return validateFields(form.BSACH);
}

/**
 * Validate SEPA payment form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @returns {Object} the names of the invalid form fields
 */
function validateSepaPayment(form) {
    var result = {};
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!form.paymentMethod.value) {
        if (currentBasket.totalGrossPrice.value > 0) {
            result[form.paymentMethod.htmlName] =
                Resource.msg('error.no.selected.payment.method', 'creditCard', null);
        }

        return result;
    }

    return validateFields(form.BSSEPA);
}

/**
 * Validate LATAM credit card form fields
 * @param {Object} form - the form object with pre-validated form fields
 * @returns {Object} the names of the invalid form fields
 */
function validateLatamCreditCard(form) {
    var result = {};
    var currentBasket = BasketMgr.getCurrentBasket();

    if (!form.paymentMethod.value) {
        if (currentBasket.totalGrossPrice.value > 0) {
            result[form.paymentMethod.htmlName] =
                Resource.msg('error.no.selected.payment.method', 'creditCard', null);
        }

        return result;
    }

    return validateFields(form.BSlatAm);
}

/**
 * Validate billing form
 * @param {Object} form - the form object with pre-validated form fields
 * @returns {Object} the names of the invalid form fields
 */
function validateFields(form) {
    return formErrors.getFormErrors(form);
}

/**
 * This function is only needed to ensure compatibility of methods with SiteGenesis Forms.
 * It make object from SFRA Forms and added methods get(key) and value() to object
 * @param {Object} form - the form object
 * @returns {Object} the model with data from form fields
 */
function convertFormToObject(form) {
    if (form === null) {
        return null;
    }
    var result = formFieldsToObject(form);

    result.get = function (key) {
        var val = this[key];
        return {
            value: function () {
                return val;
            }
        };
    };

    result.getValue = function (key) {
        return this[key];
    };

    return result;
}

/**
 * Get the form fields and save to object
 * @param {Object} form - the form object
 * @returns {Object} the with data from form fields
 */
function formFieldsToObject(form) {
    if (form === null) {
        return {};
    }
    var result = {};

    Object.keys(form).forEach(function (key) {
        if (form[key] && Object.prototype.hasOwnProperty.call(form[key], 'formType')) {
            if (form[key].formType === 'formField') {
                result[key] = form[key].value;
            }

            if (form[key].formType === 'formGroup') {
                var innerFormResult = formFieldsToObject(form[key]);
                Object.keys(innerFormResult).forEach(function (innerKey) {
                    result[key + '.' + innerKey] = innerFormResult[innerKey];
                });
            }
        }
    });
    return result;
}

module.exports.validateCreditCard = validateCreditCard;
module.exports.validateHostedPayment = validateHostedPayment;
module.exports.convertFormToObject = convertFormToObject;
module.exports.validateAchPayment = validateAchPayment;
module.exports.validateSepaPayment = validateSepaPayment;
module.exports.validateLatamCreditCard = validateLatamCreditCard;
