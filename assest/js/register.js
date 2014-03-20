$(function() {
    var _submitBtn = $('#link-submit');
    var _registerForm = $('#form-register');
    var _registerAccount = $("#input-register-account");
    var _registerPassword = $("#input-register-password");
    var _registerNickname = $("#input-register-nickname");
    var _registerAddress = $("#input-register-address");

    var validator = _registerForm.validate({
        onkeyup: false,
        rules: {
            register_account: {
                required: true,
                rangelength: [5, 12],
                remote: {
                    url: "/register/checkaccount",
                    type: "post",
                    dataType: "json",
                    data: {
                        account: function() {
                            return $("#input-register-account").val();
                        }
                    }
                }
            },
            register_password: {
                required: true,
                rangelength: [6, 16]
            },
            register_confirm_password: {
                required: true,
                equalTo: $('#input-register-password')
            },
            register_nickname: {
                required: true,
                rangelength: [1, 16],
                remote: {
                    url: "/register/checkname",
                    type: "post",
                    dataType: 'json',
                    data: {
                        name: function() {
                            return $("#input-register-nickname").val();
                        }
                    }
                }
            },
            register_address: {
                required: true
            }
        },
        messages: {
            register_account: {
                required: '请输入用户名',
                remote: '用户名已存在',
                rangelength: "帐号需要5-12位",
            },
            register_password: {
                required: '请输入密码',
                rangelength: "密码需要6-16位",
            },
            register_confirm_password: {
                required: '请输入密码',
                equalTo: '密码不一致',
            },
            register_nickname: {
                required: '请输入昵称',
                remote: '昵称已存在',
                rangelength: '昵称不能超过16个字节',
            },
            register_address: {
                required: '请输入地址'
            }
        }
    });

    _registerAccount.on('blur', function() {
        var check = checkname(_registerAccount.val());
        if (!check) {
            if (!_registerAccount.parent().find('.error').hasClass('check')) {
                _registerAccount.after('<div class="error check"><strong>用户名包含不合法字符</strong></div>');
            }
        } else {
            if (_registerAccount.parent().find('.error').hasClass('check')) {
                _registerAccount.parent().find('.check').remove();
            }
        }
    });

    _submitBtn.on('click', function() {
        if (validator.form() && !_registerForm.find('div').hasClass('error')) {
            _registerForm.attr('disabled', true);
            $.ajax({
                url: '/register',
                type: 'POST',
                dataType: 'json',
                data: {
                    account: _registerAccount.val(),
                    password: _registerPassword.val(),
                    nickname: _registerNickname.val(),
                    address: _registerAddress.val()
                },
                success: function(data) {
                    if (data.code == 200) {
                        $('.register-contianer').children().remove();
                        $('.register-contianer').append('<div class="register-success">注册成功。单击<a href="/">此处</a>返回首页</div>');
                    } else {
                        $('.register-contianer').children().remove();
                        $('.register-contianer').append('<div class="register-success">注册失败。请重新尝试</div>');
                    }
                },
                error: function(err) {
                    $('.register-contianer').children().remove();
                    $('.register-contianer').append('<div class="register-success">注册失败。请重新尝试</div>');
                }
            });
        }
    });

    function checkname(name) {
        var re = /^[A-Za-z0-9]+$/;
        if (re.test(name)) {
            return true;
        } else {
            return false;
        }
    }
});