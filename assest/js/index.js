$(function() {
    var _banner = $(".banner");
    var _allThingDrop = $(".all-thing-dropdown");
    var _allThingList = $('.all-thing-list>ul>li');
    var _allThingDetail = $('.all-thing-detail');
    var _extensionList = $('.ul-extension>li');
    var _extensionContainer = $('.extension-container');
    var _siginForm = $('.signin-form');
    var _singinError = $('.signin-error');
    var _signinAccount = $('#input-signin-account');
    var _signinPassword = $('#input-signin-password');
    var _signinBtn = $('.signin-btn');
    var _isRememberBtn = $('#input-remember');

    $('.bxslider').bxSlider({
        mode: 'fade',
        autoControlsCombine: true,
        auto: true,
        useCSS: false
    });

    $("#owl-example").owlCarousel({
        pagination: false,
        autoPlay: true,
        stopOnHover: true,
        itemsDesktop: [2000, 4]
    });

    $('.bx-controls-direction').hide();

    $('.bx-wrapper').hover(function() {
        $('.bx-controls-direction').show();
    }, function() {
        $('.bx-controls-direction').hide();
    });

    _allThingList.hover(function() {
        var width = _allThingDrop.width() - 1 + 'px';
        var selfClass = '.' + $(this).attr('id');
        $(selfClass).css('left', width);
        $(selfClass).show();
    }, function() {
        var selfClass = '.' + $(this).attr('id');
        var listClass = '#' + $(this).attr('id');
        $(selfClass).hover(function() {
            $(listClass).addClass('active');
            $(selfClass).show();
        }, function() {
            $(selfClass).hide();
            $(listClass).removeClass('active');
        });
        $(selfClass).hide();
    });

    _extensionList.mouseenter(function() {
        var selfClass = '.' + $(this).attr('id');
        if ($(this).text() !== '') {
            _extensionContainer.children().hide();
            _extensionList.removeClass('active');
            $(this).addClass('active');
            $(selfClass).show();
        }
    });

    _signinBtn.on('click', function() {
        if (_signinAccount.val() && _signinPassword.val()) {
            $.ajax({
                url: '/login',
                type: 'POST',
                dataType: 'json',
                data: {
                    account: _signinAccount.val(),
                    password: _signinPassword.val(),
                    is_remember: _isRememberBtn.is(':checked')
                },
                success: function(data) {
                    if (data.code == 200) {
                        window.location.reload();
                    } else if (data.code == 404) {
                        _singinError.text('用户名或密码错误！');
                        _singinError.show();
                    } else {
                        _singinError.text('服务器出错，请重试。');
                        _singinError.show();
                    }
                },
                error: function(data) {
                    _singinError.text('服务器出错，请重试。');
                    _singinError.show();
                }
            });
        } else {
            _singinError.text('帐号或密码不能为空!');
            _singinError.show();
        }
    });

});