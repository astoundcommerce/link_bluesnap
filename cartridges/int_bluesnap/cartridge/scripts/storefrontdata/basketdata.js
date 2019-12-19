'use strict';

/**
 * Get custom data from Basket for storefront processing
 * @param {dw.order.Basket} basket - basket
 * @returns {Object} - custom basket data to storefront
 */
function basketData(basket) {
    return JSON.stringify({
        amount         : basket.getTotalGrossPrice().value.toString(),
        currency       : basket.getCurrencyCode(),
        billingAddress : {
            test: 'test'// if google has own addresses in account then 
        },
        shippingAddress: {
            test: 'test'
        }
    });
}

module.exports.basketData = basketData;
