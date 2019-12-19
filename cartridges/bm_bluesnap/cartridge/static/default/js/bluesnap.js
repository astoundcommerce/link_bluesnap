(function ($) {
    $(document).ready(function () {
        $("[id^='date_selector_']").change(function () {
            var $customDateBlockId = $(this).attr('id') + '_custom_date';
            var $customDateBlock = $('#' + $customDateBlockId);
            var show = $(this).val() === 'CUSTOM';
            $customDateBlock.css('display', show ? 'block' : 'none');
            $customDateBlock.find('input').each(function () {
                show ? $(this).removeAttr('disabled') : $(this).attr('disabled', 'disabled');
            });
        });
    });
}(jQuery));
