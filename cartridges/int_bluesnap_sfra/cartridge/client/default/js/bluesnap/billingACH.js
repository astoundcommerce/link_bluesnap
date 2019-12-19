'use strict';

/**
 * clears the BlueSnap ACH/ECP form
 */
function clearBluesnapACHForm() {
    $('input[name$="_vaultACH"]').val('none');
    $('input[name$="_routingNumber"]').val('');
    $('input[name$="_accountNumber"]').val('');
    $('select[name$="_accountType"]').val('CONSUMER_CHECKING');
}

/**
 * Init the BlueSnap ACH payment tab
 */
function initBluesnapACHTab() {
    var vaultShopper = 'none';
    if (!$('.user-bluesnapach-instruments').hasClass('checkout-hidden')) {
        vaultShopper = $('.saved-vaultedshopperach-instrument.selected-payment').data('vaultach');
    }
    $('input[name$="_vaultACH"]').val(vaultShopper);
}

module.exports = {
    selectVaultedShopperAch: function () {
        $(document).on('click', '.saved-vaultedshopperach-instrument', function (e) {
            e.preventDefault();
            $('.saved-vaultedshopperach-instrument').removeClass('selected-payment');
            $(this).addClass('selected-payment');
            var vaultAch = $(this).data('vaultach');
            $('input[name$="_vaultACH"]').val(vaultAch);
        });
    },

    addNewVaultedShopperAch: function () {
        $('.btn.add-payment-vaultedshopperach').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', true);
            clearBluesnapACHForm();
            $('.bluesnapach-form').removeClass('checkout-hidden');
            $('.user-bluesnapach-instruments').addClass('checkout-hidden');
        });
    },

    cancelNewVaultedShopperAch: function () {
        $('.cancel-new-bluesnapach-payment').on('click', function (e) {
            e.preventDefault();
            $('.payment-information').data('is-new-payment', false);
            clearBluesnapACHForm();
            $('.user-bluesnapach-instruments').removeClass('checkout-hidden');
            $('.bluesnapach-form').addClass('checkout-hidden');
            initBluesnapACHTab();
        });
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

    initBluesnapACHTab: function () {
        initBluesnapACHTab();
        $('.accountType.custom-select').trigger('change');
    }
};
