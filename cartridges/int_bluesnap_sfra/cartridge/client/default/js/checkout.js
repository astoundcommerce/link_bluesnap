'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('./checkout/checkout'));
    processInclude(require('./bluesnap/billingCreditCard'));
    processInclude(require('./bluesnap/billingACH'));
    processInclude(require('./bluesnap/billingSEPA'));
    processInclude(require('./bluesnap/billingLatam'));
});
