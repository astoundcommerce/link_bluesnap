'use strict';

var cleave = require('base/components/cleave');
var formValidation = require('base/components/formValidation');
var urlConfirmation;

/**
 * @description Function return last word in the string separeted by '_'
 * @param {string} name - name
 * @return {string} - substring
 */
function getLastbSubKey(name) {
    if (typeof name !== 'string') {
        return '';
    }
    var arr = name.split('_');
    if (arr.length === 0) {
        return '';
    }
    return arr[arr.length - 1];
}

module.exports = {
    swithBluesnapForms: function () {
        $("input:radio[id^='paymentoption']").on('click', function () {
            var selectedPayment = getLastbSubKey(this.id);
            if (selectedPayment) {
                $("div[id^='form']").css('display', 'none');
                $("div[id^='form']").children('fieldset').attr('disabled', true);

                $('#form_' + selectedPayment).css('display', 'block');
                $('#form_' + selectedPayment).children('fieldset').attr('disabled', false);
            }
        });
    },

    handleCreditCardNumber: function () {
        if ($('#cardNumber').length && $('#cardType').length) {
            cleave.handleCreditCardNumber('#cardNumber', '#cardType');
        }
    },

    handleLatamCreditCardNumber: function () {
        if ($('#latamCardNumber').length && $('#latamCardType').length) {
            cleave.handleCreditCardNumber('#latamCardNumber', '#latamCardType');
        }
    },

    handleAchAccountType: function () {
        $('.accountType.custom-select').on('change', function () {
            var accountType = $(this).val();
            if (accountType && accountType.includes('CORPORATE')) {
                $('form input[name$="_companyName"]').prop('disabled', false);
            } else {
                $('form input[name$="_companyName"]').prop('disabled', true);
            }
        });
    },

    submitPayment: function () {
        $('form.payment-form-bluesnap').submit(function (e) {
            var $form = $(this);
            var url;
            e.preventDefault();
            url = $form.attr('action');
            $form.spinner().start();
            $('form.payment-form-bluesnap').trigger('payment:submit', e);

            var formData = cleave.serializeData($form);

            $.ajax({
                url      : url,
                type     : 'post',
                dataType : 'json',
                data     : formData,
                success  : function (data) {
                    $form.spinner().stop();
                    if (!data.success) {
                        formValidation($form, data);
                    } else {
                        location.href = data.redirectUrl;
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    $form.spinner().stop();
                }
            });
            return false;
        });
    },

    removePayment: function () {
        $('.remove-payment').on('click', function (e) {
            e.preventDefault();
            var paymentType =  $(this).data('type');
            switch (paymentType) {
            case 'card':
                urlConfirmation = $(this).data('url') + '?UUID=' + $(this).data('id')
                    + '&type=' + $(this).data('type')
                    + '&cardType=' + $(this).data('cardtype')
                    + '&lastFour=' + $(this).data('lastfour');
                $('.payment-to-remove').empty().append($(this).data('lastfour'));
                break;
            case 'ecp':
                urlConfirmation = $(this).data('url') + '?UUID=' + $(this).data('id')
                    + '&type=' + $(this).data('type')
                    + '&publicAccountNumber=' + $(this).data('publicaccountnumber')
                    + '&publicRoutingNumber=' + $(this).data('publicroutingnumber')
                    + '&accountType=' + $(this).data('accounttype');
                $('.payment-to-remove').empty().append($(this).data('publicaccountnumber'));
                break;
            case 'sepa':
                urlConfirmation = $(this).data('url') + '?UUID=' + $(this).data('id')
                    + '&type=' + $(this).data('type')
                    + '&firstFour=' + $(this).data('firstfour')
                    + '&lastFour=' + $(this).data('lastfour');
                $('.payment-to-remove').empty().append($(this).data('lastfour'));
                break;
            default:
                break;
            }
        });
    },

    removePaymentConfirmation: function () {
        $('.delete-confirmation-btn').click(function (e) {
            e.preventDefault();
            $.spinner().start();
            $.ajax({
                url      : urlConfirmation,
                type     : 'get',
                dataType : 'json',
                success  : function (data) {
                    $('#' + data.UUID).remove();
                    if (data.message) {
                        var toInsert = '<div><h3>' +
                            data.message +
                            '</h3><div>';
                        $('.vaultedshopper-instruments').after(toInsert);
                    }
                    $.spinner().stop();
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    $.spinner().stop();
                }
            });
        });
    },

    initForms: function () {
        $("input:radio[id^='paymentoption']:checked").trigger('click');
        $('.accountType.custom-select').trigger('change');
    }

};
