// bluesnap-account.js
$('.js-bluesnap-payment-selector').on('change', function (event) {
    var $paymentsDiv = $('.js-vaultPayments');
    var activeId = $paymentsDiv.data('activeform');

    var $activeDiv = $paymentsDiv.find('#'+activeId);
    $activeDiv.removeClass('payment-method-expanded');
    $activeDiv.addClass('payment-method');

    var $nextActiveDiv = $('#' + this.value);
    $nextActiveDiv.removeClass('payment-method');
    $nextActiveDiv.addClass('payment-method-expanded');

    $paymentsDiv.data('activeform', this.value);
});

$('.js-bluesnap-ach-type select').on('change', function () {
    if (this.value.indexOf('CORPORATE') != -1) {
        // Show corporate
        $(this).closest('form').find('.js-bluesnap-company').show();
    } else {
        // Hide corporate
        $(this).closest('form').find('.js-bluesnap-company').hide();
    }
});
