'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var GlobalMock = require('../../../../mocks/global');
var SiteMock = require('../../../../mocks/dw/system/Site');
var SiteMockObj = new SiteMock();
var OrderMock = require('../../../../mocks/dw/order/Order');
var LoggerMock = require('../../../../mocks/dw/system/Logger');
var MoneyMock = require('../../../../mocks/dw/value/Money');
var TaxMgrMock = require('../../../../mocks/dw/order/TaxMgr');
var StringUtilsMock = require('../../../../mocks/dw/util/StringUtils');
var StatusMock = require('../../../../mocks/dw/system/Status');
var constants = require('../../../../../cartridges/int_bluesnap/cartridge/scripts/constants');
var bluesnapinitMock = require('../../../../mocks/scripts/service/bluesnapinit');

var bluesnapdata = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/lib/bluesnapdata', {
    'dw/system/Site': SiteMockObj
});
var fraudHelper = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/fraudHelper', {
    '~/cartridge/scripts/lib/bluesnapdata.js': bluesnapdata
});
var serviceHelper = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/service/serviceHelper', {
    'dw/system/Logger'                 : LoggerMock,
    'dw/util/StringUtils'              : StringUtilsMock,
    'dw/web/Resource'                  : {},
    'dw/system/Status'                 : StatusMock,
    '*/cartridge/scripts/constants.js' : constants
});
var enhancedDataHelper = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/enhancedDataHelper', {
    'dw/order/TaxMgr' : TaxMgrMock,
    'dw/value/Money'  : MoneyMock
});
var payments = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/api/payments', {
    'dw/system/Logger'                            : LoggerMock,
    '*/cartridge/scripts/lib/bluesnapdata.js'     : bluesnapdata,
    '*/cartridge/scripts/service/bluesnapinit.js' : bluesnapinitMock,
    '*/cartridge/scripts/constants.js'            : constants,
    '*/cartridge/scripts/service/serviceHelper'   : serviceHelper,
    '*/cartridge/scripts/fraudHelper.js'          : fraudHelper,
    '*/cartridge/scripts/enhancedDataHelper'      : enhancedDataHelper
});

global.empty = GlobalMock.empty;

