$(function() {
    var $totalPrice = $('.price');
    var $itemTotalPrice = $('.buy-item-total');
    var $buyBtn = $('#buyBtn');
    var $orderId = $('.cart-order-id');
    var $buyerId = $('#buyer-id');

    var total = 0;
    for (var i = 0; i < $itemTotalPrice.length; i++) {
        total += parseFloat($itemTotalPrice.eq(i).text());
    }
    $totalPrice.text(modifyPrice(total));

    $buyBtn.on('click', function() {
        if (confirm('确认要购买吗？')) {
            var orderIdArr = [];
            for (var i = 0; i < $orderId.length; i++) {
                orderIdArr.push($orderId.eq(i).val());
            }
            $.ajax({
                url: '/order/create?many=true',
                type: 'post',
                dataType: 'json',
                data: {
                    orderId: orderIdArr
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