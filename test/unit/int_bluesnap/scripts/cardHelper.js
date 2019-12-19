'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var GlobalMock = require('../../../mocks/global');
var SiteMock = require('../../../mocks/dw/system/Site');
var SiteMockObj = new SiteMock();
var LoggerMock = require('../../../mocks/dw/system/Logger');
var StringUtilsMock = require('../../../mocks/dw/util/StringUtils');
var StatusMock = require('../../../mocks/dw/system/Status');
var bluesnapinitMock = require('../../../mocks/scripts/service/bluesnapinit');
var constants = require('../../../../cartridges/int_bluesnap/cartridge/scripts/constants');
var bluesnapdata = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/lib/bluesnapdata', {
    'dw/system/Site': SiteMockObj
});

var serviceHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/service/serviceHelper', {
    'dw/system/Logger'                 : LoggerMock,
    'dw/util/StringUtils'              : StringUtilsMock,
    'dw/web/Resource'                  : {},
    'dw/system/Status'                 : StatusMock,
    '*/cartridge/scripts/constants.js' : constants
});

var cardHelper = proxyquire('../../../../cartridges/int_bluesnap/cartridge/scripts/cardHelper', {
    '~/cartridge/scripts/service/bluesnapinit.js' : bluesnapinitMock,
    '~/cartridge/scripts/service/serviceHelper'   : serviceHelper,
    '~/cartridge/scripts/lib/bluesnapdata.js'     : bluesnapdata,
    '~/cartridge/scripts/constants.js'            : constants
});

global.empty = GlobalMock.empty;

describe('cardHelper module - Test helper to get BlueSnap credit card operation info', function () {

    describe('bluesnapCardInfo(): function return succesful response verify the details for a specific card number', function () {
        it('Get succesful response BlueSnap details for a specific card number', function () {
            let cardNumber = '4111111111111111';
            let responseOk = {
                cardNumber: '411111'
            };
            assert.deepEqual(cardHelper.bluesnapCardInfo(cardNumber), responseOk);
        });
    });
    
    describe('bluesnapCardRetrieve(): function return succesful response about a past transaction credit card', function () {
        it('Get succesful response about a past BlueSnap transaction credit card', function () {
            let transactionId = 38504784;
            let responseOk = {
                transactionId: 38504784
            };
            assert.deepEqual(cardHelper.bluesnapCardRetrieve(transactionId), responseOk);
        });
    });
});
