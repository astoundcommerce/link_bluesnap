/**
* Check object is empty
* @param {Object} obj object
* @returns {boolean} true if object is empty 
*/
function empty(obj) {
    return (obj === null || obj === undefined || obj === '' || (typeof(obj) !== 'function' && obj.length !== undefined && obj.length === 0));
}

/**
 * Constructor global variable Session
 */
function session(){
    this.custom = {
        device        : '',
        checkoutUUID  : 'checkoutId',
        paymentParams : JSON.stringify({
            paymentMethod : 'Card',
            avsResultCode : 'avsResultCode',
            cvvResultCode : '123',
            cardIIN       : '123456'
        })
    };
    this.privacy = {
        gatewayPSD2Response: null
    };
    this.getSessionID = function() {
        return 'sessionID_4565482';
    }
};

var dw = {
    order: {
        PaymentInstrument: {
            METHOD_GIFT_CERTIFICATE : 'METHOD_GIFT_CERTIFICATE',
            METHOD_CREDIT_CARD      : 'METHOD_CREDIT_CARD'
        },
        Order: {
            CONFIRMATION_STATUS_NOTCONFIRMED: 'CONFIRMATION_STATUS_NOTCONFIRMED'
        }
    }
};

var requestBodyString = JSON.stringify({
    order: {
        id     : '001',
        status : 'approved'
    }
});

var request = {
    getHttpRemoteAddress: function() {
        return '192.168.0.12';
    },
    httpHeaders: {
        get: function(key) {
            var result = null;
            switch (key) {
                case 'x-riskified-hmac-sha256':
                    result = requestBodyString + 'riskifiedAuthCode'
                    break;
            
                default:
                    break;
            }
            return result;
        }
    },
    httpParameterMap: {
        requestBodyAsString: requestBodyString
    }
}

module.exports = {
    empty   : empty,
    dw      : dw,
    session : session,
    request : request
}
