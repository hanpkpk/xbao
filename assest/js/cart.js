$(function() {
    var $subBtn = $('.fa-minus-square-o');
    var $plusBtn = $('.fa-plus-square-o');
    var $inputNumber = $('.cart-item-number');
    var $itemTotalPrice = $('.cart-item-total');
    var $cartTotalPrice = $('.cart-total-price');
    var $cartSubmitBtn = $('.cart-submit-btn');
    var $cartDelete = $('.cart-delete');
    var $cartCarTotal = $('.cart-car-total');

    var totalPrice = 0;
    for (var i = 0; i < $itemTotalPrice.length; i++) {
        totalPrice += parseFloat($itemTotalPrice.eq(i).text());
    }
    $cartTotalPrice.text(modifyPrice(totalPrice));

    $subBtn.on('click', function() {
        var _this = $(this);
        if (_this.next().val() <= 1) {
            _this.next().val(1);
        } else {
            _this.next().val(_this.next().val() - 1);
            var price = _this.next().val() * _this.parent().parent().prev('.cart-item-price').text();
            price = modifyPrice(price);
            _this.parent().parent().next('.cart-item-total').text(price);
            totalPrice = 0;
            for (var i = 0; i < $itemTotalPrice.length; i++) {
                totalPrice += parseFloat($itemTotalPrice.eq(i).text());
            }
            $cartTotalPrice.text(modifyPrice(totalPrice));
        }
    });

    $plusBtn.on('click', function() {
        var _this = $(this);
        _this.prev().val(parseInt(_this.prev().val()) + 1);
        var price = _this.prev().val() * _this.parent().parent().prev('.cart-item-price').text();
        price = modifyPrice(price);
        _this.parent().parent().next('.cart-item-total').text(price);
        totalPrice = 0;
        for (var i = 0; i < $itemTotalPrice.length; i++) {
            totalPrice += parseFloat($itemTotalPrice.eq(i).text());
        }
        $cartTotalPrice.text(modifyPrice(totalPrice));
    });

    $inputNumber.keydown(function(event) {
        if ((event.which >= 48 && event.which <= 57) || (event.which >= 96 && event.which <= 105)) {
            return;
        } else if (event.which == 8) {
            return;
        } else {
            event.preventDefault();
        }
    });

    $inputNumber.keyup(function(event) {
        var _this = $(this);
        if (_this.val() == '') {
            _this.val(1);
        }
        var price = _this.val() * _this.parent().parent().prev('.cart-item-price').text();
        price = modifyPrice(price);
        _this.parent().parent().next('.cart-item-total').text(price);
        totalPrice = 0;
        for (var i = 0; i < $itemTotalPrice.length; i++) {
            totalPrice += parseFloat($itemTotalPrice.eq(i).text());
        }
        $cartTotalPrice.text(modifyPrice(totalPrice));
    });

    $cartSubmitBtn.on('click', function() {
        if (confirm('确认要提交订单吗？提交后将不可更改。')) {
            var cartArr = [];
            for (var i = 0; i < $inputNumber.length; i++) {
                var obj = {
                    number: $inputNumber.eq(i).val(),
                    itemId: $inputNumber.eq(i).attr('data-item-id'),
                    storeId: $inputNumber.eq(i).attr('data-store-id'),
                    price: $itemTotalPrice.eq(i).text()
                };
                cartArr.push(obj);
            }
            $.ajax({
                url: '/cart/buy',
                type: 'post',
                dataType: 'json',
                data: {
                    item: cartArr
                },
                success: function(data) {
                    window.location.href = '/cart/buy?n=' + data.orderIdList;
                },
                error: function() {
                    alert('服务器错误');
                }
            });
        }
    });

    $cartDelete.on('click', function() {
        var _this = $(this);
        if (confirm('确认要删除该商品吗？')) {
            $.ajax({
                url: '/cart/delete',
                type: 'delete',
                dataType: 'json',
                data: {
                    cartId: _this.attr('data-id')
                },
                success: function(data) {
                    if (data == 200) {
                        _this.parent().parent().remove();
                        if ($('.cart-list-container').find('.cart-list-form').length) {
                            totalPrice = 0;
                            $itemTotalPrice = $('.cart-item-total');
                            for (var i = 0; i < $itemTotalPrice.length; i++) {
                                totalPrice += parseFloat($itemTotalPrice.eq(i).text());
                            }
                            $cartTotalPrice.text(modifyPrice(totalPrice));
                            $cartCarTotal.text(parseInt($cartCarTotal.text()) - 1);
                        } else {
                            $cartCarTotal.parent().empty().append('<div>购物车中没有商品，赶快去<a href="/">添加</a>吧</div>');
                        }
                    } else {
                        alert('服务器出错');
                    }
                },
                error: function() {
                    alert('服务器出错');
                }
            });
        }
    });
});

function modifyPrice(price) {
    price = price.toString();
    if (price.lastIndexOf('.') == -1) {
        return price + '.00';
    } else if (price.length - price.lastIndexOf('.') === 2) {
        return price + '0';
    } else if (price.length - price.lastIndexOf('.') > 3) {
        var newPrice = price.slice(0, price.lastIndexOf('.') + 3);
        return newPrice;
    } else {
        return price;
    }
}