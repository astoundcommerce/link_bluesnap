'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var GlobalMock = require('../../../mocks/global');
var SiteMock = require('../../../mocks/dw/system/Site');
var SiteMockObj = new SiteMock();
var OrderMock = require('../../../mocks/dw/order/Order');
var LoggerMock = require('../../../mocks/dw/system/Logger');
var MoneyMock = require('../../../mocks/dw/value/Money');
var TaxMgrMock = require('../../../mocks/dw/order/TaxMgr');
var StringUtilsMock = require('../../../mocks/dw/util/StringUtils');
var StatusMock = require('../../../mocks/dw/system/Status');
var TransactionMock = require('../../../mocks/dw/system/Transaction');
var constants = require('../../../../cartridges/int_bluesnap/cartridge/scripts/constants');
var bluesnapinitMock = require('../../../mocks/scripts/service/bluesnapinit');

var bluesnapdata = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/lib/bluesnapdata', {
    'dw/system/Site': SiteMockObj
});
var fraudHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/fraudHelper', {
    '~/cartridge/scripts/lib/bluesnapdata.js': bluesnapdata
});
var serviceHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/service/serviceHelper', {
    'dw/system/Logger'                 : LoggerMock,
    'dw/util/StringUtils'              : StringUtilsMock,
    'dw/web/Resource'                  : {},
    'dw/system/Status'                 : StatusMock,
    '*/cartridge/scripts/constants.js' : constants
});
var enhancedDataHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/enhancedDataHelper', {
    'dw/order/TaxMgr' : TaxMgrMock,
    'dw/value/Money'  : MoneyMock
});
var payments = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/api/payments', {
    'dw/system/Logger'                            : LoggerMock,
    '*/cartridge/scripts/lib/bluesnapdata.js'     : bluesnapdata,
    '*/cartridge/scripts/service/bluesnapinit.js' : bluesnapinitMock,
    '*/cartridge/scripts/constants.js'            : constants,
    '*/cartridge/scripts/service/serviceHelper'   : serviceHelper,
    '*/cartridge/scripts/fraudHelper.js'          : fraudHelper,
    '*/cartridge/scripts/enhancedDataHelper'      : enhancedDataHelper
});
var paymentAPI = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/models/paymentAPI', {});
var vaultedShoppers = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/api/vaultedShoppers', {
    '*/cartridge/scripts/lib/bluesnapdata.js'   : bluesnapdata,
    '*/cartridge/scripts/constants.js'          : constants,
    '*/cartridge/scripts/service/bluesnapinit'  : bluesnapinitMock,
    '*/cartridge/scripts/service/serviceHelper' : serviceHelper,
    '*/cartridge/scripts/models/paymentAPI'     : paymentAPI
});

var bsPaymentHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/bsPaymentHelper', {
    '*/cartridge/scripts/lib/bluesnapdata.js' : bluesnapdata,
    '*/cartridge/scripts/api/payments'        : payments,
    '*/cartridge/scripts/models/paymentAPI'   : paymentAPI,
    '*/cartridge/scripts/api/vaultedShoppers' : vaultedShoppers,
    'dw/system/Transaction'                   : TransactionMock,
    'dw/system/Status'                        : StatusMock
});

global.empty = GlobalMock.empty;

