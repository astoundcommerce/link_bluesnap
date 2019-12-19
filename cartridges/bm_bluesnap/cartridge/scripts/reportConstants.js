'use strict';

/* API Includes */
var Resource = require('dw/web/Resource');

/**
 * Datasets for query parameters
 * @name  - description of parameter
 * @value - parameter value for query
 */

/* Dataset for query parameter 'accountUpdaterStatus' */
var attrAccountUpdaterStatus = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.acknowledged', 'report', null),
        value : 'A'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.completed', 'report', null),
        value : 'C'
    }
];

/* Dataset for query parameter 'currency' and 'payoutCurrency' */
var attrCurrency = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.currency.usd', 'report', null),
        value : 'USD'
    },
    {
        name  : Resource.msg('report.reportconstants.currency.euro', 'report', null),
        value : 'EUR'
    },
    {
        name  : Resource.msg('report.reportconstants.currency.brl', 'report', null),
        value : 'BRL'
    }
];

/* Dataset for query parameter 'fraudDeclineReason' */
var attrFraudDeclineReason = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.rules', 'report', null),
        value : 'AVS/CVV Rules'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.fraud.thresholds', 'report', null),
        value : 'Configurable Fraud Thresholds'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.fraud.rules', 'report', null),
        value : 'BlueSnap Fraud Rules'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.velocity', 'report', null),
        value : 'Velocity'
    }
];

/* Dataset for query parameter 'invoiceStatus' */
var attrInvoiceStatus = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.approved', 'report', null),
        value : 'Approved'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.canceled', 'report', null),
        value : 'Canceled'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.pending', 'report', null),
        value : 'Pending'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.refunded', 'report', null),
        value : 'Refunded'
    }
];

/* Dataset for query parameter 'paymentType' for DeclinedTransactions type of report */
var attrPaymentTypeDeclined = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.applepay', 'report', null),
        value : 'Apple Pay'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.creditcard', 'report', null),
        value : 'Credit Card'
    }
];

/* Dataset for query parameter 'paymentType' for TransactionDetail type of report */
var attrPaymentTypeTransaction = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.alipay', 'report', null),
        value : 'Alipay'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.applepay', 'report', null),
        value : 'Apple Pay'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.balance', 'report', null),
        value : 'Balance'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.boletobancario', 'report', null),
        value : 'Boleto Bancario'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.businesscheck', 'report', null),
        value : 'Business Check'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.cashiercheck', 'report', null),
        value : 'Cashier Check'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.cashu', 'report', null),
        value : 'cashU'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.creditcard', 'report', null),
        value : 'Credit Card'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.directdebit', 'report', null),
        value : 'Direct Debit'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.electroniccheck', 'report', null),
        value : 'Electronic Check'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.globalCollectcheque', 'report', null),
        value : 'GlobalCollect Cheque'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.localbanktransfer', 'report', null),
        value : 'Local Bank Transfer'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.moneyorder', 'report', null),
        value : 'Money Order'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.none', 'report', null),
        value : 'None'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.offlineelectroniccheck', 'report', null),
        value : 'Offline Electronic Check'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.onlinebanking', 'report', null),
        value : 'Online banking'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.paypal', 'report', null),
        value : 'PayPal'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.paysafecard', 'report', null),
        value : 'PaySafeCard'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.personalcheck', 'report', null),
        value : 'Personal Check'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.purchaseorder', 'report', null),
        value : 'Purchase Order'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.sepedirectdebit', 'report', null),
        value : 'SEPA Direct Debit'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.skrill', 'report', null),
        value : 'Skrill (Moneybookers)'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.ukash', 'report', null),
        value : 'Ukash'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.wallie', 'report', null),
        value : 'Wallie'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.webmoney', 'report', null),
        value : 'WebMoney'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.wiretransfer', 'report', null),
        value : 'Wire Transfer'
    }
];

/* Dataset for query parameter 'period' */
var attrPeriod = [
    {
        name  : Resource.msg('report.reportconstants.attribute.thismonth', 'report', null),
        value : 'THIS_MONTH'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.lastweek', 'report', null),
        value : 'LAST_WEEK'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.lastmonth', 'report', null),
        value : 'LAST_MONTH'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.last3months', 'report', null),
        value : 'LAST_3_MONTHS'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.last6months', 'report', null),
        value : 'LAST_6_MONTHS'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.last12months', 'report', null),
        value : 'LAST_12_MONTHS'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.custom', 'report', null),
        value : 'CUSTOM'
    }
];

/* Dataset for query parameter 'skuType' */
var attrSkuType = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.onetime', 'report', null),
        value : 'ONE_TIME'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.recurring', 'report', null),
        value : 'RECURRING'
    }
];

/* Dataset for query parameter 'transactionType' */
var attrTransactionType = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.sale', 'report', null),
        value : 'SALE'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.refund', 'report', null),
        value : 'REFUND'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.chargeback', 'report', null),
        value : 'CHARGEBACK'
    }
];

