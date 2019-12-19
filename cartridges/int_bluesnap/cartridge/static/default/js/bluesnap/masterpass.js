document.addEventListener('DOMContentLoaded', function () {
    $('#masterpass').on('click', masterpassClicked);
});

/**
 * Handling payment
 */
function masterpassClicked() {
    var $url = $('#masterpass').data('walleturl');
    $.ajax({
        url    : $url,
        method : 'POST'

    }).done(function (data) {
        try {
            var walletData = JSON.parse(data);
            handleBuyWithMasterPass(walletData);
        } catch (error) {
            // Handling error payment
        }
    });
}

/**
 * Handling MasterPass payment
 * @param {Object} data - payment date 
 */
function handleBuyWithMasterPass(data) {
    MasterPass.client.checkout({
        requestToken       : data.requestToken,
        callbackUrl        : 'https://sandbox.bluesnap.com/services/WalletCallbackServlet?wallet_type=MASTERPASS',
        merchantCheckoutId : data.merchantCheckoutId,
        allowedCardTypes   : data.allowedCardTypes,
        version            : 'v6'
    });
}

