/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var paymentsApi = require('*/cartridge/scripts/api/payments.js');
var getBlueSnapPreference = require('*/cartridge/scripts/lib/bluesnapdata.js');
var constants = require('*/cartridge/scripts/constants.js');
var instance = constants['client' + getBlueSnapPreference('Instance')];

/**
 *  calls bluesnap for hosted payment field token and renders hostedpayment fields
 */
function HostedFields() {
    var token = paymentsApi.bluesnapCreateHostedFieldsToken();
    session.privacy.hostedDataToken = token;
    if (token) {
        app.getView({
            token    : token,
            instance : instance
        }).render('bluesnaphosted/hostedpaymentfields');
    }
}

/**
 * ApplePay verification file
 * @returns {boolean} - successful status
 */
function ApplePayVerification() {
    var File = require('dw/io/File');
    var FileReader = require('dw/io/FileReader');

    var f = new File(File.STATIC + '/apple-developer-merchantid-domain-association');
    var readBufferSize = 1024;
    var remainingFileLength = f.length() - 1;
    var reader = new FileReader(f);
    var out = response.writer;
    try {
        while (remainingFileLength > 0) {
            var readLength = Math.min(remainingFileLength, readBufferSize);
            var line = reader.read(readLength);
            out.print(line);
            remainingFileLength -= readLength;
        }
    } catch (e) {
        return false;
    } finally {
        reader.close();
    }
}

exports.HostedFields = guard.ensure(['get', 'https'], HostedFields);
exports.ApplePayVerification = guard.ensure(['get', 'https'], ApplePayVerification);
