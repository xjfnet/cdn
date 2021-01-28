jQuery.extend({

});
jQuery.fn.extend({
    selectByText: function (text) {
        $(this).find('option').each(function () {
            console.log('aaa');
            if ($(this).text().includes(text)) {
                this.selected = true;
                return false;
            }
        });
    },
});