'use strict';

/**
 * clears the BlueSnap SEPA form
 */
function clearBluesnapSEPAForm() {
    $('input[name$="_vaultSEPA"]').val('none');
    $('input[name$="_iban"]').val('');
}

/**
 * Init the BlueSnap SEPA payment tab
 */
function initBluesnapACHTab() {
    var vaultShopper = 'none';
    if (!$('.user-bluesnapsepa-instruments').hasClass('checkout-hidden')) {
        vaultShopper = $('.saved-vaultedshoppersepa-instrument.selected-payment').data('vaultsepa');
    }
    $('input[name$="_vaultSEPA"]').val(vaultShopper);
}


module.exports = {
    selectVaultedShopperSepa: function () {
        $(document).on('click', '.saved-vaultedshoppersepa-instrument', function (e) {
            e.preventDefault();
            $('.saved-vaultedshoppersepa-instrument').removeClass('selected-payment');
            $(this).addClass('selected-payment');
            var vaultSepa = $(this).data('vaultsepa');
            $('input[name$="_vaultSEPA"]').val(vaultSepa);
        });
    },

    addNewVaultedShopperSepa: function () {
        $('.btn.add-payment-vaultedshoppersepa').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', true);
            clearBluesnapSEPAForm();
            $('.bluesnapsepa-form').removeClass('checkout-hidden');
            $('.user-bluesnapsepa-instruments').addClass('checkout-hidden');
        });
    },

    cancelNewVaultedShopperSepa: function () {
        $('.cancel-new-bluesnapsepa-payment').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', false);
            clearBluesnapSEPAForm();
            $('.user-bluesnapsepa-instruments').removeClass('checkout-hidden');
            $('.bluesnapsepa-form').addClass('checkout-hidden');
            initBluesnapACHTab();
        });
    },

    initBluesnapACHTab: initBluesnapACHTab()
};
