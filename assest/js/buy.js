$(function() {
    var $buyerId = $('#buyer-id');
    var $subBtn = $('.fa-minus-square-o');
    var $plusBtn = $('.fa-plus-square-o');
    var $inputNumber = $('#buy-number');
    var $priceTotal = $('.buy-item-total');
    var $price = $('.price');
    var $itemPrice = $('#item-price');
    var $buyBtn = $('#buyBtn');

    var $totalPrice = $('.price');
    var $itemTotalPrice = $('.buy-item-total');

    var total = 0;
    for (var i = 0; i < $itemTotalPrice.length; i++) {
        total += parseFloat($itemTotalPrice.eq(i).text());
    }
    $totalPrice.text(total);

    $subBtn.on('click', function() {
        if ($inputNumber.val() <= 1) {
            $inputNumber.val(1);
        } else {
            $inputNumber.val($inputNumber.val() - 1);
            var price = $inputNumber.val() * ($itemPrice).val();
            price = modifyPrice(price);
            $priceTotal.text(price);
            $price.text(price);
        }
    });

    $plusBtn.on('click', function() {
        $inputNumber.val(parseInt($inputNumber.val()) + 1);
        var price = $inputNumber.val() * ($itemPrice).val();
        price = modifyPrice(price);
        $priceTotal.text(price);
        $price.text(price);
    });

    $inputNumber.keyup(function() {
        var rule = /^[0-9]*$/;
        if (!rule.test($inputNumber.val())) {
            $inputNumber.val(1);
        }
        if ($inputNumber.val() == 0 || $inputNumber.val() == '') {
            $inputNumber.val(1);
        }
    });

    $inputNumber.keyup(function() {
        var price = $inputNumber.val() * ($itemPrice).val();
        price = modifyPrice(price);
        $priceTotal.text(price);
        $price.text(price);
    });

    $buyBtn.on('click', function() {
        if (confirm('确认要购买吗？')) {
            $.ajax({
                url: '/order/create',
                type: 'post',
                dataType: 'json',
                data: {
                    orderId: $('#order-id').val(),
                    price: $price.text(),
                    number: $inputNumber.val(),
                    comment: $('#input-comment').val()
                },
                success: function(data) {
                    if (data == 200) {
                        alert('购买成功');
                        window.location.href = '/user/' + $buyerId.val() + '/orderlist';
                    } else {
                        alert('购买失败');
                    }
                },
                error: function(err) {
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