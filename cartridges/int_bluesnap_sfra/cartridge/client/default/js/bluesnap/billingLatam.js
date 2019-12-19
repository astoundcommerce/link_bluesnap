'use strict';

var cleave = require('base/components/cleave');

/**
 * clears the BlueSnap credit card form
 */
function clearBluesnapLatamCreditCardForm() {
    $('input[name$="BSlatAm_vaultLatamCard"]').val('none');
    $('input[name$="BSlatAm_number"]').data('cleave').setRawValue('');
    $('select[name$="BSlatAm_expiration_month"]').val('');
    $('select[name$="BSlatAm_expiration_year"]').val('');
    $('input[name$="BSlatAm_cvn"]').val('');
    $('input[name$="BSlatAm_personalIdentificationNumber"]').val('');
}

/**
 * Init the BlueSnap LatAm Credit Card payment tab
 */
function initLatamCardTab() {
    var vaultShopper = 'none';
    if (!$('.user-bluesnaplatamcard-instruments').hasClass('checkout-hidden')) {
        vaultShopper = $('.saved-vaultedshopperlatamcard-instrument.selected-payment').data('vaultcreditcard');
    }
    $('input[name$="_vaultLatamCard"]').val(vaultShopper);
}

module.exports = {
    selectVaultedShopperCard: function () {
        $(document).on('click', '.saved-vaultedshopperlatamcard-instrument', function (e) {
            e.preventDefault();
            $('.saved-vaultedshopperlatamcard-security-code').val('');
            $('.saved-vaultedshopperlatamcard-instrument').removeClass('selected-payment');
            $(this).addClass('selected-payment');
            $('.saved-vaultedshopperlatamcard-instrument .card-image').removeClass('checkout-hidden');
            $('.saved-vaultedshopperlatamcard-instrument .security-code-input').addClass('checkout-hidden');
            $('.saved-vaultedshopperlatamcard-instrument.selected-payment' +
                ' .card-image').addClass('checkout-hidden');
            $('.saved-vaultedshopperlatamcard-instrument.selected-payment' +
                ' .security-code-input').removeClass('checkout-hidden');
            var vaultShopperCard = $(this).data('vaultcreditcard');
            $('input[name$="_vaultLatamCard"]').val(vaultShopperCard);
        });
    },

    addNewVaultedShopperCard: function () {
        $('.btn.add-payment-vaultedshopperlatam').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', true);
            clearBluesnapLatamCreditCardForm();
            $('.bluesnaplatamcard-form').removeClass('checkout-hidden');
            $('.user-bluesnaplatamcard-instruments').addClass('checkout-hidden');
        });
    },

    cancelNewVaultedShopperCard: function () {
        $('.cancel-new-bluesnaplatamcard-payment').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', false);
            clearBluesnapLatamCreditCardForm();
            $('.user-bluesnaplatamcard-instruments').removeClass('checkout-hidden');
            $('.bluesnaplatamcard-form').addClass('checkout-hidden');
            initLatamCardTab();
        });
    },
    handleCreditCardNumber: function () {
        if ($('#bluesnapLatamCardNumber').length && $('#bluesnapLatamCardType').length) {
            cleave.handleCreditCardNumber('#bluesnapLatamCardNumber', '#bluesnapLatamCardType');
        }
    },

    initCreditCardTab: initLatamCardTab()
};
