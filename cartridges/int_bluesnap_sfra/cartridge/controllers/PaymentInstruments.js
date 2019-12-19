'use strict';

var server = require('server');
server.extend(module.superModule);

/**
 * @description Save BlueSnap Vaulted Shopper ID to profile current customer
 * @param {string} customerNo - Customer number
 * @param {integer} vaultId - BlueSnap Vaulted Shopper ID
 */
function saveCustomerVaultId(customerNo, vaultId) {
    var Transaction = require('dw/system/Transaction');
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var customer = CustomerMgr.getCustomerByCustomerNumber(customerNo);
    Transaction.wrap(function () {
        customer.profile.custom.bsVaultedShopperId = vaultId;
    });
}

/**
 * @description Create payment BlueSnap Vaulted Shopper model
 * @param {Object} savedPayment - payment data
 * @returns {Object} - BlueSnap Vaulted Shopper model
 */
function vaultedShopperModel(savedPayment) {
    var vaultedShopper = {
        firstName      : savedPayment.name,
        paymentSources : {
            creditCardInfo: [{
                creditCard: {
                    expirationYear  : savedPayment.expirationYear,
                    expirationMonth : savedPayment.expirationMonth,
                    cardNumber      : savedPayment.cardNumber
                }
            }]
        }
    };
    return vaultedShopper;
}

server.append('SavePayment', function (req, res, next) {
    this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var savedPayment = res.getViewData();
        if (savedPayment.success && savedPayment.paymentForm.saveToBluesnapVault.checked) {
            // Save card data to bluesnap vault
            var VaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');

            var vaultedShopper = vaultedShopperModel(savedPayment);
            var result = VaultHelper.createVaultedShopper(vaultedShopper);

            if (result.status == dw.system.Status.OK) {
                saveCustomerVaultId(req.currentCustomer.profile.customerNo, result.vaultedShopperId);
            }
        }
    });
    next();
});

module.exports = server.exports();
