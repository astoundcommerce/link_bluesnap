'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var SiteMock = require('../../../../mocks/dw/system/Site');
var SiteMockObj = new SiteMock();
var bluesnapdata = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/lib/bluesnapdata', {
    'dw/system/Site': SiteMockObj
});

describe('bluesnap module - Test get BlueSnap custom preferences', function () {
    beforeEach(function () {
        SiteMockObj.preferences.custom.bluesnap_Enable = true;
        SiteMockObj.preferences.custom.bluesnap_ACH = true;
        SiteMockObj.preferences.custom.bluesnap_IPNs = true;
        SiteMockObj.preferences.custom.bluesnap_SEPA = true;
        SiteMockObj.preferences.custom.bluesnap_Masterpass = true;
        SiteMockObj.preferences.custom.bluesnap_3DSecure = true;
        SiteMockObj.preferences.custom.bluesnap_HostedPayment = true;
        SiteMockObj.preferences.custom.bluesnap_VisaCheckout = true;
        SiteMockObj.preferences.custom.bluesnap_LATAM = true;
        SiteMockObj.preferences.custom.bluesnap_FraudDeviceData = true;
        SiteMockObj.preferences.custom.bluesnap_FraudEnterprise = true;
        SiteMockObj.preferences.custom.bluesnap_softDescriptor = 'Soft_Descriptor';
        SiteMockObj.preferences.custom.bluesnap_Instance = 'sandbox';
        SiteMockObj.preferences.custom.bluesnap_CreditDebit = 'Auth and Capture';
        SiteMockObj.preferences.custom.bluesnap_SiteId = 'bluesnap_site_id';
        SiteMockObj.preferences.custom.bluesnap_FraudUDFs = '{"udf":[{"udfName":"name_udf_1","udfValue":"value-1"}]}';
    });

    describe('Function return custom BlueSnap preference value', function () {
        it('Check Custom Site preference bluesnap_Enable', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            assert.isTrue(bluesnapdata('Enable'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_Enable = false;
            assert.isNotTrue(bluesnapdata('Enable'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_ACH', function () {
            SiteMockObj.preferences.custom.bluesnap_ACH = true;
            assert.isTrue(bluesnapdata('ACH'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_ACH = false;
            assert.isNotTrue(bluesnapdata('ACH'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_IPNs', function () {
            SiteMockObj.preferences.custom.bluesnap_IPNs = true;
            assert.isTrue(bluesnapdata('IPNs'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_IPNs = false;
            assert.isNotTrue(bluesnapdata('IPNs'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_SEPA', function () {
            SiteMockObj.preferences.custom.bluesnap_SEPA = true;
            assert.isTrue(bluesnapdata('SEPA'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_SEPA = false;
            assert.isNotTrue(bluesnapdata('SEPA'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_Level', function () {
            SiteMockObj.preferences.custom.bluesnap_Level = true;
            assert.isTrue(bluesnapdata('Level'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_Level = false;
            assert.isNotTrue(bluesnapdata('Level'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_Masterpass', function () {
            SiteMockObj.preferences.custom.bluesnap_Masterpass = true;
            assert.isTrue(bluesnapdata('Masterpass'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_Masterpass = false;
            assert.isNotTrue(bluesnapdata('Masterpass'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_GooglePay', function () {
            SiteMockObj.preferences.custom.bluesnap_GooglePay = true;
            assert.isTrue(bluesnapdata('GooglePay'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_GooglePay = false;
            assert.isNotTrue(bluesnapdata('GooglePay'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_3DSecure', function () {
            SiteMockObj.preferences.custom.bluesnap_3DSecure = true;
            assert.isTrue(bluesnapdata('3DSecure'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_3DSecure = false;
            assert.isNotTrue(bluesnapdata('3DSecure'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_HostedPayment', function () {
            SiteMockObj.preferences.custom.bluesnap_HostedPayment = true;
            assert.isTrue(bluesnapdata('HostedPayment'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_HostedPayment = false;
            assert.isNotTrue(bluesnapdata('HostedPayment'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_VisaCheckout', function () {
            SiteMockObj.preferences.custom.bluesnap_VisaCheckout = true;
            assert.isTrue(bluesnapdata('VisaCheckout'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_VisaCheckout = false;
            assert.isNotTrue(bluesnapdata('VisaCheckout'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_ApplePay', function () {
            SiteMockObj.preferences.custom.bluesnap_ApplePay = true;
            assert.isTrue(bluesnapdata('ApplePay'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_ApplePay = false;
            assert.isNotTrue(bluesnapdata('ApplePay'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_LATAM', function () {
            SiteMockObj.preferences.custom.bluesnap_LATAM = true;
            assert.isTrue(bluesnapdata('LATAM'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_LATAM = false;
            assert.isNotTrue(bluesnapdata('LATAM'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_FraudDeviceData', function () {
            SiteMockObj.preferences.custom.bluesnap_FraudDeviceData = true;
            assert.isTrue(bluesnapdata('FraudDeviceData'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_FraudDeviceData = false;
            assert.isNotTrue(bluesnapdata('FraudDeviceData'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_FraudEnterprise', function () {
            SiteMockObj.preferences.custom.bluesnap_FraudEnterprise = true;
            assert.isTrue(bluesnapdata('FraudEnterprise'), 'Should be true preference');
            SiteMockObj.preferences.custom.bluesnap_FraudEnterprise = false;
            assert.isNotTrue(bluesnapdata('FraudEnterprise'), 'Should be false preference');
        });

        it('Check Custom Site preference bluesnap_softDescriptor', function () {
            assert.equal(bluesnapdata('softDescriptor'), 'Soft_Descriptor', 'Should be \'Soft_Descriptor\' string');
        });

        it('Check Custom Site preference bluesnap_Instance', function () {
            assert.equal(bluesnapdata('Instance'), 'sandbox', 'Should be \'sandbox\' string');
        });

        it('Check Custom Site preference bluesnap_CreditDebit', function () {
            assert.equal(bluesnapdata('CreditDebit'), 'Auth and Capture', 'Should be \'Auth and Capture\' string');
        });

        it('Check Custom Site preference bluesnap_SiteId', function () {
            assert.equal(bluesnapdata('SiteId'), 'bluesnap_site_id', 'Should be \'bluesnap_site_id\' string');
        });

        it('Check Custom Site preference bluesnap_FraudUDFs', function () {
            let usdPref = '{"udf":[{"udfName":"name_udf_1","udfValue":"value-1"}]}';
            assert.equal(bluesnapdata('FraudUDFs'), usdPref);
        });

    });
});
