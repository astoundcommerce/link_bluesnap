'use strict';

var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');

describe('Handle BluesnapRefundExample controller', function () {
    this.timeout(50000);
    describe('Handle Refund endpoint', function () {
        it('Should be result of refund message', function () {
            var cookieJar = request.jar();

            var myRequest = {
                url                     : config.baseUrl + '/BluesnapRefundExample-Refund',
                method                  : 'GET',
                rejectUnauthorized      : false,
                resolveWithFullResponse : true,
                jar                     : cookieJar,
                headers                 : {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            return request(myRequest)
                .then(function (response) {
                    assert.equal(response.statusCode, 200, 'Expected statusCode to be 200');
                    assert.isString(response.body);
                });
        });
    });
    
    describe('Handle Retrieve endpoint', function () {
        it('Should be result of retrieve message', function () {
            var cookieJar = request.jar();

            var myRequest = {
                url                     : config.baseUrl + '/BluesnapRefundExample-Retrieve',
                method                  : 'GET',
                rejectUnauthorized      : false,
                resolveWithFullResponse : true,
                jar                     : cookieJar,
                headers                 : {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            return request(myRequest)
                .then(function (response) {
                    assert.equal(response.statusCode, 200, 'Expected statusCode to be 200');
                    assert.isString(response.body);
                });
        });
    });
});