'use strict';

var server = require('server');

server.post('Handle', function (req, res, next) {
    var IPNHelper = require('*/cartridge/scripts/IPNHelper');
    var responseCode = IPNHelper.handleData(req.httpParameterMap);
    
    res.setStatusCode(responseCode);
    return res;
})

module.exports = server.exports();