document.addEventListener('DOMContentLoaded', function () {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
        $('#apple-pay-button').css('visibility', 'visible');
    }
    $('#apple-pay-button').on('click', applePayClicked);
});

/**
 * Handling ApplePay button click
 */
function applePayClicked() {
    var basket = $('#apple-pay-button').data('basket');
    var request = {
        countryCode                   : 'US',
        currencyCode                  : basket.currency,
        total                         : { label: 'Your Label', amount: basket.amount, type: 'final' },
        supportedNetworks             : ['amex', 'discover', 'jcb', 'masterCard', 'visa'],
        merchantCapabilities          : ['supports3DS'],
        requiredBillingContactFields  : ['postalAddress', 'name'],
        requiredShippingContactFields : ['postalAddress', 'email', 'phone']
    };
    var session = new ApplePaySession(2, request);
    session.onvalidatemerchant = function (event) {
        var url = $('#apple-pay-button').data('cwalleturl');

        $.ajax({
            url    : url,
            method : 'POST',
            data   : { validUrl: event.validationURL }
        }).done(function (token) {
            session.completeMerchantValidation(JSON.parse(token));
        });
    };

    session.onpaymentauthorized = function (event) {
        var paymentToken = event.payment;
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        var url = $('#apple-pay-button').data('procesurl');
        var checkoutUrl = $('#apple-pay-button').data('checkouturl');
        $.ajax({
            url    : url,
            method : 'POST',
            data   : {
                token      : JSON.stringify(paymentToken),
                basketData : JSON.stringify(basket)
            }
        }).done(function () {
            window.location.href = checkoutUrl;
        });
    };
    session.begin();
}