describe('payment module - Test BlueSnap API function', function () {
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

    describe('Function return succesful response Retrive transaction', function () {
        it('Check succesful response Bluesnap Card/Wallet Retrive transaction', function () {
            let responseOk = {
                response   : '{\"test\":\"tests\"}',
                headers    : 'responseHeaders',
                statusCode : 200
            };
        
            assert.deepEqual(payments.bluesnapRerieveTransaction('1011582369'), responseOk);
        });
    });

    describe('Function return succesful response BlueSnap CreditDebit', function () {
        it('Check response Bluesnap Card transaction', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = false;
            let cart = null;
            let creditCard = null;
            let storeInBluesnapVault = false;
            assert.isNull(payments.bluesnapCreditDebit(cart, creditCard, storeInBluesnapVault));

            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            global.customer = {
                authenticated : false,
                profile       : {
                    custom: {
                        bsVaultedShopperId: 'ShopperId'
                    }
                }
            };
            cart = new OrderMock();
            creditCard = {
                cardNumber      : '4111111111111111',
                securityCode    : '421',
                expirationMonth : '05',
                expirationYear  : '21',
                ownerInfo       : {
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456',
                    email     : 'ustomer@email.com'
                }
            };

            let responseOk = {
                amount         : 340,
                cardHolderInfo : {
                    email     : 'ustomer@email.com',
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456'
                },
                cardTransactionType : 'Auth and Capture',
                creditCard          : {
                    cardNumber      : '4111111111111111',
                    securityCode    : '421',
                    expirationMonth : '05',
                    expirationYear  : '21',
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
            assert.deepEqual(payments.bluesnapCreditDebit(cart, creditCard, storeInBluesnapVault), responseOk);
        });
    });
            
    describe('Function return succesful response BlueSnap ACH', function () {
        it('Check response Bluesnap ACH transaction', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_ACH = false;
            let cart = null;
            let account = null;
            assert.isNull(payments.bluesnapACH(cart, account));

            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_ACH = true;
            global.customer = {
                authenticated : false,
                profile       : {
                    custom: {
                        bsVaultedShopperId: 'ShopperId'
                    }
                }
            };
            cart = new OrderMock();
            account = {
                authorize     : true,
                companyName   : 'Company Name',
                accountNumber : '4099999992',
                routingNumber : '011075150',
                accountType   : 'CONSUMER_CHECKING'
            };
        
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
            assert.deepEqual(payments.bluesnapACH(cart, account), responseOk);
        });
    });
    describe('Function return succesful response BlueSnap SEPA', function () {
        it('Check response Bluesnap SEPA transaction', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_SEPA = false;
            let cart = null;
            let sepaDirectDebitTransaction = null;
            assert.isNull(payments.bluesnapSEPA(cart, sepaDirectDebitTransaction));

            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_SEPA = true;
            global.customer = {
                authenticated : false,
                profile       : {
                    custom: {
                        bsVaultedShopperId: 'ShopperId'
                    }
                }
            };
            cart = new OrderMock();
            sepaDirectDebitTransaction = {
                iban: 'DE09100100101234567893'
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
            assert.deepEqual(payments.bluesnapSEPA(cart, sepaDirectDebitTransaction), responseOk);
        });
    });
    describe('Function return succesful response BlueSnap create wallet', function () {
        it('Check response Bluesnap create wallet', function () {
            let walletObject = {
                walletType    : 'APPLE_PAY',
                validationUrl : 'https://validUrl',
                domainName    : 'dw.demandware.net',
                displayName   : 'SFCC Site'
            };

            let responseOk = {
                walletType    : 'APPLE_PAY',
                validationUrl : 'https://validUrl',
                domainName    : 'dw.demandware.net',
                displayName   : 'SFCC Site'
            };
            assert.deepEqual(payments.bluesnapCreateWallet(walletObject), responseOk);
        });
    });

    describe('Function return succesful response ApplePay processing', function () {
        it('Check response ApplePay processing', function () {
            let procObj = {
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

            let response = payments.bluesnapApplePayProccessing(procObj);
            try {
                response = JSON.parse(response);
            } catch (error) {
                response = null;
            };
            assert.deepEqual(response, procObj);
        });
    });

    describe('Function return succesful response GooglePay processing', function () {
        it('Check response GooglePay processing', function () {
            let token = 'GooglePay_encoded_token';
            let basket = {
                totalPrice   : '340',
                currencyCode : 'USD'
            }
            let responseOk = {
                amount              : '340',
                cardTransactionType : 'Auth and Capture',
                currency            : 'USD',
                softDescriptor      : 'Soft_Descriptor',
                wallet              : {
                    encodedPaymentToken : 'GooglePay_encoded_token',
                    walletType          : 'GOOGLE_PAY',
                }
            };
            assert.deepEqual(payments.bluesnapProccessingGooglrPay(token, basket), responseOk);
        });
    });

    describe('Function return API key for visa checkout', function () {
        it('Check successful response API key for visa checkout', function () {
            assert.equal(payments.bluesnapVisaCheckoutApiKeyCall(), 'TestVisaAPIKey');
        });
    });

    describe('Function return successful response visa checkout payment', function () {
        it('Check successful response visa checkout payment', function () {
            let walletObject = {
                merchantTransactionId : 'orderNo',
                walletId              : 'walletId',
                amount                : 340,
                currency              : 'USD'
            };
            let responseOk = {
                merchantTransactionId : 'orderNo',
                walletId              : 'walletId',
                amount                : 340,
                currency              : 'USD',
                cardTransactionType   : 'Auth and Capture'
            };
            assert.deepEqual(payments.bluesnapVisaCheckout(walletObject), responseOk);
        });
    });

    describe('Function return succesful response BlueSnap Credit Debit LatAm', function () {
        it('Check response Bluesnap LatAm Card transaction', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = false;
            // SiteMockObj.preferences.custom.bluesnap_LATAM = false;
            let cart = null;
            let creditCard = null;
            let cardHolder = null;
            let storeInBluesnapVault = false;
            assert.isNull(payments.bluesnapLatAm(cart, creditCard, cardHolder, storeInBluesnapVault));
            
            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            global.customer = {
                authenticated : false,
                profile       : {
                    custom: {
                        bsVaultedShopperId: 'ShopperId'
                    }
                }
            };
            cart = new OrderMock();
            creditCard = {
                cardNumber      : '4111111111111111',
                securityCode    : '421',
                expirationMonth : '05',
                expirationYear  : '21',
                ownerInfo       : {
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456',
                    email     : 'ustomer@email.com'
                }
            };
            cardHolder = {
                firstName                    : 'ownerFirstName',
                lastName                     : 'ownerLastName',
                zip                          : '12456',
                personalIdentificationNumber : '11.111.111/0001-10',
                email                        : 'ustomer@email.com'
            };

            let responseOk = {
                amount         : 340,
                cardHolderInfo : {
                    email                        : 'ustomer@email.com',
                    firstName                    : 'ownerFirstName',
                    lastName                     : 'ownerLastName',
                    personalIdentificationNumber : '11.111.111/0001-10',
                    zip                          : '12456'
                },
                cardTransactionType : 'Auth and Capture',
                creditCard          : {
                    cardNumber      : '4111111111111111',
                    securityCode    : '421',
                    expirationMonth : '05',
                    expirationYear  : '21',
                    ownerInfo       : {
                        email     : 'ustomer@email.com',
                        firstName : 'ownerFirstName',
                        lastName  : 'ownerLastName',
                        zip       : '12456'
                    }
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
            assert.deepEqual(payments.bluesnapLatAm(cart, creditCard, cardHolder, storeInBluesnapVault), responseOk);
        });
    });

    describe('Function return successful response Hosted Payment fields payment', function () {
        it('Check successful response Hosted Payment fields payment', function () {
            SiteMockObj.preferences.custom.bluesnap_Enable = false;
            SiteMockObj.preferences.custom.bluesnap_HostedPayment = false;
            let cart = null;
            let hostedData = null;
            let storeInBluesnapVault = false;
            assert.isNull(payments.bluesnapHostedFieldsPaymentCall(cart, hostedData, storeInBluesnapVault));

            SiteMockObj.preferences.custom.bluesnap_Enable = true;
            SiteMockObj.preferences.custom.bluesnap_HostedPayment = true;
            cart = new OrderMock();
            hostedData = {
                cardHolderInfo: {
                    email     : 'ustomer@email.com',
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456',
                    email     : 'ustomer@email.com'
                },
                pfToken: 'hostedDataToken'
            };

            let responseOk = {
                amount         : 340,
                cardHolderInfo : {
                    email     : 'ustomer@email.com',
                    firstName : 'ownerFirstName',
                    lastName  : 'ownerLastName',
                    zip       : '12456'
                },
                cardTransactionType : 'Auth and Capture',
                currency            : 'USD',
                pfToken             : 'hostedDataToken',
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
            assert.deepEqual(payments.bluesnapHostedFieldsPaymentCall(cart, hostedData, storeInBluesnapVault), responseOk);
        });
    });

    describe('Function return BlueSnap payment HostedFields token ID', function () {
        it('Check successful response HostedFields token', function () {
            SiteMockObj.preferences.custom.bluesnap_Instance = 'sandbox';
            assert.equal(payments.bluesnapCreateHostedFieldsToken(), 'HostedFieldsToken');
        });
    });
});
