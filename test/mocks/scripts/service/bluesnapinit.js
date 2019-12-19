var bluesnappinit = function(){};

function serviceResponce(text, url){
    var result = {
        headers    : 'responseHeaders',
        response   : (text && text !== 'null') ? text : JSON.stringify({ test: 'tests'}),
        statusCode : 200
    };

    switch (url) {
        case 'https://sandbox.bluesnap.com/services/2/payment-fields-tokens':
            result = {
                status : 'OK',
                object : {
                    headers: {
                        Location: ['https://sandbox.bluesnap.com/services/2/payment-fields-tokens/HostedFieldsToken']
                    }
                }
            };
            break;

        case 'https://sandbox.bluesnap.com/services/2/wallets/visa/apikey':
            result.headers = {
                Location: ['https://sandbox.bluesnap.com/services/2/wallets/visa/apikey/TestVisaAPIKey']
            };
            break;

        case 'https://sandbox.bluesnap.com/services/2/vaulted-shoppers/19549046' :
            result.response = JSON.stringify({
                paymentSources: {creditCardInfo: [{
                    billingContactInfo: {
                        firstName : 'FirstName',
                        lastName  : 'LastName'
                    },
                    processingInfo: {
                        avsResponseCodeAddress : 'U',
                        cvvResponseCode        : 'ND',
                        avsResponseCodeName    : 'U',
                        avsResponseCodeZip     : 'U'
                    },
                    creditCard: {
                        expirationYear     : 2020,
                        cardLastFourDigits : '0026',
                        cardFingerprint    : 'a0f6043de947',
                        cardSubType        : 'CREDIT',
                        cardType           : 'VISA',
                        expirationMonth    : 10
                    }
                }]},
                firstName        : 'FirstName',
                lastName         : 'LastName',
                vaultedShopperId : 19549046,
                lastPaymentInfo  : {
                    paymentMethod : 'CC',
                    creditCard    : {
                        cardLastFourDigits : '0026',
                        cardType           : 'VISA',
                        cardCategory       : 'CLASSIC'
                    }
                }
            });
            break;

        default:
            break;
    }

    return result;
};

bluesnappinit.init = function(){
    return new bluesnappinit();
};
bluesnappinit.prototype.url = null;
bluesnappinit.prototype.requestMethod = null;
bluesnappinit.prototype.setRequestMethod = function(requestMethod){ this.requestMethod = requestMethod };
bluesnappinit.prototype.setURL = function(url){ this.url = url };
bluesnappinit.prototype.getClient = function(){
    return {
        getResponseHeader: function(){
            return new String('application/json');
        }
    }
};
bluesnappinit.prototype.call = function(text) {
    return serviceResponce(text, this.url);
}
bluesnappinit.prototype.setThrowOnError = function() {
    var serviceURL = this.url;
    var requestMethod = this.requestMethod;
    return {
        call: function(text) {
            return {
                ok           : true,
                object       : serviceResponce(text, serviceURL),
                requestParam : {
                    requestMethod : serviceURL,
                    url           : requestMethod
                }
            };
        }
    };
}

module.exports = bluesnappinit;
