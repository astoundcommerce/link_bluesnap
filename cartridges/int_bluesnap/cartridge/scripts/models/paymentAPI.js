'use strict';

/**
 *
 * @typedef {object} ShippingContactInfo
 *
 * @property {string} firstName - First name for shipping. Maximum 100 characters.
 * @property {string} lastName - Last name for shipping. Maximum 100 characters.
 * @property {string} address1 - Address line 1 for shipping. Maximum 100 characters.
 * @property {string} address2 - Address line 2 for shipping. Maximum 100 characters.
 * @property {string} city - City for shipping. Between 2-42 characters.
 * @property {string} state - State code for shipping. See State and province codes
 * @property {string} zip - ZIP code for shipping.
 * @property {string} country - Country code for shipping. See Country codes
 */

/**
 *
 * @typedef {object} ProcessingInfo
 *
 * @property {string} processingStatus - Status of the transaction. _Does not appear in Create/Update Vaulted Shopper responses_
 * 					Value for card transactions:  SUCCESS  
 * 					Values for alt transactions: 
 * 						PayPal  PENDING: PayPal invoice was not yet created SUCCESS FAIL REFUNDED: Invoice was refunded CHARGEBACKED: Invoice was charged back  
 *	 					ACH & SEPA Direct Debit  PENDING: Invoice was not yet approved. SUCCESS: Invoice was approved and the shopper's account was debited. FAIL: Invoice was canceled and the shopper's account was not debited. REFUNDED: Invoice was refunded in response to a chargeback or refund requested by the shopper.
 * 					Values for card & alt transactions in a batch:  SUCCESS FAIL IN_PROGRESS: Batch processing is in progress IN_QUEUE: Batch was created and is waiting to be processed PENDING: Alt transactions only - PayPal invoice was not yet created
 * 					Values for batch transactions:  UPLOADED IN_PROGRESS COMPLETED ERROR RECOVER
 * @property {string} cvvResponseCode - CVV response code for a specific transaction. See CVV response codes
 * @property {string} avsResponseCodeZip - ZIP AVS response code for a specific transaction. See AVS response codes
 * @property {string} avsResponseCodeAddress - Address AVS response code for a specific transaction. See AVS response codes
 * @property {string} avsResponseCodeName - Name AVS response code for a specific transaction. See AVS response codes
 */

/**
 * Details for a specific credit card, such as the card number and expiration date
 * @typedef {object} CreditCard
 *
 * @property {string} cardLastFourDigits - Last four digits of the credit card.
 * @property {string} cardType - Credit card type.
 * @property {string} cardSubType - Card sub-type, such as Credit or Debit
 * @property {string} cardCategory - Card category, such as business or prepaid. Appears only if relevant.
 * @property {number} expirationMonth - Credit card expiration month.  Appears only in responses for Create and Retrieve Vaulted Shopper.
 * @property {number} expirationyear - Credit card expiration 4-digit year.  Appears only in responses for Create and Retrieve Vaulted Shopper.
 * @property {string} issueNumber - Issue number on the credit card.
 */


/**
 * ACH/ECP account details & billing info for vaulted shoppers
 * @typedef {object} EcpInfo
 *
 * @property {BillingContactInfo} billingContactInfo - Container of billingContactInfo properties.
 * @property {Ecp} ecp - Container of ecp properties.
 */

/**
 *
 * @typedef {object} LastPaymentInfo
 *
 * @property {string} paymentMethod - Payment method used for the shopper's most recent purchase.  Value can be:  APPLE_PAY CC ECP PAYPAL SEPA_DIRECT_DEBIT
 * @property {CreditCard} creditCard - Container of creditCard properties.  Appears only if the last payment method was a credit card.
 * @property {Ecp} ecp - Contains ACH/ECP account properties. See ecp.  Appears only if the last payment method was ECP.
 * @property {Wallet} wallet - Contains Apple Pay wallet properties. See wallet.  Appears only if the last payment method was APPLE_PAY.
 * @property {SepaDirectDebit} sepaDirectDebit - Contains sepaDirectDebit properties  Appears only if last payment method was SEPA_DIRECT_DEBIT.
 */

