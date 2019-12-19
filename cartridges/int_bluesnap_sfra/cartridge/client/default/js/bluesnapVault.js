'use strict';

var processInclude = require('base/util');

/*
 * Bluesnap Vaulted Shoppers
 */
$(document).ready(function () {
    processInclude(require('./bluesnap/paymentInstruments'));
});