describe('bsPaymentHelper module - Test helper to handle BlueSnap payment methods in hook', function () {
    beforeEach(function () {
        global.customer = {
            authenticated: false
        };
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

    describe('paymentACH(): function return succesful response BlueSnap ACH handle payment', function () {
        it('Get succesful response BlueSnap ACH handle payment', function () {
            let cart = new OrderMock();
            let ACHForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'authorizeACH' : return true;
                        case 'companyName'  : return 'Company Name';
                        case 'accountNumber': return '4099999992';
                        case 'routingNumber': return '011075150';
                        case 'accountType'  : return 'CONSUMER_CHECKING';
                        default: return null;
                    }
                }
            }
            let responseOk = {
                amount              : 340,
                authorizedByShopper : true,
                currency            : 'USD',
                softDescriptor      : 'Soft_Descriptor',
                ecpTransaction      : {
                    accountNumber : '4099999992',
                    accountType   : 'CONSUMER_CHECKING',
                    routingNumber : '011075150',
                },
                payerInfo: {
                    email     : 'customer@email.com',
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    phone     : 'Customer phone',
                    zip       : '01235'
                },
                transactionFraudInfo: {
                    company          : 'testCompany',
                    enterpriseSiteId : 'bluesnap_site_id',
                    enterpriseUdfs   : {
                        udf: [
                            {
                                udfName  : 'name_udf_1',
                                udfValue : 'value-1'
                            }
                        ]
                    },
                    fraudSessionId      : 'order_uuid',
                    shippingContactInfo : {
                        address1  : 'Customer address 1',
                        address2  : 'Customer address 2',
                        city      : 'City',
                        country   : 'US',
                        firstName : 'Customer name',
                        lastName  : 'Customer surname',
                        state     : 'PE',
                        zip       : '01235'
                    }
                }
            };
            assert.deepEqual(bsPaymentHelper.paymentACH(ACHForm, cart), responseOk);
        });
    });

    describe('paymentCreditDebit(): function return succesful response BlueSnap credit/debit card handle payment', function () {
        it('Get succesful response BlueSnap credit/debit card handle payment', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_HostedPayment = false;
            let cart = new OrderMock();
            let hostedDataToken = null;
            let creditCardForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'vaultCreditCard'      : return null;
                        case 'number'               : return '4111111111111111';
                        case 'cvn'                  : return '421';
                        case 'expiration.month'     : return '05';
                        case 'expiration.year'      : return '21';
                        case 'ownerFirstName'       : return 'ownerFirstName';
                        case 'ownerLastName'        : return 'ownerLastName';
                        case 'ownerZip'             : return '12456';
                        case 'storeInBluesnapVault' : return false;
                        default                     : return null;
                    }
                }
            };

            let responseOk = {
                amount         : 340,
                cardHolderInfo : {
                    email     : 'customer@email.com',
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456'
                },
                cardTransactionType : 'Auth and Capture',
                creditCard          : {
                    cardNumber       : '4111111111111111',
                    cardSecurityCode : '421',
                    expirationMonth  : '05',
                    expirationYear   : '21',
                },
                currency   : 'USD',
                level3Data : {
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
                },
                softDescriptor       : 'Soft_Descriptor',
                transactionFraudInfo : {
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
                }
            };
            assert.deepEqual(bsPaymentHelper.paymentCreditDebit(creditCardForm, hostedDataToken, cart), responseOk);
        });

        it('Get succesful response BlueSnap vault shopper handle payment', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_HostedPayment = false;
            let cart = new OrderMock();
            let hostedDataToken = null;
            let creditCardForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'vaultCreditCard'      : return 'VISA-3462';
                        case 'cvn'                  : return '421';
                        case 'ownerFirstName'       : return 'ownerFirstName';
                        case 'ownerLastName'        : return 'ownerLastName';
                        case 'ownerZip'             : return '12456';
                        case 'storeInBluesnapVault' : return false;
                        default                     : return null;
                    }
                }
            };

            let responseOk = {
                amount         : 340,
                cardHolderInfo : {
                    email     : 'customer@email.com',
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456'
                },
                cardTransactionType : 'Auth and Capture',
                creditCard          : {
                    cardLastFourDigits : '3462',
                    cardType           : 'VISA',
                    securityCode       : '421'
                },
                currency   : 'USD',
                level3Data : {
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
                },
                softDescriptor       : 'Soft_Descriptor',
                transactionFraudInfo : {
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
                }
            };
            assert.deepEqual(bsPaymentHelper.paymentCreditDebit(creditCardForm, hostedDataToken, cart), responseOk);
        });

        it('Get succesful response BlueSnap hosted payment fields handle payment', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_HostedPayment = true;
            let cart = new OrderMock();
            let hostedDataToken = 'HostedDataToken';
            let creditCardForm = {
                getValue: function (fieldName) {
                    switch (fieldName) {
                        case 'vaultCreditCard'      : return null;
                        case 'ownerFirstName'       : return 'ownerFirstName';
                        case 'ownerLastName'        : return 'ownerLastName';
                        case 'ownerZip'             : return '12456';
                        case 'storeInBluesnapVault' : return false;
                        default                     : return null;
                    }
                },
                get: function(fieldName) {
                    let val = this.getValue(fieldName);
                    return {
                        value: function() { return val }
                    }
                }
            };

            let responseOk = {
                amount         : 340,
                cardHolderInfo : {
                    email     : 'customer@email.com',
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456'
                },
                cardTransactionType : 'Auth and Capture',
                pfToken             : 'HostedDataToken',
                currency            : 'USD',
                level3Data          : {
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
                },
                softDescriptor       : 'Soft_Descriptor',
                transactionFraudInfo : {
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
                }
            };
            assert.deepEqual(bsPaymentHelper.paymentCreditDebit(creditCardForm, hostedDataToken, cart), responseOk);
        });
    });
    describe('paymentLatAM(): function return succesful response BlueSnap LatAm credit/debit card handle payment', function () {
        it('Get succesful response BlueSnap LatAm credit/debit card handle payment', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            let cart = new OrderMock();
            let hostedDataToken = null;
            let creditCardForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'vaultLatamCard'               : return null;
                        case 'number'                       : return '4111111111111111';
                        case 'cvn'                          : return '421';
                        case 'expiration.month'             : return '05';
                        case 'expiration.year'              : return '21';
                        case 'personalIdentificationNumber' : return '11.111.111/0001-10';
                        case 'ownerFirstName'               : return 'ownerFirstName';
                        case 'ownerLastName'                : return 'ownerLastName';
                        case 'ownerZip'                     : return '12456';
                        case 'storeInBluesnapVault'         : return false;
                        default                             : return null;
                    }
                },
                get: function(fieldName) {
                    let val = this.getValue(fieldName);
                    return {
                        value: function() { return val }
                    }
                }
            };

            let responseOk = {
                amount         : 340,
                cardHolderInfo : {
                    email                        : 'customer@email.com',
                    firstName                    : 'ownerFirstName',
                    lastName                     : 'ownerLastName',
                    zip                          : '12456',
                    personalIdentificationNumber : '11.111.111/0001-10'
                },
                cardTransactionType : 'Auth and Capture',
                creditCard          : {
                    cardNumber       : '4111111111111111',
                    cardSecurityCode : '421',
                    expirationMonth  : '05',
                    expirationYear   : '21',
                },
                currency   : 'USD',
                level3Data : {
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
                },
                softDescriptor       : 'Soft_Descriptor',
                transactionFraudInfo : {
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
                }
            };            
            assert.deepEqual(bsPaymentHelper.paymentLatAM(creditCardForm, hostedDataToken, cart), responseOk);
        });

        it('Get succesful response BlueSnap LatAm vault credit/debit card handle payment', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            let cart = new OrderMock();
            let hostedDataToken = null;
            let creditCardForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'vaultLatamCard'               : return 'VISA-3462';
                        case 'cvn'                          : return '421';
                        case 'personalIdentificationNumber' : return '11.111.111/0001-10';
                        case 'storeInBluesnapVault'         : return false;
                        default                             : return null;
                    }
                },
                get: function(fieldName) {
                    let val = this.getValue(fieldName);
                    return {
                        value: function() { return val }
                    }
                }
            };

            let responseOk = {
                amount              : 340,
                cardHolderInfo      : null,
                cardTransactionType : 'Auth and Capture',
                creditCard          : {
                    cardLastFourDigits : '3462',
                    cardType           : 'VISA',
                    securityCode       : '421'
                },
                currency   : 'USD',
                level3Data : {
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
                },
                softDescriptor       : 'Soft_Descriptor',
                transactionFraudInfo : {
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
                }
            };            
            assert.deepEqual(bsPaymentHelper.paymentLatAM(creditCardForm, hostedDataToken, cart), responseOk);
        });
    });

    describe('paymentVisaCheckout(): function return succesful response BlueSnap VisaCheckout handle payment', function () {
        it('Get succesful response BlueSnap VisaCheckout handle payment', function () {
            let order = new OrderMock();
            let walletId = 'walletId';
            let orderNo = 'orderNo';
            let responseOk = {
                merchantTransactionId : 'orderNo',
                walletId              : 'walletId',
                amount                : 340,
                currency              : 'USD',
                cardTransactionType   : 'Auth and Capture'
            };
            assert.deepEqual(bsPaymentHelper.paymentVisaCheckout(order, walletId, orderNo), responseOk);
        });
    });

    describe('paymentSEPA(): function return succesful response BlueSnap SEPA handle payment', function () {
        it('Get succesful response BlueSnap SEPA handle payment', function () {
            global.customer = {
                authenticated: false,
            };

            let cart = new OrderMock();
            let SEPAForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'vaultSEPA' : return null;
                        case 'iban'      : return 'DE09100100101234567893';
                        default          : return null;
                    }
                },
                get: function(fieldName) {
                    let val = this.getValue(fieldName);
                    return {
                        value: function() { return val }
                    }
                }
            };

            let responseOk = {
                amount                     : 340,
                authorizedByShopper        : true,
                currency                   : 'USD',
                softDescriptor             : 'Soft_Descriptor',
                sepaDirectDebitTransaction : {
                    iban: 'DE09100100101234567893'
                },
                payerInfo: {
                    email     : 'customer@email.com',
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    phone     : 'Customer phone',
                    zip       : '01235'
                },
                transactionFraudInfo: {
                    company          : 'testCompany',
                    enterpriseSiteId : 'bluesnap_site_id',
                    enterpriseUdfs   : {
                        udf: [
                            {
                                udfName  : 'name_udf_1',
                                udfValue : 'value-1'
                            }
                        ]
                    },
                    fraudSessionId      : 'order_uuid',
                    shippingContactInfo : {
                        address1  : 'Customer address 1',
                        address2  : 'Customer address 2',
                        city      : 'City',
                        country   : 'US',
                        firstName : 'Customer name',
                        lastName  : 'Customer surname',
                        state     : 'PE',
                        zip       : '01235'
                    }
                }
            };
            assert.deepEqual(bsPaymentHelper.paymentSEPA(SEPAForm, cart), responseOk);
        });

        it('Get succesful response BlueSnap vault shopper SEPA handle payment', function () {
            global.customer = {
                authenticated : true,
                getProfile    : function(){
                    return {
                        custom: {
                            bsVaultedShopperId: 'BlueSnap_VaultedShopper_ID'
                        }
                    }
                }
            };
            let cart = new OrderMock();
            let SEPAForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'vaultSEPA' : return 'DE091-7893';
                        default          : return null;
                    }
                },
                get: function(fieldName) {
                    let val = this.getValue(fieldName);
                    return {
                        value: function() { return val }
                    }
                }

            };

            let responseOk = {
                amount                     : 340,
                authorizedByShopper        : true,
                currency                   : 'USD',
                softDescriptor             : 'Soft_Descriptor',
                sepaDirectDebitTransaction : {
                    ibanFirstFour : 'DE091',
                    ibanLastFour  : '7893'
                },
                vaultedShopperId     : 'BlueSnap_VaultedShopper_ID',
                transactionFraudInfo : {
                    company          : 'testCompany',
                    enterpriseSiteId : 'bluesnap_site_id',
                    enterpriseUdfs   : {
                        udf: [
                            {
                                udfName  : 'name_udf_1',
                                udfValue : 'value-1'
                            }
                        ]
                    },
                    fraudSessionId      : 'order_uuid',
                    shippingContactInfo : {
                        address1  : 'Customer address 1',
                        address2  : 'Customer address 2',
                        city      : 'City',
                        country   : 'US',
                        firstName : 'Customer name',
                        lastName  : 'Customer surname',
                        state     : 'PE',
                        zip       : '01235'
                    }
                }
            };
            assert.deepEqual(bsPaymentHelper.paymentSEPA(SEPAForm, cart), responseOk);
        });
    });

    describe('bluesnapApplePayProccessing(): function return succesful response BlueSnap ApplePay handle payment', function () {
        it('Get succesful response BlueSnap ApplePay handle payment', function () {
            let orderNo = 'OrderNo_001';
            let requestObject = {
                cardTransactionType : 'AUTH_CAPTURE',
                amount              : 340,
                currency            : 'USD',
                wallet              : {
                    applePay: {
                        encodedPaymentToken: 'applePay_encoded_token'
                    }
                }
            };

            var responseOk = {
                cardTransactionType : 'AUTH_CAPTURE',
                amount              : 340,
                currency            : 'USD',
                wallet              : {
                    applePay: {
                        encodedPaymentToken: 'applePay_encoded_token'
                    }
                },
                merchantTransactionId: 'OrderNo_001'
            };

            let response = bsPaymentHelper.bluesnapApplePayProccessing(requestObject, orderNo);
            try {
                response = JSON.parse(response);
            } catch (error) {
                response = null;
            };
            assert.deepEqual(response, responseOk);
        });
    });

    describe('saveACHToVault(): function return succesful responce for save ACH payment instrument to vault shopper', function () {
        it('Get succesful response BlueSnap save ACH payment instrument to vault shopper', function () {
            global.customer = {
                registered : true,
                profile    : {
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    custom    : {
                        bsVaultedShopperId: 19549046
                    }
                },
            };

            let ACHForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'authorizeACH' : return true;
                        case 'companyName'  : return 'Company Name';
                        case 'accountNumber': return '4099999992';
                        case 'routingNumber': return '011075150';
                        case 'accountType'  : return 'CONSUMER_CHECKING';
                        default: return null;
                    }
                }
            }

            let bsResponse = {
                amount         : 340,
                currency       : 'USD',
                softDescriptor : 'Soft_Descriptor',
                ecpTransaction : {
                    accountNumber : '4099999992',
                    accountType   : 'CONSUMER_CHECKING',
                    routingNumber : '011075150',
                },
                payerInfo: {
                    email     : 'customer@email.com',
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    phone     : 'Customer phone',
                    zip       : '01235'
                },
                vaultedShopperId : 19549046,
                processingInfo   : {
                    processingStatus: 'PENDING'
                },
                transactionId   : 38504784,
                fraudResultInfo : {
                    deviceDataCollector: 'Y'
                }
            };

            assert.isTrue(bsPaymentHelper.saveACHToVault(bsResponse, ACHForm));
        });
    });

    describe('saveSEPAToVault(): function return succesful responce for save SEPA payment instrument to vault shopper', function () {
        it('Get succesful response BlueSnap save SEPA payment instrument to vault shopper', function () {
            global.customer = {
                registered : true,
                profile    : {
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    custom    : {
                        bsVaultedShopperId: 19549046
                    }
                },
            };

            let SEPAForm = {
                getValue: function(fieldName) {
                    switch (fieldName) {
                        case 'vaultSEPA' : return null;
                        case 'iban'      : return 'DE09100100101234567893';
                        default          : return null;
                    }
                },
                get: function(fieldName) {
                    let val = this.getValue(fieldName);
                    return {
                        value: function() { return val }
                    }
                }
            };

            let bsResponse = {
                amount                     : 340,
                currency                   : 'USD',
                softDescriptor             : 'Soft_Descriptor',
                sepaDirectDebitTransaction : {
                    iban: 'DE09100100101234567893'
                },
                payerInfo: {
                    email     : 'customer@email.com',
                    firstName : 'Customer name',
                    lastName  : 'Customer surname',
                    phone     : 'Customer phone',
                    zip       : '01235'
                },
                vaultedShopperId : 19549046,
                processingInfo   : {
                    processingStatus: 'PENDING'
                },
                transactionId   : 38504784,
                fraudResultInfo : {
                    deviceDataCollector: 'Y'
                }
            };

            assert.isTrue(bsPaymentHelper.saveSEPAToVault(bsResponse, SEPAForm));
        });
    });
});