/**
 *
 * @typedef {object} FraudResultInfo
 *
 * @property {string} deviceDataCollector - Indicates whether device data was successfully collected. Y: device data was collected N: device data was not collected, or the fraudSessionId was not sent  For more information, see Device Data Checks.
 */

/**
 * User-defined fields configured in Kount for fraud prevention purposes.
 * @typedef {object} Udf
 *
 * @property {string} udfName - Name
 * @property {string} udfValue - Value
 */

/**
 * Information used for fraud prevention
 * @typedef {object} TransactionFraudInfo
 *
 * @property {string} fraudSessionId - Unique ID of the shopper whose device fingerprint information was collected on the checkout page.  The Fraud Session ID should contain up to 32 alpha-numeric characters only.  For setup info, see Device Data Checks.
 * @property {string} shopperIpAddress - Shopper's IP address. Should be a valid IPv4 or IPv6 address.
 * @property {string} company - Shopper's company name. Maximum 100 characters.
 * @property {ShippingContactInfo} shippingContactInfo - See shippingContactInfo.
 * @property {string} enterpriseSiteId - Site ID configured in Kount. For more information, see Site IDs.
 * @property {Udf[]} enterpriseUdfs - Contains the udf array with one or more udf objects.  For more information about using UDFs for fraud prevention, see user defined fields (UDFs).
 */

/**
 *
 * @typedef {object} VaultedShopper
 *
 * @property {integer} vaultedShopperId - ID of an existing vaulted shopper.
 *
 * @property {string} firstName - Shopper's first name. Maximum 100 characters.
 * @property {string} lastName - Shopper's last name. Maximum 100 characters.
 * @property {string} merchantShopperId - A merchant's ID for a specific shopper, up to 50 characters.
 * @property {string} country - Shopper's country code. See Country codes
 * @property {string} state - Shopper's state code. See State and province codes
 * @property {string} city - Shopper's city. Between 2-42 characters.
 * @property {string} address - Shopper's address line 1. Maximum 100 characters.
 * @property {string} address2 - Shopper's address line 2. Maximum 100 characters.
 * @property {string} email - Shopper's email address.
 * @property {string} zip - Shopper's ZIP code.
 * @property {string} phone - Shopper's phone number. Between 2-36 characters.
 * @property {string} companyName - Shopper's company name
 * @property {string} shopperCurrency - Shopper's currency. See Currency codes.
 * @property {string} personalIdentificationNumber - The shopper's local personal identification number. These are the ID types per country:  Argentina - DNI (length 7-11 chars) Brazil - CPF/CNPJ (length 11-14 chras) Chile - RUN (length 8-9 chars) Colombia - CC (length 6-10 chars) Mexico - CURP/RFC (length 10-18 chars)
 * @property {string} softDescriptor - Description that may appear on the shopper's bank statement when BlueSnap validates the card.
 * @property {string} descriptorPhoneNumber - Merchant's support phone number that may appear on the shopper's bank statement when BlueSnap validates the card.
 *
 * @property {PaymentSources} paymentSources - See paymentSources.
 * @property {LastPaymentInfo} lastPaymentInfo - See lastPaymentInfo.
 * @property {ShippingContactInfo} shippingContactInfo - See shippingContactInfo.
 * @property {TransactionFraudInfo} transactionFraudInfo - See transactionFraudInfo.
 * @property {FraudResultInfo} fraudResultInfo - See fraudResultInfo.
 * 
 * @property {object} walletId - ID of the wallet, obtained via the Create Wallet request.  
 *                    _Note: Applicable for MasterPass and Visa Checkout._
 */

