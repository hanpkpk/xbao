$(function() {
    var $inputNubmer = $('#input-nubmer');
    var $divDesc = $('#item-description');
    var $btnBuy = $('#btn-buy');
    var $btnAdd = $('#btn-addshop');
    var _currentItemId = $('#currentItemId').val();
    var _currentStoreId = $('#currentStoreId').val();

    $('.bxslider').bxSlider({
        pagerCustom: '#bx-pager',
        adaptiveHeight: true,
    });

    $divDesc.html($divDesc.text());

    $inputNubmer.change(function() {
        if ($inputNubmer.val() <= 0) {
            document.getElementById("input-nubmer").value = "1";
        }
    });

    $btnBuy.on('click', function() {
        $btnBuy.attr('disabled', true);
        $btnAdd.attr('disabled', true);
        $.ajax({
            url: '/item/buy',
            type: 'POST',
            dataType: 'json',
            data: {
                number: $inputNubmer.val(),
                itemId: _currentItemId,
                storeId: _currentStoreId
            },
            success: function(data) {
                if (data.code == 200) {
                    window.location.href = '/item/buy?n=' + data.orderId;
                } else if (data == 403) {
                    alert('不能购买自己的商品！');
                } else if (data == 407) {
                    alert('请先登陆!');
                    window.location.href = '/';
                }
            },
            error: function(err) {
                alert('服务器出错，请重新尝试');
                $btnBuy.attr('disabled', false);
                $btnAdd.attr('disabled', false);
            }
        });
    });
});