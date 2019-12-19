'use strict';

/**
 * Extension of the base module OrderModel
 * See also {@link app_storefront_base/cartridge/models/order.js}
 */
var _super = module.superModule;
var Resource = require('dw/web/Resource');

/**
 * Order class that represents the current order
 * @param {dw.order.LineItemCtnr} lineItemContainer - Current users's basket/order
 * @param {Object} options - The current order's line items
 * @param {Object} options.config - Object to help configure the orderModel
 * @param {string} options.config.numberOfLineItems - helps determine the number of lineitems needed
 * @param {string} options.countryCode - the current request country code
 * @constructor
 */
function OrderModel(lineItemContainer, options) {
    _super.call(this, lineItemContainer, options);
    this.resources.bluesnap = {
        achPaymentMethod  : Resource.msg('msg.payment.type.ach', 'bluesnap', null),
        bankAccountNumber : Resource.msg('msg.payment.bank.accountnumber', 'bluesnap', null),
        bankRoutingNumber : Resource.msg('msg.payment.bank.routingnumber', 'bluesnap', null),
        sepaPaymentMethod : Resource.msg('msg.payment.type.sepa', 'bluesnap', null),
        iban              : Resource.msg('msg.payment.bank.iban', 'bluesnap', null),
        googlePay         : Resource.msg('msg.payment.googlepay', 'bluesnap', null),
        applePay          : Resource.msg('msg.payment.applepay', 'bluesnap', null),
        visacheCkout      : Resource.msg('msg.payment.visacheckout', 'bluesnap', null),
    }
}

module.exports = OrderModel;