/**
 *
 * @typedef {object} TokenizedCard
 *
 * @property {string} cardLastFourDigits - Last four digits of card used for purchase.
 * @property {string} cardType - Card type used for purchase (e.g. American Express, Mastercard, Visa).
 * @property {string} cardSubType - Type of card used for purchase (e.g. credit, debit).
 * @property {string} dpanExpirationMonth - Card's expiration month (i.e. 1-12).
 * @property {string} dpanExpirationYear - Card's expiration year (e.g. 2025).
 * @property {string} dpanLastFourDigits - Card's last four digits.
 */
/**
 *
 * @typedef {object} ApplePay
 *
 * @property {string} cardLastFourDigits - Last four digits of the credit card.
 * @property {string} cardType - Credit card type.
 * @property {string} cardSubType - Credit card sub-type, such as Credit or Debit.
 * @property {string} dpanLastFourDigits - Last four digits of device account number.
 * @property {string} dpanExpirationMonth - Expiration month of the device account number.
 * @property {string} dpanExpirationYear - Expiration year of the device account number.
 */

/**
 *
 * @typedef {object} Wallet
 *
 * @property {ApplePay} applePay - See applePay.
 * @property {BillingContactInfo} billingContactInfo - See billingContactInfo.
 * @property {TokenizedCard} tokenizedCard - See tokenizedCard.
 */

/**
 *
 * @typedef {object} PaymentSource
 *
 * @property {CreditCardInfo} creditCardInfo - Object containing the following:  billingContactInfo object  creditCard object
 * @property {EcpInfo} ecpInfo - See ecpInfo.
 * @property {SepaDirectDebitInfo} sepaDirectDebitInfo - See sepaDirectDebitInfo.
 * @property {Wallet} wallet - See wallet.
 */

/**
 *
 * @typedef {Object} BillingContactInfo
 *
 * @property {string} firstName - First name for billing. Maximum 100 characters.
 * @property {string} lastName - Last name for billing. Maximum 100 characters.
 * @property {string} address1 - Address line 1 for billing. Maximum 100 characters.
 * @property {string} address2 - Address line 2 for billing. Between 2-42 characters.
 * @property {string} city - City for billing. Between 2-42 characters.
 * @property {string} state - State code for billing. See State and province codes.
 * @property {string} zip - ZIP code for billing. Maximum 20 characters.
 * @property {string} country - Country code for billing. See Country codes.
 * @property {string} personalIdentificationNumber - The shopper's local personal identification number. These are the ID types per country:  Argentina - DNI (length 7-11 chars) Brazil - CPF/CNPJ (length 11-14 chras) Chile - RUN (length 8-9 chars) Colombia - CC (length 6-10 chars) Mexico - CURP/RFC (length 10-18 chars)
 */
function billingContactInfoModel() {
    this.data = Object.create(null);
    this.data.billingContactInfo = Object.create(null);
}

billingContactInfoModel.prototype.setContactPerson = function (firstName, lastName) {
    this.data.billingContactInfo.firstName = firstName;
    this.data.billingContactInfo.lastName = lastName;
};

billingContactInfoModel.prototype.setAdress = function (_address1, _address2, _city, _state, _zip, _country) {
    this.data.billingContactInfo.address1 = _address1 || '';
    this.data.billingContactInfo.address2 = _address2 || '';
    this.data.billingContactInfo.city = _city || '';
    this.data.billingContactInfo.state = _state || '';
    this.data.billingContactInfo.zip = _zip || '';
    this.data.billingContactInfo.country = _country || '';
};

billingContactInfoModel.prototype.getFirstName = function () { return this.data.billingContactInfo.firstName; };
billingContactInfoModel.prototype.getLastName = function () { return this.data.billingContactInfo.lastName; };

/**
 *
 * @typedef {Object} CreditCardInfo
 *
 * @property {CreditCard} creditCard
 * @property {ProcessingInfo} processingInfo
 * @property {BillingContactInfo} billingContactInfo *optional*
 */
