'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var OrderMock = require('../../../../mocks/dw/order/Order');
var basketdata = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/storefrontdata/basketdata', {});

describe('basketdata - Test to get custom data from Basket for storefront processing', function () {
    it('Get custom Basket data object', function () {
        let basket = new OrderMock();
        let responseOk = {
            amount         : '340',
            currency       : 'USD',
            billingAddress : {
                test: 'test'
            },
            shippingAddress: {
                test: 'test'
            }
        };
        assert.deepEqual(JSON.parse(basketdata.basketData(basket)), responseOk);
    });
});
