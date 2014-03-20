$(function() {
    var userSetBtn = $('#user-setting');
    var userSetList = $('.user-setting');
    var _myinfoStore = $('.myinfo-store');
    var _passwordForm = $('.form-modifypassword');
    var _oldPassword = $('#input-oldPassword');
    var _newPassword = $('#input-newPassword');
    var _confirmNewPassword = $('#input-confirm-newPassword');
    var _confirmBtn = $('.btn-confirm-password');
    var _currentUserId = $('#currentUserId').val();

    userSetBtn.hover(function() {
        userSetList.show();
    }, function() {
        userSetList.hide();
    });

    var validator = _passwordForm.validate({
        onkeyup: false,
        rules: {
            old_password: {
                required: true,
                remote: {
                    url: '/user/' + _currentUserId + '/checkpassword',
                    type: "post",
                    dataType: 'json',
                    data: {
                        password: function() {
                            return $("#input-oldPassword").val();
                        }
                    }
                }
            },
            new_password: {
                required: true,
                rangelength: [6, 16]
            },
            confirm_password: {
                required: true,
                equalTo: $('#input-newPassword')
            }
        },
        messages: {
            old_password: {
                required: '请输入原始密码',
                remote: '密码不正确',
            },
            new_password: {
                required: '请输入新密码',
                rangelength: "密码需要6-16位",
            },
            confirm_password: {
                required: '请输入密码',
                equalTo: '密码不一致',
            }
        }
    });

    _confirmBtn.on('click', function() {
        if (validator.form() && !_passwordForm.find('div').hasClass('error')) {
            _confirmBtn.attr('disabled', true);
            $.ajax({
                url: '/user/' + _currentUserId + '/password',
                type: 'POST',
                dataType: 'json',
                data: {
                    password: _newPassword.val(),
                },
                success: function(data) {
                    if (data.code == 200) {
                        alert('密码修改成功，页面将于2秒钟后跳转至首页');
                        window.setTimeout("window.location='/'", 2000);
                    } else {
                        alert('服务器出错，请重新修改');
                    }
                },
                error: function(err) {
                    alert('服务器出错，请重新修改');
                }
            });
        }
    });

    _myinfoStore.on('click', function() {
        $.ajax({
            url: '/user/store',
            type: 'POST',
            dataType: 'json',
            data: {
                userId: _currentUserId
            },
            success: function(data) {
                if (data.code == 200) {
                    window.location.href = '/store/' + data.store.id;
                } else {
                    alert('还没有店铺，请先拥有自己的店铺');
                    window.location.href = '/store/open';
                }
            },
            error: function(err) {
                alert('服务器出错，请重新修改');
            }
        });
    });
});