function creditCardInfoModel() {
    this.data = {
        creditCard         : {},
        processingInfo     : {},
        billingContactInfo : {}
    };

    /** SETTERS */

    //--------------------------------
    // @param {CreditCard} creditCard
    //--------------------------------
    this.setCreditCard = function (creditCard) { this.data.creditCard = creditCard; };
    this.setExpirationMonth = function (_expirationMonth) { this.data.creditCard.expirationMonth = _expirationMonth; };
    this.setExpirationYear = function (_expirationYear) { this.data.creditCard.expirationYear = _expirationYear; };
    this.setCardNumber = function (_cardNumber) { this.data.creditCard.cardNumber = _cardNumber; };
    this.setSecurityCode = function (_securityCode) { this.data.creditCard.securityCode = _securityCode; };
    this.setDeleteStatus = function () { this.data.status = 'D'; };
    this.setCardType = function (_cardType) { this.data.creditCard.cardType = _cardType; };
    this.setLastFourDigits = function (_lastFour) { this.data.creditCard.cardLastFourDigits = _lastFour; };

    this.setExpirationMonthYear = function (_expirationMonth, _expirationYear) {
        this.data.creditCard.expirationMonth = _expirationMonth;
        this.data.creditCard.expirationYear = _expirationYear;
    };

    this.setBillingContactPerson = function (_firstName, _lastName, _pin) {
        this.data.billingContactInfo.firstName = _firstName;
        this.data.billingContactInfo.lastName = _lastName;
        if (_pin) this.data.billingContactInfo.personalIdentificationNumber = _pin;
    };

    //--------------------------------
    // @returns {CreditCardInfo}
    //--------------------------------
    this.getData = function () { return this.data; };
}

/**
 *
 * @typedef {Object} PaymentSources
 *
 * @property {CreditCardInfo[]} creditCardInfo - Array
 * @property {EcpDetails[]} ecpDetails - Array containing the ecp detail properties. See ecpDetails.
 * @property {SepaDirectDebitInfo[]} sepaDirectDebitInfo - Array containing the following for each payment source (there may be multiple payment sources):  billingContactInfo object optional  sepaDirectDebit object optional
 * @property {EcpInfo} ecpInfo - Contains information about the ACH/ECP account. See ecpInfo.  DEPRECATED: since API v3.0.
 */
function paymentSourcesModel() {
    this.data = Object.create(null);

    this.addCreditCardInfo = function (_creditCardInfo) { 
        if ('creditCardInfo' in this.data === false) {
            this.data.creditCardInfo = [];
        }
        this.data.creditCardInfo.push(_creditCardInfo.data);
    };
    this.addEcpDetails = function (_ecpDetails) {
        if ('ecpDetails' in this.data === false) {
            this.data.ecpDetails = [];
        }
        this.data.ecpDetails.push(_ecpDetails.data);
    };
    this.addSepaDirectDebitInfo = function (_sepaDirectDebitInfo) {
        if ('sepaDirectDebitInfo' in this.data === false) {
            this.data.sepaDirectDebitInfo = [];
        }
        this.data.sepaDirectDebitInfo.push(_sepaDirectDebitInfo.data);
    };

    this.getData = function () { return this.data; };
}

/**
 * 
 * @typedef {Object} VaultedShopper
 * 
 * @param {Object} _data - payment data
 */