/* Dataset for query parameter 'typeOfTransaction' */
var attrTypeOfTransaction = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.cardverification', 'report', null),
        value : 'Card Verification'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.failover', 'report', null),
        value : 'Failover'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.freetrial', 'report', null),
        value : 'Free Trial'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.payment', 'report', null),
        value : 'Payment'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.subscriptionfreetrial', 'report', null),
        value : 'Subscription Free Trial'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.subscriptionrecurringcharge', 'report', null),
        value : 'Subscription Recurring Charge'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.subscriptionretry', 'report', null),
        value : 'Subscription Retry'
    }
];

/* Dataset for query parameter 'vendorStatus' */
var attrVendorStatus = [
    {
        name  : Resource.msg('report.reportconstants.attribute.all', 'report', null),
        value : ''
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.active', 'report', null),
        value : 'Active'
    },
    {
        name  : Resource.msg('report.reportconstants.attribute.inactive', 'report', null),
        value : 'Inactive'
    }
];

/**
 * Datasets Query parameters
 * @name  - description of parameter
 * @value - parameter value for query
 * @type  - type of input field:
 *          0 - hidden field
 *          1 - simple text input field
 *          2 - select input field
 * @type  - dataset of attributes for parameter
 */

/* Query parameter 'accountUpdaterStatus' */
var accountUpdaterStatus = {
    name  : Resource.msg('report.reportconstants.parameter.accountupdaterstatus', 'report', null),
    value : 'accountUpdaterStatus',
    type  : 2,
    data  : attrAccountUpdaterStatus
};

/* Query parameter 'contracts' */
var contracts = {
    name  : Resource.msg('report.reportconstants.parameter.numbersofcontracts', 'report', null),
    value : 'contracts',
    type  : 1
};

/* Query parameter 'fraudDeclineReason' */
var fraudDeclineReason = {
    name  : Resource.msg('report.reportconstants.parameter.frauddeclinereason', 'report', null),
    value : 'fraudDeclineReason',
    type  : 2,
    data  : attrFraudDeclineReason
};

/* Query parameter 'currency' */
var currency = {
    name  : Resource.msg('report.reportconstants.parameter.currency', 'report', null),
    value : 'currency',
    type  : 2,
    data  : attrCurrency
};

/* Query parameter 'invoiceStatus' */
var invoiceStatus = {
    name  : Resource.msg('report.reportconstants.parameter.invoicestatus', 'report', null),
    value : 'invoiceStatus',
    type  : 2,
    data  : attrInvoiceStatus
};

/* Query parameter 'merchantBatchId' */
var merchantBatchId = {
    name  : Resource.msg('report.reportconstants.parameter.merchantbatchid', 'report', null),
    value : 'merchantBatchId',
    type  : 1
};

/* Query parameter 'merchantUpdaterId' */
var merchantUpdaterId = {
    name  : Resource.msg('report.reportconstants.parameter.merchantupdaterid', 'report', null),
    value : 'merchantUpdaterId',
    type  : 1
};

/* Query parameter 'pageSize' */
var pageSize = {
    name      : Resource.msg('report.reportconstants.parameter.rowsinpage', 'report', null),
    value     : 'pageSize',
    initValue : '20',
    type      : 0
};

/* Query parameter 'paymentType' for DeclinedTransactions type of report */
var paymentTypeDeclined = {
    name  : Resource.msg('report.reportconstants.parameter.paymenttype', 'report', null),
    value : 'paymentType',
    type  : 2,
    data  : attrPaymentTypeDeclined
};

/* Query parameter 'paymentType' for TransactionDetail type of report */
var paymentTypeTransaction = {
    name  : Resource.msg('report.reportconstants.parameter.paymenttype', 'report', null),
    value : 'paymentType',
    type  : 2,
    data  : attrPaymentTypeTransaction
};

/* Query parameter 'payoutCurrency' */
var payoutCurrency = {
    name  : Resource.msg('report.reportconstants.parameter.payoutcurrency', 'report', null),
    value : 'payoutCurrency',
    type  : 2,
    data  : attrCurrency
};

/* Query parameter 'payoutCycle' */
var payoutCycle = {
    name  : Resource.msg('report.reportconstants.parameter.payoutcycle', 'report', null),
    value : 'payoutCycle',
    type  : 1
};

/* Query parameter 'period' */
var period = {
    name  : Resource.msg('report.reportconstants.parameter.period', 'report', null),
    value : 'period',
    type  : 2,
    data  : attrPeriod
};

/* Query parameter 'products' */
var products = {
    name  : Resource.msg('report.reportconstants.parameter.numofproducts', 'report', null),
    value : 'products',
    type  : 1
};

/* Query parameter 'skuType' */
var skuType = {
    name  : Resource.msg('report.reportconstants.parameter.skutype', 'report', null),
    value : 'skuType',
    type  : 2,
    data  : attrSkuType
};

