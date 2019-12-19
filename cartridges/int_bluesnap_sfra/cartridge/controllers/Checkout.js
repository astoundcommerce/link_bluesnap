'use strict';

var server = require('server');
var page = module.superModule;
server.extend(page);

server.append(
    'Begin',
    function (req, res, next) {
        var CustomerMgr = require('dw/customer/CustomerMgr');
        var URLUtils = require('dw/web/URLUtils');
        var VaultHelper = require('*/cartridge/scripts/api/vaultedShoppers');
        var vaultedShopper = null;
        var viewData = res.getViewData();

        if (req.currentCustomer.profile) {
            var sfCustomer = CustomerMgr.getCustomerByCustomerNumber(req.currentCustomer.profile.customerNo);
            if (!empty(sfCustomer.profile.custom.bsVaultedShopperId)) {
                var shopper = VaultHelper.getVaultedShopper(sfCustomer.profile.custom.bsVaultedShopperId);
                if (shopper) {
                    vaultedShopper = {
                        firstName   : shopper.firstName || '',
                        lastName    : shopper.lastName || '',
                        creditCards : shopper.paymentSources.hasOwnProperty('creditCardInfo') ? shopper.paymentSources.creditCardInfo : [],
                        ecp         : shopper.paymentSources.hasOwnProperty('ecpDetails') ? shopper.paymentSources.ecpDetails : [],
                        sepa        : shopper.paymentSources.hasOwnProperty('sepaDirectDebitInfo') ? shopper.paymentSources.sepaDirectDebitInfo : []
                    };

                    for (var i = 0; i < vaultedShopper.creditCards.length; i++) {
                        var typeCard = vaultedShopper.creditCards[i].creditCard.cardType.toLowerCase();
                        vaultedShopper.creditCards[i].creditCard.cardTypeImage = URLUtils.staticURL('/images/' + typeCard + '-dark.svg');
                    }
                    viewData.vaultedShopper = vaultedShopper;
                }
            }
        }

        var BasketMgr = require('dw/order/BasketMgr');
        var currentBasket = BasketMgr.getCurrentBasket();
        viewData.Basket = currentBasket;
        res.setViewData(viewData);

        next();
    }
);

module.exports = server.exports();
