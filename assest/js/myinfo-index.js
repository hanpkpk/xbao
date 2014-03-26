$(function() {
    var storeId = $('.user-info-store-id');
    var $itemSellTemplate = $('#item-sell-template');
    var $itemBuyTemplate = $('#item-buy-template');

    $.ajax({
        url: '/store/item/getnew',
        type: 'post',
        dataType: 'json',
        data: {
            storeId: storeId.val()
        },
        success: function(data) {
            var _sellout = $('.sellout');
            _sellout.find('.loading-img').hide();
            if (data.code == 200) {
                if (data.itemList) {
                    for (var i = 0; i < data.itemList.length; i++) {
                        var itemContainer = $itemSellTemplate.clone();
                        itemContainer.find('a').attr('href', '/item/' + data.itemList[i].id);
                        itemContainer.find('.small-container-image').attr('src', data.itemList[i].imageList[0].path);
                        itemContainer.find('.small-container-name').text(data.itemList[i].name);
                        itemContainer.attr('id', null);
                        _sellout.find('.samll-container').append(itemContainer);
                    }
                } else {
                    _sellout.append('没有正在出售的商品');
                }
            } else {
                _sellout.append('没有正在出售的商品');
            }
        },
        error: function() {
            _sellout.append('服务器未响应');
        }
    });

    $.ajax({
        url: '/cart/get',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            var _shoppingcart = $('.shoppingcart');
            _shoppingcart.find('.loading-img').hide();
            if (data.code == 200) {
                if (data.cartList.length) {
                    for (var i = 0; i < data.cartList.length; i++) {
                        var itemContainer = $itemSellTemplate.clone();
                        itemContainer.find('a').attr('href', '/item/' + data.cartList[i].item.id);
                        itemContainer.find('.small-container-image').attr('src', data.cartList[i].item.imageList[0].path);
                        itemContainer.find('.small-container-name').text(data.cartList[i].item.name);
                        itemContainer.attr('id', null);
                        _shoppingcart.find('.samll-container').append(itemContainer);
                    }
                } else {
                    _shoppingcart.append('购物车中没有商品');
                }
            } else {
                _shoppingcart.append('购物车中没有商品');
            }
        },
        error: function() {
            _shoppingcart.append('服务器未响应');
        }
    });

    $.ajax({
        url: '/order/get',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            var _userinfo = $('.userinfo');
            _userinfo.find('.loading-img').hide();
            if (data.code == 200) {
                if (data.orderList.length) {
                    for (var i = 0; i < data.orderList.length; i++) {
                        var itemContainer = $itemBuyTemplate.clone();
                        var status = '';
                        itemContainer.find('.buy-item-name').attr('href', '/item/' + data.orderList[i].item.id);
                        itemContainer.find('.userinfo-buy-img').attr('src', data.orderList[i].item.imageList[0].path);
                        itemContainer.find('.buy-item-name').text(data.orderList[i].item.name);
                        if (data.orderList[i].status == -1) {
                            status = '交易取消';
                        }
                        if (data.orderList[i].status === 0) {
                            status = '待付款';
                        }
                        if (data.orderList[i].status == 1) {
                            status = '交易成功';
                        }
                        if (data.orderList[i].status == 2) {
                            status = '待卖家发货';
                        }
                        if (data.orderList[i].status == 3) {
                            status = '待收货';
                        }
                        if (data.orderList[i].status == 4) {
                            status = '待评价';
                        }
                        itemContainer.find('.buy-item-status').text(status);
                        itemContainer.find('.buy-item-number').text(data.orderList[i].number);
                        itemContainer.find('.buy-item-price').text('￥' + data.orderList[i].price);
                        itemContainer.attr('id', null);
                        _userinfo.find('.samll-container').append(itemContainer);
                    }
                } else {
                    _userinfo.append('没有已买到的商品');
                }
            } else {
                _userinfo.append('没有已买到的商品');
            }
        },
        error: function() {
            _userinfo.append('服务器未响应');
        }
    });
});