function vaultedShopperModel(_data) {
    this.data = _data || Object.create(null);

    /**
     * GET
     */
    /** @returns {VaultedShopper} */

    this.getData = function () { return this.data; };
    this.getFirstName = function () { return this.data.firstName; };
    this.getLastName = function () { return this.data.lastName; };
    this.getSoftDescriptor = function () { return this.data.softDescriptor; };
    this.getCompanyName = function () { return this.data.companyName; };
    this.getPersonalIdentificationNumber = function () { return this.data.personalIdentificationNumber; };

    this.getCreditCardsList = function () {
        var cards = [];
        if (this.data.paymentSources.hasOwnProperty('creditCardInfo')) {
            cards = this.data.paymentSources.creditCardInfo.map(function (data) {
                var card = data.creditCard;
                if (data.hasOwnProperty('billingContactInfo')) {
                    card.firstName = data.billingContactInfo.firstName;
                    card.lastName = data.billingContactInfo.lastName;
                } else {
                    card.firstName = this.data.firstName;
                    card.lastName = this.data.lastName;
                }
                return card;
            }, this);
        }
        return cards;
    };
    this.getEcpDetailsList = function () {
        var details = [];
        if (this.data.paymentSources.hasOwnProperty('ecpDetails')) {
            details = this.data.paymentSources.ecpDetails.map(function (data) {
                var detail = data.ecp;
                if (data.hasOwnProperty('billingContactInfo')) {
                    detail.firstName = data.billingContactInfo.firstName;
                    detail.lastName = data.billingContactInfo.lastName;
                } else {
                    detail.firstName = this.data.firstName;
                    detail.lastName = this.data.lastName;
                }
                return detail;
            }, this);
        }
        return details;
    };
    this.getSepaDirectList = function () {
        var details = [];
        if (this.data.paymentSources.hasOwnProperty('sepaDirectDebitInfo')) {
            details = this.data.paymentSources.sepaDirectDebitInfo.map(function (data) {
                var detail = data.sepaDirectDebit;
                if (data.hasOwnProperty('billingContactInfo')) {
                    detail.firstName = data.billingContactInfo.firstName;
                    detail.lastName = data.billingContactInfo.lastName;
                } else {
                    detail.firstName = this.data.firstName;
                    detail.lastName = this.data.lastName;
                }
                return detail;
            }, this);
        }
        return details;
    };

    /**
     * SET
     */

    this.setData = function (_dataObj) { this.data = _dataObj; };
    this.setPaymentSources = function (_paymentSources) { this.data.paymentSources = _paymentSources.data; };

    this.setSoftDescriptor = function (_softDescriptor) { this.data.softDescriptor = _softDescriptor; };
    this.setFirstName = function (_firstName) { this.data.firstName = _firstName; };
    this.setLastName = function (_lastName) { this.data.lastName = _lastName; };
    this.setName = function (_firstName, _lastName) { this.data.firstName = _firstName; this.data.lastName = _lastName; };
    this.setPhone = function (_phone) { this.data.phone = _phone; };
    this.setZip = function (_zip) { this.data.zip = _zip; };
    this.setAddress = function (_address1, _address2, _city, _state, _zip, _country) {
        this.data.address1 = _address1;
        this.data.address2 = _address2;
        this.data.city = _city;
        this.data.state = _state;
        this.data.zip = _zip;
        this.data.country = _country;
    };
    this.setCompanyName = function (_companyName) { this.data.companyName = _companyName; };
    this.setPersonalIdentificationNumber = function (_pin) { this.data.personalIdentificationNumber = _pin; };


    /* Wallet */
    this.setWalletId = function (_walletId) { this.data.walletId = _walletId; };
    this.getWalletId = function (_walletId) { return this.data.walletId; };
}

/**
 *
 * @typedef {object} SepaDirectDebit
 *
 * @property {string} bic - Bank Identifier Code (BIC).  8 - 12 Alphanumeric characters.
 * @property {string} ibanFirstFour - First four characters of IBAN.
 * @property {string} ibanLastFour - Last four characters of IBAN.
 * @property {string} mandateId - ID used to identify the shopper's acceptance of the SEPA Direct Debit mandate.
 * @property {string} mandateDate - Date (day-month-year) on which the shopper accepted the SEPA Direct Debit mandate. For example: "21-Jul-17"
 * @property {string} preNotificationText - Text for pre-notification email in English.  For example: "The amount of 100.00 EUR will be collected using SEPA Direct Debit with Mandate BS141928 from your bank account IBAN DE09XXXXXX7891 in the next few days. Please ensure sufficient funds in your account"  Note: To get the text in another language, you may use the Get Pre-Notification Text API.
 * @property {string} preNotificationTranslationRef - Get Pre-Notification Text endpoint with transaction ID in query string.  For example: "https://sandbox.bluesnap.com/services/2/translations/sepa/prenotification?transactionid=1011148871"  Note: Specify the desired translation by including the language code in the query string.  For example: "https://sandbox.bluesnap.com/services/2/translations/sepa/prenotification?transactionid=1011148871&language=fr"
 */

