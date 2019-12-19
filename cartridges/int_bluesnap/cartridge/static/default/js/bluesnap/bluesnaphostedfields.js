var token;
var instance;
var cardUrl;
var submitButton = null;
var sent = false;
var threeDSecureObj;

/**
 * function add/remove class to tag id 
 * @param {string} tagId - tag ID 
 * @param {string} removeClass - class name to remove
 * @param {string} addClass - class name to add
 */
function changeImpactedElement(tagId, removeClass, addClass) {
    removeClass = removeClass || '';
    addClass = addClass || '';
    $('[data-bluesnap=' + tagId + ']')
        .removeClass(removeClass)
        .addClass(addClass);
}

/**
 * function that takes error code (received from BlueSnap) and returns associated help text
 * @param {string} errorCode - error code
 * @returns {void}
 */
function getErrorText(errorCode) {
    switch (errorCode) {
    case '001':
        return 'Please enter a valid card number';
    case '002':
        return 'Please enter the CVV/CVC of your card';
    case '003':
        return "Please enter your card's expiration date";
    case '22013':
        return 'Card type is not supported by merchant';
    case '400':
        return 'Session expired please refresh page to continue';
    case '403':
    case '404':
    case '500':
        return 'Internal server error please try again later';
    default:
        break;
    }
}


/* Defining bsObj: object that stores Hosted Payment Fields
event handlers, styling, placeholder text, etc. */
var bsObj = {
    onFieldEventHandler: {
        onFocus: function (tagId) {
            // Handle focus
            changeImpactedElement(tagId, 'hosted-field-valid hosted-field-invalid', 'hosted-field-focus');
        },
        onBlur: function (tagId) {
            // Handle blur
            changeImpactedElement(tagId, 'hosted-field-focus');
        },
        onError: function (tagId, errorCode, errorDescription) {
            // Handle error with 3d secure
            // Handle a change in validation
            changeImpactedElement(tagId, 'hosted-field-valid hosted-field-focus', 'hosted-field-invalid');
            $('#' + tagId + '-help').removeClass('helper-text-green').text(errorCode + ' - ' + errorDescription);
        },
        onType: function (tagId, cardType, cardData) {
            // get card type from cardType and display card image
            $('#card-logo > img').attr('src', cardUrl[cardType]);
        },
        onValid: function (tagId) {
            // Handle a change in validation
            changeImpactedElement(tagId, 'hosted-field-focus hosted-field-invalid', 'hosted-field-valid');
            $('#' + tagId + '-help').text('');
        }

    },

    // styling is optional
    style: {
        // Styling all inputs
        input: {
            'font-size'    : '12px',
            'font-family'  : 'Arial,sans-serif',
            'line-height'  : '1',
            color          : '#555',
            'border-color' : 'transparent',
            'border-width' : '0px',
            'border-style' : 'solid',
            height         : '2rem',
            padding        : '0.7em 0.5em',
            width          : '100%'
        },

        select: {
            color          : '#555',
            'border-color' : '#aaa',
            'border-width' : '1px',
            'border-style' : 'solid',
            margin         : '0px',
            height         : '100%',
            width          : '48%'
        },

        // Styling a specific field
        '#month': {
            'margin-right': '2%'
        },

        '#year': {
            'margin-left': '2%'
        },

        // Styling Hosted Payment Field input state
        ':focus': {
            color: '#555'
        }
    },
    '3DS'               : true,
    ccnPlaceHolder      : '4111222233334444',
    cvvPlaceHolder      : '123',
    expPlaceHolder      : 'MM/YY',
    expDropDownSelector : true // set to true for exp. date dropdown
};

/* After DOM is loaded, calling bluesnap.hostedPaymentFieldsCreation: function that takes token and bsObj as inputs and initiates Hosted Payment Fields */
document.addEventListener('DOMContentLoaded', function () {
    var bsinputdata = document.getElementById('bsinputdata');
    var divHostadFields = document.querySelector('div[data-bluesnapsecure]');
    bsObj['3DS'] = divHostadFields.dataset.bluesnapsecure == 'true';
    $('.payment-method[data-method="BLUESNAP_CREDIT_DEBIT"]').find('.cvn').hide();
    token = bsinputdata.dataset.token;
    instance = bsinputdata.dataset.instance;
    var basketData = bsinputdata.dataset.basket;
    try {
        var basket = JSON.parse(basketData);
        threeDSecureObj = {
            amount   : +basket.amount,
            currency : basket.currency
        };
    } catch (error) {
        // Handle error
    }

    bluesnap.hostedPaymentFieldsCreation(token, bsObj);
    sent = false;

    // cardUrl: object that stores card type code and associated card image URL
    cardUrl = {
        AmericanExpress : instance + '/source/web-sdk/hosted-payment-fields/cc-types/amex.png',
        CarteBleau      : instance + '/source/web-sdk/hosted-payment-fields/cc-types/cb.png',
        DinersClub      : instance + '/source/web-sdk/hosted-payment-fields/cc-types/diners.png',
        Discover        : instance + '/source/web-sdk/hosted-payment-fields/cc-types/discover.png',
        JCB             : instance + '/source/web-sdk/hosted-payment-fields/cc-types/jcb.png',
        MaestroUK       : instance + '/source/web-sdk/hosted-payment-fields/cc-types/maestro.png',
        MasterCard      : instance + '/source/web-sdk/hosted-payment-fields/cc-types/mastercard.png',
        Solo            : instance + '/source/web-sdk/hosted-payment-fields/cc-types/solo.png',
        Visa            : instance + '/source/web-sdk/hosted-payment-fields/cc-types/visa.png'
    };

    submitButton = document.querySelector("button[value='Continue to Place Order >']") // Select Submit button for SiteGenesis
                || document.querySelector('.submit-payment'); // Select Submit button for SFRA Site
    submitButton.setAttribute('data-bluesnap', 'submitButton');
    submitButton.addEventListener('click', function (e) {
        if ($('input:radio[value=BLUESNAP_CREDIT_DEBIT]').is(':checked')
            || $('.payment-information').data('payment-method-id') === 'BLUESNAP_CREDIT_DEBIT') {
            if (!sent) {
                e.preventDefault();
                submitButtonClick();
            }
        }
    });
});

/**
 * Calling bluesnap.submitCredentials:
 * function that submits card data to BlueSnap, where it will be associated with token,
 * and calls input function with card data object if submission was successful
 */
function submitButtonClick() {
    // define 3d secure object it can be extended with additional data
    // definition of sfra flag
    var sfra;
    try {
        sfra = $('#blusnapHostedData').data('hostedsfra');
    } catch (e) {
        sfra = false;
    }

    var vaultCardData = $('.js-bluesnap-vault-payment-selector[name$="_BScreditCard_vaultCreditCard"]').val();

    if ((vaultCardData === 'none' || vaultCardData === undefined) || $('.payment-information').data('is-new-payment')) {
        bluesnap.submitCredentials(function (callback) {
            if (callback.error != null) {
                var errorArray = callback.error;
                for (var i in errorArray) {
                    $('#' + errorArray[i].tagId + '-help').text(errorArray[i].errorCode + ' - ' + errorArray[i].errorDescription);
                }
            } else {
                sent = true;
                // we need to have condition here because of single-page application in sfra
                if (!sfra) {
                    submitButton.click();
                }
            }
        }, threeDSecureObj);
    } else {
        sent = true;
        // we need to have condition here because of single-page application in sfra
        if (!sfra) {
            submitButton.click();
        }
    }
}
