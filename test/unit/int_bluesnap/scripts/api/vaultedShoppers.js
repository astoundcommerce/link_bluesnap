'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var GlobalMock = require('../../../../mocks/global');
var SiteMock = require('../../../../mocks/dw/system/Site');
var SiteMockObj = new SiteMock();
var LoggerMock = require('../../../../mocks/dw/system/Logger');
var StringUtilsMock = require('../../../../mocks/dw/util/StringUtils');
var StatusMock = require('../../../../mocks/dw/system/Status');
var constants = require('../../../../../cartridges/int_bluesnap/cartridge/scripts/constants');
var bluesnapinitMock = require('../../../../mocks/scripts/service/bluesnapinit');

var bluesnapdata = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/lib/bluesnapdata', {
    'dw/system/Site': SiteMockObj
});
var serviceHelper = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/service/serviceHelper', {
    'dw/system/Logger'                 : LoggerMock,
    'dw/util/StringUtils'              : StringUtilsMock,
    'dw/web/Resource'                  : {},
    'dw/system/Status'                 : StatusMock,
    '*/cartridge/scripts/constants.js' : constants
});
var paymentAPI = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/models/paymentAPI', {});
var vaultedShoppers = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/api/vaultedShoppers', {
    '*/cartridge/scripts/lib/bluesnapdata.js'   : bluesnapdata,
    '*/cartridge/scripts/constants.js'          : constants,
    '*/cartridge/scripts/service/bluesnapinit'  : bluesnapinitMock,
    '*/cartridge/scripts/service/serviceHelper' : serviceHelper,
    '*/cartridge/scripts/models/paymentAPI'     : paymentAPI
});

global.empty = GlobalMock.empty;

describe('vaultedShoppers module - Test helper to handle BlueSnap vaulted shopper', function () {
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

    describe('getVaultedShopper(): function return succesful response BlueSnap get vaulted shopper', function () {
        it('Get succesful response BlueSnap get vaulted shopper', function () {
            let shopperId = 19549046;
            let responseOk = {
                paymentSources: {creditCardInfo: [{
                    billingContactInfo: {
                        firstName : 'FirstName',
                        lastName  : 'LastName'
                    },
                    processingInfo: {
                        avsResponseCodeAddress : 'U',
                        cvvResponseCode        : 'ND',
                        avsResponseCodeName    : 'U',
                        avsResponseCodeZip     : 'U'
                    },
                    creditCard: {
                        expirationYear     : 2020,
                        cardLastFourDigits : '0026',
                        cardFingerprint    : 'a0f6043de947',
                        cardSubType        : 'CREDIT',
                        cardType           : 'VISA',
                        expirationMonth    : 10
                    }
                }]},
                firstName        : 'FirstName',
                lastName         : 'LastName',
                vaultedShopperId : 19549046,
                lastPaymentInfo  : {
                    paymentMethod : 'CC',
                    creditCard    : {
                        cardLastFourDigits : '0026',
                        cardType           : 'VISA',
                        cardCategory       : 'CLASSIC'
                    }
                }
            };
            assert.deepEqual(vaultedShoppers.getVaultedShopper(shopperId), responseOk);
        });
    });
    describe('createVaultedShopper(): function return succesful response BlueSnap create vaulted shopper', function () {
        it('Get succesful response BlueSnap create vaulted shopper', function () {
            let shopperData = {
                shopperData: 'shopperData'
            };
            let responseOk = {
                object: {
                    shopperData: 'shopperData'
                }
            };
            let response = vaultedShoppers.createVaultedShopper(shopperData);
            assert.equal(response.status, 0);
            assert.equal(response.items[0].status, 0);
            assert.deepEqual(response.items[0].details, responseOk);
        });
    });

    describe('updateVaultedShopper(): function return succesful response BlueSnap for update vaulted shopper', function () {
        it('Get succesful response BlueSnap for update vaulted shopper', function () {
            let shopperId = 'shopperId';
            let shopperData = {
                updateVault: 'newShopperData'
            };
            let responseOk = {
                object: {
                    updateVault: 'newShopperData'
                }
            };
            let response = vaultedShoppers.updateVaultedShopper(shopperId, shopperData);
            assert.equal(response.status, 0);
            assert.equal(response.items[0].status, 0);
            assert.deepEqual(response.items[0].details, responseOk);
        });
    });
    
    describe('getVaultedPaymentsList(): function return succesful response BlueSnap payments list of vaulted shopper', function () {
        it('Get succesful response BlueSnap payments list of vaulted shopper', function () {
            global.customer = {
                registered : true,
                profile    : {
                    custom: {
                        bsVaultedShopperId: 19549046
                    }
                },
            };
            let responseOk = {
                creditCards: [
                    {
                        method: {
                            expirationYear     : 2020,
                            cardLastFourDigits : '0026',
                            cardFingerprint    : 'a0f6043de947',
                            cardSubType        : 'CREDIT',
                            cardType           : 'VISA',
                            expirationMonth    : 10,
                            firstName          : 'FirstName',
                            lastName           : 'LastName'            
                        },
                        paymentData      : 'VISA-0026',
                        paymentSignature : 'FirstName LastName VISA-0026'
                    }
                ],
                ecp  : [],
                sepa : []
            };
            let response = vaultedShoppers.getVaultedPaymentsList();
            assert.deepEqual(response, responseOk);
        });
    });
    
});
