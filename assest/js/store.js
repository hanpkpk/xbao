$(function() {
    var $itemTemp = $('#itemTemp');
    var $storeId = $('#currentStoreId');
    var $newItem = $('#newItem');
    var $hotItem = $('#hotItem');
    var $someItem = $('#someItem');

    if ($storeId) {
        $.ajax({
            url: '/store/item/getnew?orderby=0',
            type: 'post',
            dataType: 'json',
            data: {
                storeId: $storeId.val()
            },
            success: function(data) {
                if (data.code == 200) {
                    for (var i = data.itemList.length - 1; i >= 0; i--) {
                        var item = data.itemList[i];
                        var itemImgList = item.imageList;
                        var itemTemp = $itemTemp.clone();
                        itemTemp.attr('id', null);
                        itemTemp.find('.img-store-item').attr('src', itemImgList[0].path);
                        itemTemp.find('.div-item-img').attr('href', '/item/' + item.id);
                        itemTemp.find('.item-name').text(item.name).attr('href', '/item/' + item.id);
                        itemTemp.find('.item-price').text(' ' + item.price);
                        itemTemp.find('.item-sales-volume').text('已售：' + item.salesVolume);
                        $newItem.after(itemTemp);
                    }
                } else {
                    alert('error');
                }
            },
            error: function(err) {
                alert(err);
            }
        });

        $.ajax({
            url: '/store/item/getnew?orderby=1',
            type: 'post',
            dataType: 'json',
            data: {
                storeId: $storeId.val()
            },
            success: function(data) {
                if (data.code == 200) {
                    for (var i = data.itemList.length - 1; i >= 0; i--) {
                        var item = data.itemList[i];
                        var itemImgList = item.imageList;
                        var itemTemp = $itemTemp.clone();
                        itemTemp.attr('id', null);
                        itemTemp.find('.img-store-item').attr('src', itemImgList[0].path);
                        itemTemp.find('.div-item-img').attr('href', '/item/' + item.id);
                        itemTemp.find('.item-name').text(item.name).attr('href', '/item/' + item.id);
                        itemTemp.find('.item-price').text(' ' + item.price);
                        itemTemp.find('.item-sales-volume').text('已售：' + item.salesVolume);
                        $hotItem.after(itemTemp);
                    }
                } else {
                    alert('error');
                }
            },
            error: function(err) {
                alert(err);
            }
        });

        $.ajax({
            url: '/store/item/getnew',
            type: 'post',
            dataType: 'json',
            data: {
                storeId: $storeId.val()
            },
            success: function(data) {
                if (data.code == 200) {
                    for (var i = 0; i < data.itemList.length; i++) {
                        var item = data.itemList[i];
                        var itemImgList = item.imageList;
                        var itemTemp = $itemTemp.clone();
                        itemTemp.attr('id', null);
                        itemTemp.find('.img-store-item').attr('src', itemImgList[0].path);
                        itemTemp.find('.div-item-img').attr('href', '/item/' + item.id);
                        itemTemp.find('.item-name').text(item.name).attr('href', '/item/' + item.id);
                        itemTemp.find('.item-price').text(' ' + item.price);
                        itemTemp.find('.item-sales-volume').text('已售：' + item.salesVolume);
                        $someItem.after(itemTemp);
                    }
                } else {
                    alert('error');
                }
            },
            error: function(err) {
                alert(err);
            }
        });
    }
});