/**
 *
 * @typedef {object} Ecp
 *
 * @property {string} accountNumber - Account number.
 * @property {string} routingNumber - Routing number.
 * @property {string} accountType - Account type.  Possible values: CONSUMER_CHECKING CONSUMER_SAVINGS CORPORATE_CHECKING CORPORATE_SAVINGS
 * @property {string} publicAccountNumber - Public account number.
 * @property {string} publicRoutingNumber - Public routing number.
 */

/**
 *
 * @typedef {Object} EcpDetails
 *
 * @property {BillingContactInfo} billingContactInfo - Container of billingContactInfo properties.
 * @property {Ecp} ecp - Container of ecp properties.
 * 
 * @param {Object} _data - payment data
 */
function ecpDetailsModel(_data) {
    this.data = _data || {
        ecp                : {},
        billingContactInfo : {}
    };

    this.setAccountNumber = function (_accountNumber) { this.data.ecp.accountNumber = _accountNumber; };
    this.setRoutingNumber = function (_routingNumber) { this.data.ecp.routingNumber = _routingNumber; };
    this.setAccountType = function (_accountType) { this.data.ecp.accountType = _accountType; };
    this.setPublicAccountNumber = function (_value) { this.data.ecp.publicAccountNumber = _value; };
    this.setPublicRoutingNumber = function (_value) { this.data.ecp.publicRoutingNumber = _value; };
    this.setDeleteStatus = function () { this.data.status = 'D'; };

    this.getAccountNumber = function () { return this.data.ecp.accountNumber; };
    this.getRoutingNumber = function () { return this.data.ecp.routingNumber; };
    this.getAccountType = function () { return this.data.ecp.accountType; };

    this.getPublicAccountNumber = function () { return this.data.ecp.publicAccountNumber; };
    this.getPublicRoutingNumber = function () { return this.data.ecp.publicRoutingNumber; };

    this.getData = function () { return this.data; };
}
ecpDetailsModel.prototype = Object.create(billingContactInfoModel.prototype);

/**
 *
 * @typedef {Object} SepaDirectDebitInfo
 *
 * @property {BillingContactInfo} billingContactInfo - See billingContactInfo.
 * @property {SepaDirectDebit} sepaDirectDebit - See sepaDirectDebit.
 * 
 * @param {Object} _data - payment data
 */
function sepaDirectDebitInfoModel(_data) {
    this.data = _data || {
        sepaDirectDebit    : {},
        billingContactInfo : {}
    };
    this.setIban = function (_value) { this.data.sepaDirectDebit.iban = _value; };
    this.setIbanFirstFour = function (_value) { this.data.sepaDirectDebit.ibanFirstFour = _value; };
    this.setIbanLastFour = function (_value) { this.data.sepaDirectDebit.ibanLastFour = _value; };
    this.setDeleteStatus = function () { this.data.status = 'D'; };

    this.getIban = function () { return this.data.sepaDirectDebit.iban; };
    this.getIbanFirstFour = function () { return this.data.sepaDirectDebit.ibanFirstFour; };
    this.getIbanLastFour = function () { return this.data.sepaDirectDebit.ibanLastFour; };

    this.getData = function () { return this.data; };
}

sepaDirectDebitInfoModel.prototype = Object.create(billingContactInfoModel.prototype);

/* Exports */
module.exports.CreditCardInfoModel = creditCardInfoModel;
module.exports.VaultedShopperModel = vaultedShopperModel;
module.exports.PaymentSourcesModel = paymentSourcesModel;
module.exports.EcpDetailsModel = ecpDetailsModel;
module.exports.SepaDirectDebitInfoModel = sepaDirectDebitInfoModel;
