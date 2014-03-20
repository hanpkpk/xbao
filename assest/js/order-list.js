$(function() {
    var $orderCancel = $('.order-cancel');
    var $orderDelete = $('.order-delete-btn');
    var $sellRelease = $('.seller-release');
    var $buyerReceipt = $('.buyer-receipt');
    var $buyerComment = $('.buyer-comment');

    $orderCancel.on('click', function() {
        if (confirm('是否要取消订单？')) {
            var _this = $(this);
            var orderId = $(this).attr('data-orderid');
            $.ajax({
                url: '/order/operate?status=-1',
                type: 'post',
                dataType: 'json',
                data: {
                    orderId: orderId
                },
                success: function(data) {
                    if (data == 200) {
                        _this.parent().prev().find('div').text('交易关闭');
                        _this.parent().next().find('a').attr('data-delete-id', orderId).text('删除');
                        _this.parent().empty();
                    } else {
                        alert('服务器错误');
                    }
                },
                error: function() {
                    alert('服务器错误');
                }
            });
        }
    });

    $orderDelete.on('click', function() {
        if (confirm('是否要删除订单？删除后将不能恢复。')) {
            var _this = $(this);
            var orderId = $(this).attr('data-delete-id');

            $.ajax({
                url: '/order/delete',
                type: 'delete',
                dataType: 'json',
                data: {
                    orderId: orderId
                },
                success: function(data) {
                    if (data == 200) {
                        _this.parents('.order-container').remove();
                    } else {
                        alert('服务器错误');
                    }
                },
                error: function() {
                    alert('服务器错误');
                }
            });
        }
    });

    $sellRelease.on('click', function() {
        if (confirm('确定要发货？')) {
            var _this = $(this);
            var orderId = $(this).attr('data-release-id');

            $.ajax({
                url: '/order/operate?status=3',
                type: 'post',
                dataType: 'json',
                data: {
                    orderId: orderId
                },
                success: function(data) {
                    if (data == 200) {
                        _this.parent().prev().find('div').text('待买家收货');
                        _this.remove();
                    } else {
                        alert('服务器错误');
                    }
                },
                error: function() {
                    alert('服务器错误');
                }
            });
        }
    });

    $buyerReceipt.on('click', function() {
        if (confirm('确定已收到货？')) {
            var _this = $(this);
            var orderId = $(this).attr('data-receipt-id');

            $.ajax({
                url: '/order/operate?status=4',
                type: 'post',
                dataType: 'json',
                data: {
                    orderId: orderId
                },
                success: function(data) {
                    if (data == 200) {
                        _this.parent().prev().find('div').text('待评价');
                        _this.text('评价').removeClass('btn-primary').addClass('btn-default');
                    } else {
                        alert('服务器错误');
                    }
                },
                error: function() {
                    alert('服务器错误');
                }
            });
        }
    });

    $buyerComment.on('click', function() {
        if (confirm('确定给好评？')) {
            var _this = $(this);
            var orderId = $(this).attr('data-comment-id');

            $.ajax({
                url: '/order/operate?status=1',
                type: 'post',
                dataType: 'json',
                data: {
                    orderId: orderId
                },
                success: function(data) {
                    if (data == 200) {
                        _this.parent().prev().find('div').text('交易成功');
                        _this.parent().next().find('a').text('删除');
                        _this.remove();
                    } else {
                        alert('服务器错误');
                    }
                },
                error: function() {
                    alert('服务器错误');
                }
            });
        }
    });
});