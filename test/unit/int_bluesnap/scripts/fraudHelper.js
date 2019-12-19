'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var SiteMock = require('../../../mocks/dw/system/Site');
var GlobalMock = require('../../../mocks/global');
var OrderMock = require('../../../mocks/dw/order/Order');
var SiteMockObj = new SiteMock();
var bluesnapdata = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/lib/bluesnapdata', {
    'dw/system/Site': SiteMockObj
});
var fraudHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/fraudHelper', {
    '~/cartridge/scripts/lib/bluesnapdata.js': bluesnapdata
});

global.empty = GlobalMock.empty;

describe('fraudHelper module - Test create BlueSnap fraud info object', function () {
    beforeEach(function () {
        SiteMockObj.preferences.custom.bluesnap_Enable = true;
        SiteMockObj.preferences.custom.bluesnap_FraudEnterprise = true;
        SiteMockObj.preferences.custom.bluesnap_SiteId ='bluesnap_site_id';
        SiteMockObj.preferences.custom.bluesnap_FraudUDFs = '{"udf":[{"udfName":"name_udf_1","udfValue":"value-1"}]}';
    });

    describe('bluesnapGetFraudInfo(): function return BlueSnap fraud info object', function () {
        it('Get full fraud info object', function () {
            let order = new OrderMock();
            let response = {
                fraudSessionId      : 'order_uuid',
                company             : 'testCompany',
                shippingContactInfo : {
                    zip       : '01235',
                    country   : 'US',
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    city      : 'City',
                    address2  : 'Customer address 2',
                    address1  : 'Customer address 1',
                    state     : 'PE'
                },
                enterpriseSiteId : 'bluesnap_site_id',
                enterpriseUdfs   : {
                    udf: [
                        {
                            udfName  : 'name_udf_1',
                            udfValue : 'value-1'
                        }
                    ]
                }
            };
            assert.deepEqual(fraudHelper.bluesnapGetFraudInfo(order), response);
        });

        it('Get fraud info object without FraudUDFs', function () {
            SiteMockObj.preferences.custom.bluesnap_FraudUDFs = '';
            let order = new OrderMock();
            let response = {
                fraudSessionId      : 'order_uuid',
                company             : 'testCompany',
                shippingContactInfo : {
                    zip       : '01235',
                    country   : 'US',
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    city      : 'City',
                    address2  : 'Customer address 2',
                    address1  : 'Customer address 1',
                    state     : 'PE'
                },
                enterpriseSiteId: 'bluesnap_site_id'
            };
            assert.deepEqual(fraudHelper.bluesnapGetFraudInfo(order), response);
        });

        it('Get fraud info object without fraud enterprise', function () {
            SiteMockObj.preferences.custom.bluesnap_FraudEnterprise = false;
            let order = new OrderMock();
            let response = {
                fraudSessionId      : 'order_uuid',
                company             : 'testCompany',
                shippingContactInfo : {
                    zip       : '01235',
                    country   : 'US',
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    city      : 'City',
                    address2  : 'Customer address 2',
                    address1  : 'Customer address 1',
                    state     : 'PE'
                }
            };
            assert.deepEqual(fraudHelper.bluesnapGetFraudInfo(order), response);
        });
    });
});
