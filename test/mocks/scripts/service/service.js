/**
 * Base properties Service
 */
var serviceBase = function(){};
serviceBase.prototype.setRequestMethod = function(){};
serviceBase.prototype.setURL = function(){};
serviceBase.prototype.getURL = function(){};
serviceBase.prototype.getClient = function(){
    return {
        getResponseHeader: function(){
            return new String('application/json');
        }
    }
};

var responseData = JSON.stringify({
    test: 'tests'
});

var responseOk = {
    ok     : true,
    object : {
        response   : responseData,
        headers    : 'responseHeaders',
        statusCode : 200
    }
}

var responseErr = {
    ok           : false,
    error        : 400,
    errorMessage : []
}

/**
 * Service properties with succesful Bluesnap response
 */
var serviceOk = function(){};
serviceOk.prototype = new serviceBase();
serviceOk.prototype.setThrowOnError = function() {
    return {
        call: function(){
            return responseOk;
        }
    };
};
serviceOk.prototype.call = function(){
    return responseOk.object.response;
};

/**
 * Service properties with Error Bluesnap response
 */
var serviceErr = function(){};
serviceErr.prototype = new serviceBase();
serviceErr.prototype.setThrowOnError = function() {
    return {
        call: function(){
            return responseErr;
        }
    };
};

module.exports = {
    serviceOk  : serviceOk,
    serviceErr : serviceErr
};
