'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var TaxMgrMock = require('../../../mocks/dw/order/TaxMgr');
var MoneyMock = require('../../../mocks/dw/value/Money');
var GlobalMock = require('../../../mocks/global');
var OrderMock = require('../../../mocks/dw/order/Order');

var enhancedDataHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/enhancedDataHelper', {
    'dw/order/TaxMgr' : TaxMgrMock,
    'dw/value/Money'  : MoneyMock
});

global.empty = GlobalMock.empty;

describe('enhancedDataHelper module - Test create BlueSnap level3Data object', function () {
    describe('bluesnapGetlevel3Data(): function return BlueSnap level3Data object', function () {
        it('Get level3Data object', function () {
            let cart = new OrderMock();
            let result = {
                customerReferenceNumber : 'Customer_001',
                destinationCountryCode  : 'US',
                destinationZipCode      : '01235',
                discountAmount          : 285,
                dutyAmount              : 0,
                freightAmount           : 30,
                salesTaxAmount          : 20,
                shipFromZipCode         : '36104',
                taxAmount               : 25,
                taxRate                 : 2,
                level3DataItems         : [
                    {
                        commodityCode     : '33383',
                        description       : 'Product Name',
                        discountAmount    : 285,
                        discountIndicator : 'Y',
                        grossNetIndicator : 'Y',
                        itemQuantity      : 5,
                        lineItemTotal     : 15,
                        productCode       : 'Product ID',
                        taxAmount         : 2,
                        taxRate           : 2,
                        taxType           : 'TaxClassID',
                        unitCost          : 315,
                        unitOfMeasure     : 'pounds'
                    }
                ]
            }
            assert.deepEqual(enhancedDataHelper.bluesnapGetlevel3Data(cart), result);
        });
    });
});
