$(function() {
    var _storeForm = $('#store-form');
    var _submitBtn = $('#store-submit-btn');
    var _storeName = $('#store-name');
    var _storeClassify = $('#store-classify');
    var _storeDesc = $('#store-desc');
    var _storeAddress = $('#store-address');
    var _currentUserId = $('#currentUserId').val();

    var validator = _storeForm.validate({
        onkeyup: false,
        rules: {
            store_name: {
                required: true,
                rangelength: [1, 10]
            },
            store_address: {
                required: true
            }
        },
        messages: {
            store_name: {
                required: '请输入用户名',
                rangelength: "店铺名称不超过10个字符",
            },
            store_address: {
                required: '请输入地址'
            }
        }
    });

    _submitBtn.on('click', function() {
        if (validator.form() && !_storeForm.find('div').hasClass('error')) {
            _submitBtn.attr('disabled', true);
            $.ajax({
                url: '/user/' + _currentUserId + '/store/open',
                type: 'POST',
                dataType: 'json',
                data: {
                    name: _storeName.val(),
                    classify: _storeClassify.val(),
                    desc: _storeDesc.val(),
                    address: _storeAddress.val()
                },
                success: function(data) {
                    if (data.code == 200) {
                        alert('店铺创建成功，页面将于2秒钟后跳转至您的店铺');
                        window.setTimeout("window.location='/store/" + data.storeId + "'", 2000);
                    } else if (data.code == 403) {
                        alert('您已经拥有了自己的店铺，请勿重复申请!');
                        _submitBtn.attr('disabled', false);
                    } else {
                        alert('服务器出错，请重新修改');
                        _submitBtn.attr('disabled', false);
                    }
                },
                error: function(err) {
                    alert('服务器出错，请重新修改');
                    _submitBtn.attr('disabled', false);
                }
            });
        }
    });
});