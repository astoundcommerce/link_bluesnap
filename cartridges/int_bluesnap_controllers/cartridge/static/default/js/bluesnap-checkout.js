// bluesnap-checkout.js
$('.js-bluesnap-vault-payment-selector').on('change', function (event) {
    var $visibleRequired;
    var parentSelector = $(this).data('parentselector');
    var $container = $(this).parents(parentSelector);

    if (this.value === 'none') {
        // reset all fields
        $container.find('.form-row').show();
        if ($container.find('#hostedarea').length > 0) {
            $('#hostedarea').show();
            $container.find('.cvn').hide();
        }
        // hide help text
        $container.find('.vault-help-text').hide();
    } else {
        // hide non-required fields
        $container.find('.form-row:not(.vault-required)').hide();
        if ($container.find('#hostedarea').length > 0) {
            $('#hostedarea').hide();
            $container.find('.cvn').show();
        }
        // show help text
        $container.find('.vault-help-text').show();
        // if all requires are hidden - enable continue button
        $visibleRequired = $('.required', $container).find(':input:visible');
        if ($visibleRequired.length == 0) {
            $('[name$="billing_save"]').removeAttr('disabled');
        }
    }
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
