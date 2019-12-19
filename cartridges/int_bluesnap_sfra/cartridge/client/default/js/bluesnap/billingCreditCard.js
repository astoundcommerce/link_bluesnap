'use strict';

var cleave = require('base/components/cleave');

/**
 * clears the BlueSnap credit card form
 */
function clearBluesnapCreditCardForm() {
    if (!$('#blusnapHostedData').length) {
        $('input[name$="bluesnapcreditcardFields_vaultCreditCard"]').val('none');
        $('input[name$="bluesnapcreditcardFields_number"]').data('cleave').setRawValue('');
        $('select[name$="bluesnapcreditcardFields_expiration_month"]').val('');
        $('select[name$="bluesnapcreditcardFields_expiration_year"]').val('');
        $('input[name$="bluesnapcreditcardFields_cvn"]').val('');
    }
    $('input[name$="_vaultCreditCard"]').val('none');
}

/**
 * Init the BlueSnap Credit Card payment tab
 */
function initCreditCardTab() {
    var vaultShopper = 'none';
    if (!$('.user-bluesnapcreditcard-instruments').hasClass('checkout-hidden')) {
        vaultShopper = $('.saved-vaultedshoppercard-instrument.selected-payment').data('vaultcreditcard');
    }
    $('input[name$="_vaultCreditCard"]').val(vaultShopper);
}

module.exports = {
    selectVaultedShopperCard: function () {
        $(document).on('click', '.saved-vaultedshoppercard-instrument', function (e) {
            e.preventDefault();
            $('.saved-vaultedshoppercard-security-code').val('');
            $('.saved-vaultedshoppercard-instrument').removeClass('selected-payment');
            $(this).addClass('selected-payment');
            $('.saved-vaultedshoppercard-instrument .card-image').removeClass('checkout-hidden');
            $('.saved-vaultedshoppercard-instrument .security-code-input').addClass('checkout-hidden');
            $('.saved-vaultedshoppercard-instrument.selected-payment' +
                ' .card-image').addClass('checkout-hidden');
            $('.saved-vaultedshoppercard-instrument.selected-payment' +
                ' .security-code-input').removeClass('checkout-hidden');
            var vaultShopperCard = $(this).data('vaultcreditcard');
            $('input[name$="_vaultCreditCard"]').val(vaultShopperCard);
        });
    },

    addNewVaultedShopperCard: function () {
        $('.btn.add-payment-vaultedshoppercard').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', true);
            clearBluesnapCreditCardForm();
            $('.bluesnapcreditcard-form').removeClass('checkout-hidden');
            $('.user-bluesnapcreditcard-instruments').addClass('checkout-hidden');
        });
    },

    cancelNewVaultedShopperCard: function () {
        $('.cancel-new-bluesnapcreditcard-payment').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', false);
            clearBluesnapCreditCardForm();
            $('.user-bluesnapcreditcard-instruments').removeClass('checkout-hidden');
            $('.bluesnapcreditcard-form').addClass('checkout-hidden');
            initCreditCardTab();
        });
    },

    handleCreditCardNumber: function () {
        if ($('#bluesnapCardNumber').length && $('#bluesnapCardType').length) {
            cleave.handleCreditCardNumber('#bluesnapCardNumber', '#bluesnapCardType');
        }
    },

    initCreditCardTab: initCreditCardTab()
};
