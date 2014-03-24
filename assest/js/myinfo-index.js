$(function() {
    var storeId = $('.user-info-store-id');

    $.ajax({
        url: '/store/item/getnew',
        type: 'post',
        dataType: 'json',
        data: {
            storeId: storeId
        }
    });
});