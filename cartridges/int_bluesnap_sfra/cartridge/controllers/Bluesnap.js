'use strict';

/* Script Modules */
var paymentsApi = require('*/cartridge/scripts/api/payments.js');
var getBlueSnapPreference = require('*/cartridge/scripts/lib/bluesnapdata.js');
var constants = require('*/cartridge/scripts/constants.js');
var instance = constants['client' + getBlueSnapPreference('Instance')];

var server = require('server');

/**
 *  calls bluesnap for hosted payment field token and renders hostedpayment fields
 */
server.get('HostedFields', server.middleware.https, function (req, res, next) {
    var token = paymentsApi.bluesnapCreateHostedFieldsToken();
    session.privacy.hostedDataToken = token;
    if (token) {
        res.render('bluesnaphosted/sfrahostedpaymentfields',
            {
                token    : token,
                instance : instance
            }
        );
    }
    next();
});

module.exports = server.exports();
