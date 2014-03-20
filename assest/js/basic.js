$(function() {
    var $searchBtn = $('.search-button');
    var $searchInput = $('.search-input');
    var $cartNumber = $('.cart-number');

    $searchBtn.on('click', function() {
        window.location.href = '/items?key=' + $searchInput.val();
    });

    $searchInput.keydown(function(event) {
        if (event.which == 13) {
            window.location.href = '/items?key=' + $searchInput.val();
        }
    });

    $.ajax({
        url: '/cart/get',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            if (data.code == 200) {
                $cartNumber.text(data.cartList.length);
            }
        },
        error: function() {
            alert('服务器出错');
        }
    });

});