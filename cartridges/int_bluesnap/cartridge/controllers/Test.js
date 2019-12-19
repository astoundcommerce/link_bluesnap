/**
 * Controller for test purposes
 * should be removed in production
 * can be used for additional testing
 */

'use strict';

var myFunction = function () {
    var paymentsApi = require('*/cartridge/scripts/api/payments.js');
    response.writer.print(paymentsApi.bluesnapCreditDebit());
};

/**
 * Test BlueSnap Vaulted Shopper API
 */
function vaultedShoppersApi() {
    var vaultApi = require('*/cartridge/scripts/api/vaultedShoppers');
    var vaultedShopper = vaultApi.getVaultedShopper('24555641');
    response.writer.print(JSON.stringify(vaultedShopper));
}

exports.VaultedShoppers = vaultedShoppersApi;
exports.VaultedShoppers.public = true;

exports.Start = myFunction;
exports.Start.public = true;
