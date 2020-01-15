'use strict';

/* API Includes */
var TaxMgr = require('dw/order/TaxMgr');
var Money = require('dw/value/Money');

/**
 * @description create level3Data Enhanced data object,
 * such as Level 2 and Level 3 extra information to process the transaction
 * @param {dw.order.Order} cart - Order
 * @returns {Object} - BlueSnap level3Data object
 */
function bluesnapGetlevel3Data(cart) {
    var address = cart.getDefaultShipment().getShippingAddress();
    var merchanTaxClassID = TaxMgr.getDefaultTaxClassID();
    var merchanTaxJurisdictionID = TaxMgr.getDefaultTaxJurisdictionID();
    var level3Data = {};

    // In production, value dutyAmount must be taken from the CRM system of client.
    level3Data.dutyAmount = 0;
    // In production, value shipFromZipCode must be taken from the CRM system of client.
    level3Data.shipFromZipCode = '36104';
    // In production, value taxRate must be taken from the CRM system of client.
    level3Data.taxRate = TaxMgr.getTaxRate(merchanTaxClassID, merchanTaxJurisdictionID);

    level3Data.customerReferenceNumber = !empty(cart.getCustomerNo()) ? cart.getCustomerNo() : ' ';
    level3Data.salesTaxAmount = cart.getAdjustedMerchandizeTotalTax().getValue();
    level3Data.freightAmount = cart.getShippingTotalPrice().getValue();
    level3Data.destinationZipCode = address.postalCode;
    level3Data.destinationCountryCode = address.countryCode.valueOf();
    level3Data.taxAmount = cart.getTotalTax().getValue();

    var level3DataItems = [];
    var productLlineItems = cart.getProductLineItems().iterator(); // Method return an Object of type {dw.util.Iterator} that doesn't have a close() method
    var discountCartTotal = new Money(0, cart.getCurrencyCode());
    var zeroMoney = new Money(0, cart.getCurrencyCode());

    while (productLlineItems.hasNext()) {
        var productLine = productLlineItems.next();
        var discountProductAmount = productLine.getPrice().subtract(productLine.getAdjustedPrice());
        discountCartTotal = discountCartTotal.add(discountProductAmount);

        var level3DataItem = {};

        level3DataItem.lineItemTotal = productLine.getAdjustedPrice().getValue();
        level3DataItem.description = productLine.getProductName();
        level3DataItem.discountAmount = discountProductAmount.getValue();
        level3DataItem.productCode = productLine.getProductID();
        level3DataItem.itemQuantity = productLine.getQuantityValue();
        level3DataItem.taxAmount = productLine.getAdjustedTax().getValue();
        level3DataItem.taxRate = productLine.getTaxRate();
        level3DataItem.unitOfMeasure = productLine.getQuantity().getUnit();
        level3DataItem.commodityCode = !empty(productLine.product) ? productLine.getProduct().getUPC() : '';
        level3DataItem.discountIndicator = !discountProductAmount.equals(zeroMoney) ? 'Y' : 'N';
        level3DataItem.grossNetIndicator = TaxMgr.getTaxationPolicy() == TaxMgr.TAX_POLICY_GROSS ? 'Y' : 'N';
        level3DataItem.taxType = productLine.getTaxClassID();
        level3DataItem.unitCost = productLine.getBasePrice().getValue();

        level3DataItems.push(level3DataItem);
    }

    level3Data.level3DataItems = level3DataItems;
    level3Data.discountAmount = discountCartTotal.getValue();

    return level3Data;
}

exports.bluesnapGetlevel3Data = bluesnapGetlevel3Data;
