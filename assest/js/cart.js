$(function() {
    var $subBtn = $('.fa-minus-square-o');
    var $plusBtn = $('.fa-plus-square-o');
    var $inputNumber = $('.cart-item-number');
    var $itemTotalPrice = $('.cart-item-total');
    var $cartTotalPrice = $('.cart-total-price');
    var $cartSubmitBtn = $('.cart-submit-btn');

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
        $.ajax({
            url: '/item/buy',
            type: 'post',
            dataType: 'json',
            data: {
                number: $inputNubmer.val(),
                itemId: _currentItemId,
                storeId: _currentStoreId
            }
        });
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