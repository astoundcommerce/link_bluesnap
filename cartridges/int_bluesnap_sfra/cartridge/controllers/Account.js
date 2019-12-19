'use strict';

var server = require('server');
var page = module.superModule;
server.extend(page);

var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.append(
    'Show',
    server.middleware.https,
    userLoggedIn.validateLoggedIn,
    consentTracking.consent,
    function (req, res, next) {
        var CustomerMgr = require('dw/customer/CustomerMgr');
        var VaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');
        var vaultedShopper = null;

        var customer = CustomerMgr.getCustomerByCustomerNumber(req.currentCustomer.profile.customerNo);

        if (!empty(customer.profile.custom.bsVaultedShopperId)) {
            var shopper = VaultHelper.getVaultedShopper(customer.profile.custom.bsVaultedShopperId);
            if (shopper) {
                vaultedShopper = {
                    firstName   : shopper.firstName || '',
                    lastName    : shopper.lastName || '',
                    creditCards : shopper.paymentSources.hasOwnProperty('creditCardInfo') ? shopper.paymentSources.creditCardInfo : [],
                    ecp         : shopper.paymentSources.hasOwnProperty('ecpDetails') ? shopper.paymentSources.ecpDetails : [],
                    sepa        : shopper.paymentSources.hasOwnProperty('sepaDirectDebitInfo') ? shopper.paymentSources.sepaDirectDebitInfo : []
                };
                var viewData = res.getViewData();
                viewData.vaultedShopper = vaultedShopper;
                res.setViewData(viewData);
            }
        }

        next();
    }
);

module.exports = server.exports();
