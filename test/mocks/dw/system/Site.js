/**
* Represents the current site mock
*/

var Site = function(){};

Site.prototype.getCurrencyCode = function(){};
Site.prototype.getName = function(){};
Site.prototype.getID = function(){};
Site.prototype.getCurrent = function(){
    return new Site();
};
Site.prototype.getPreferences = function(){ 
    return this.preferences;
};
Site.prototype.getHttpHostName = function(){};
Site.prototype.getHttpsHostName = function(){};
Site.prototype.getCustomPreferenceValue = function(prefName) {
    let customPrefs = this.preferences.custom;
    return customPrefs.hasOwnProperty(prefName) ? customPrefs[prefName] : null;

};
Site.prototype.setCustomPreferenceValue = function(){};
Site.prototype.getDefaultLocale = function(){};
Site.prototype.getAllowedLocales = function(){};
Site.prototype.getAllowedCurrencies = function(){};
Site.prototype.getDefaultCurrency = function(){};
Site.prototype.getTimezone = function(){};
Site.prototype.getTimezoneOffset = function(){};
//Site.getCalendar = function(){return new require('../util/Calendar')();};
Site.prototype.isOMSEnabled = function(){};
Site.prototype.currencyCode=null;
Site.prototype.name=null;
Site.prototype.ID=null;
Site.prototype.current=null;
Site.prototype.preferences = {
    custom: {
        bluesnap_Enable          : true,
        bluesnap_ACH             : true,
        bluesnap_IPNs            : true,
        bluesnap_Level           : true,
        bluesnap_Masterpass      : true,
        bluesnap_GooglePay       : true,
        bluesnap_3DSecure        : true,
        bluesnap_HostedPayment   : true,
        bluesnap_VisaCheckout    : true,
        bluesnap_LATAM           : true,
        bluesnap_FraudDeviceData : true,
        bluesnap_FraudEnterprise : true,
        bluesnap_softDescriptor  : 'Soft_Descriptor',
        bluesnap_Instance        : 'sandbox',
        bluesnap_CreditDebit     : 'Auth and Capture',
        bluesnap_SiteId          : 'bluesnap_site_id',
        bluesnap_FraudUDFs       : '{"udf":[{"udfName":"name_udf_1","udfValue":"value-1"}]}'
    }
};
Site.prototype.httpHostName=null;
Site.prototype.httpsHostName=null;
Site.prototype.customPreferenceValue =null;
Site.prototype.defaultLocale=null;
Site.prototype.allowedLocales=null;
Site.prototype.allowedCurrencies=null;
Site.prototype.defaultCurrency=null;
Site.prototype.timezone=null;
Site.prototype.timezoneOffset=null;
Site.prototype.calendar=null;

module.exports = Site;
