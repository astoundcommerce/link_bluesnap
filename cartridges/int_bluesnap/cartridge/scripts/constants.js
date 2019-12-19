module.exports = {
    sandbox          : 'https://sandbox.bluesnap.com/services/2',
    production       : 'https://ws.bluesnap.com/services/2',
    clientsandbox    : 'https://sandbox.bluesnap.com',
    clientproduction : 'https://ws.bluesnap.com',
    /*
       Public errors are the bluesnap api errors which we can show to user directly
       like 'The payment method is not enabled for your account at this time.'
       when attempting to use SepaDirect payments.
    */
    publicErrorCodes : ['10001']
};
