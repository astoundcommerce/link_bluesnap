'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var SiteMock = require('../../../../mocks/dw/system/Site');
var StatusMock = require('../../../../mocks/dw/system/Status');
var StringUtilsMock = require('../../../../mocks/dw/util/StringUtils');
var SiteMockObj = new SiteMock();
var LoggerMock = require('../../../../mocks/dw/system/Logger');
var ServiceMock = require('../../../../mocks/scripts/service/service');
var constants = require('../../../../../cartridges/int_bluesnap/cartridge/scripts/constants.js');

var serviceHelper = proxyquire('../../../../../cartridges/int_bluesnap/cartridge/scripts/service/serviceHelper', {
    'dw/system/Logger'                 : LoggerMock,
    'dw/util/StringUtils'              : StringUtilsMock,
    'dw/web/Resource'                  : {},
    'dw/system/Status'                 : StatusMock,
    '*/cartridge/scripts/constants.js' : constants
});

describe('serviceHelper module - Test BlueSnap API response parsing', function () {
    beforeEach(function () {
        SiteMockObj.preferences.custom.bluesnap_Enable = true;
    });

    describe('callService() - function return succesful Bluesnap API response', function () {
        it('Check succesful Bluesnap API response', function () {
            let title = '';
            let serviceOk = ServiceMock.serviceOk;
            let service = new serviceOk();
            let params = {};
            let responseOk = {
                headers    : 'responseHeaders',
                response   : '{\"test\":\"tests\"}',
                statusCode : 200
            };
            assert.deepEqual(serviceHelper.callService(title, service, params), responseOk);
        });
        
        it('Check error Bluesnap API response', function () {
            let title = '';
            let serviceErr = ServiceMock.serviceErr;
            let service = new serviceErr();
            let params = {};
            assert.isNull(serviceHelper.callService(title, service, params));
        });
        
    });

    describe('callJsonService() - function return succesful Bluesnap API response', function () {
        it('Check succesful Bluesnap API response', function () {
            let title = '';
            let serviceOk = ServiceMock.serviceOk;
            let service = new serviceOk();
            let params = {};
            let responseOk = {
                test: 'tests'
            };
            assert.deepEqual(serviceHelper.callJsonService(title, service, params), responseOk);
        });

        it('Check error Bluesnap API response', function () {
            let title = '';
            let serviceErr = ServiceMock.serviceErr;
            let service = new serviceErr();
            let params = {};
            assert.isNull(serviceHelper.callJsonService(title, service, params));
        });
    });

    describe('callJsonServiceExt() - function return extended succesful Bluesnap API response', function () {
        
        it('Check succesful Bluesnap API response', function () {
            let title = '';
            let serviceOk = ServiceMock.serviceOk;
            let service = new serviceOk();
            let params = {};
            let responseOk = {
                object: {
                    test: 'tests'
                }
            };
            let response = serviceHelper.callJsonServiceExt(title, service, params);
            assert.equal(response.status, 0);
            assert.deepEqual(response.items[0].status, 0);
            assert.deepEqual(response.items[0].details, responseOk);
        });

        it('Check error Bluesnap API response', function () {
            let title = '';
            let serviceErr = ServiceMock.serviceErr;
            let service = new serviceErr();
            let params = {};
            let responseErr = {
                bluesnapErrorCodes: ['-1']
            };
            let response = serviceHelper.callJsonServiceExt(title, service, params);
            assert.equal(response.status, 1);
            assert.deepEqual(response.items[0].status, 1);
            assert.deepEqual(response.items[0].details, responseErr);
        });
    });

});
