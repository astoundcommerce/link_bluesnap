var TaxMgr = function(){};

TaxMgr.getTaxRate = function(){ return 2 };
TaxMgr.getTaxationPolicy = function(){};
TaxMgr.getTaxJurisdictionID = function(){};
TaxMgr.getDefaultTaxJurisdictionID = function(){ return 0 };
TaxMgr.getDefaultTaxClassID = function(){ return 0 };
TaxMgr.getTaxExemptTaxClassID = function(){};
TaxMgr.getCustomRateTaxClassID = function(){};
TaxMgr.prototype.taxRate=null;
TaxMgr.prototype.taxationPolicy=null;
TaxMgr.prototype.taxJurisdictionID=null;
TaxMgr.prototype.defaultTaxJurisdictionID=null;
TaxMgr.prototype.defaultTaxClassID=null;
TaxMgr.prototype.taxExemptTaxClassID=null;
TaxMgr.prototype.customRateTaxClassID=null;

module.exports = TaxMgr;