/* Query parameter 'transactionType' */
var transactionType = {
    name  : Resource.msg('report.reportconstants.parameter.transactiontype', 'report', null),
    value : 'transactionType',
    type  : 2,
    data  : attrTransactionType
};

/* Query parameter 'typeOfTransaction' */
var typeOfTransaction = {
    name  : Resource.msg('report.reportconstants.parameter.typeoftransaction', 'report', null),
    value : 'typeOfTransaction',
    type  : 2,
    data  : attrTypeOfTransaction
};

/* Query parameter 'forvendorid' */
var forvendorid = {
    name  : Resource.msg('report.reportconstants.parameter.forvendorid', 'report', null),
    value : 'forvendorid',
    type  : 1
};

/* Query parameter 'vendor' */
var vendor = {
    name  : Resource.msg('report.reportconstants.parameter.vendorid', 'report', null),
    value : 'vendor',
    type  : 1
};

/* Query parameter 'vendorStatus' */
var vendorStatus = {
    name  : Resource.msg('report.reportconstants.parameter.vendorstatus', 'report', null),
    value : 'vendorStatus',
    type  : 2,
    data  : attrVendorStatus
};

/**
 * Datasets of report types
 * @name    - parameter value for report query
 * @tabName - tab name in report template
 * @shortDescription - short description of report type
 * @longDescription  - full description of report type
 * @attr    - dataset of attributes for current report type
 */
var reportConfig = [
    {
        name             : 'AccountBalance',
        tabName          : Resource.msg('report.reportconstants.reporttype.accountbalance', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.accountbalance.description', 'report', null),
        attr             : [period, forvendorid]
    },
    {
        name             : 'ActiveSubscriptions',
        tabName          : Resource.msg('report.reportconstants.reporttype.activesubscriptions', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.activesubscriptions.description', 'report', null),
        attr             : [period, vendor, currency, pageSize]
    },
    {
        name             : 'AU_BluesnapVaultCards',
        tabName          : Resource.msg('report.reportconstants.reporttype.bluesnapvaultcards', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.bluesnapvaultcards.description', 'report', null),
        attr             : [period, pageSize]
    },
    {
        name             : 'AU_MerchantVaultCards',
        tabName          : Resource.msg('report.reportconstants.reporttype.merchantvaultvards', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.merchantvaultvards.description', 'report', null),
        attr             : [period, accountUpdaterStatus, merchantBatchId, merchantUpdaterId, pageSize]
    },
    {
        name             : 'CanceledSubscriptions',
        tabName          : Resource.msg('report.reportconstants.reporttype.canceledsubscriptions', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.canceledsubscriptions.description', 'report', null),
        attr             : [period, vendor, currency, pageSize]
    },
    {
        name             : 'DeclinedAuths',
        tabName          : Resource.msg('report.reportconstants.reporttype.declinedauths', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.declinedauths.description', 'report', null),
        attr             : [period, payoutCycle, vendor, typeOfTransaction, currency, pageSize]
    },
    {
        name             : 'DeclinedTransactions',
        tabName          : Resource.msg('report.reportconstants.reporttype.declinedtransactions', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.declinedtransactions.description', 'report', null),
        attr             : [period, vendor, paymentTypeDeclined, pageSize]
    },
    {
        name             : 'DirectDebit',
        tabName          : Resource.msg('report.reportconstants.reporttype.directdebit', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.directdebit.description', 'report', null),
        attr             : [period, vendor, invoiceStatus, pageSize]
    },
    {
        name             : 'PayoutDetail',
        tabName          : Resource.msg('report.reportconstants.reporttype.payoutdetail', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.payoutdetail.description', 'report', null),
        attr             : [period, payoutCurrency, payoutCycle, forvendorid, pageSize]
    },
    {
        name             : 'PayoutSummary',
        tabName          : Resource.msg('report.reportconstants.reporttype.payoutsummary', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.payoutsummary.description', 'report', null),
        attr             : [period, payoutCurrency, payoutCycle, forvendorid]
    },
    {
        name             : 'StoppedFraud',
        tabName          : Resource.msg('report.reportconstants.reporttype.stoppedfraud', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.stoppedfraud.description', 'report', null),
        attr             : [period, fraudDeclineReason]
    },
    {
        name             : 'TransactionDetail',
        tabName          : Resource.msg('report.reportconstants.reporttype.transactiondetail', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.transactiondetail.description', 'report', null),
        attr             : [period, vendor, transactionType, paymentTypeTransaction, skuType, currency, pageSize]
    },
    {
        name             : 'VendorDetails',
        tabName          : Resource.msg('report.reportconstants.reporttype.vendordetails', 'report', null),
        shortDescription : Resource.msg('report.reportconstants.reporttype.vendordetails.description', 'report', null),
        attr             : [vendor, vendorStatus]
    }
];
module.exports.reportConfig = reportConfig;
