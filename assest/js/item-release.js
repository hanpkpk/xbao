$(function() {
    var _currentStoreId = $('#currentStoreId').val();
    var $itemReleaseForm = $('#form-item-release');
    var $releaseBigClass = $('#item-release-big-class');
    var $releaseSmallClass = $('#item-release-small-class');
    var $releaseItemA = $('.a-item-release');
    var $uploadImgBtn = $('#item-upload-img');
    var $imageContainer = $('.image-container');
    var $imageTemp = $('#imageTemp');
    var $itemReleaseBtn = $('#item-release-btn');
    var $inputPrice = $('#input-item-price');
    var $inputName = $('#input-item-name');
    var $inputKey = $('#input-item-key');
    var $itemDesc = $('#item-desc');

    $releaseItemA.hide();

    var editor = UE.getEditor('item-desc');
    editor.setOpt({
        'initialFrameHeight': 500
    });

    $uploadImgBtn.uploadify({
        'queueSizeLimit': 1,
        'method': 'post',
        'fileObjName': 'imgTmp',
        'fileTypeDesc': 'Image Files',
        'fileTypeExts': '*.gif;*.jpg;*.png',
        'buttonText': '上传图片',
        'buttonClass': 'upload-position',
        'swf': '/assest/vendor/uploadify/uploadify.swf',
        'uploader': '/item/img/temp',
        'onUploadSuccess': function(file, data, response) {
            var $itemImg = $('.row>.col-xs-3>.thumbnail>.item-img');
            var $imgDeleteBtn = $('.row>.col-xs-3>.thumbnail>a>.item-img-delete');
            for (var i = 0; i < $itemImg.length; i++) {
                if (!$itemImg.eq(i).hasClass('has-image')) {
                    $itemImg.eq(i).attr('src', data);
                    $itemImg.eq(i).addClass('has-image');
                    $imgDeleteBtn.eq(i).show();
                    break;
                }
            }
            if ($itemImg.last().hasClass('has-image')) {
                $uploadImgBtn.uploadify('disable', true);
            }
        }
    });

    $.ajax({
        url: '/item/release/getbelong',
        type: 'post',
        dataType: 'json',
        success: function(data) {
            for (var i = 0; i < data.indexList.length; i++) {
                $releaseBigClass.append('<option>' + data.indexList[i].belong + '</option>');
            }
        },
        error: function() {
            alert('error');
        }
    });


    $releaseBigClass.change(function() {
        var _belong = $releaseBigClass.val();
        $releaseSmallClass.empty();
        $releaseSmallClass.append('<option value="0">请选择...</option>');
        if (_belong != 0) {
            $.ajax({
                url: '/item/release/getname',
                type: 'post',
                dataType: 'json',
                data: {
                    belong: _belong
                },
                success: function(data) {
                    for (var i = 0; i < data.productList.length; i++) {
                        $releaseSmallClass.append('<option value="' + data.productList[i].id + '">' + data.productList[i].name + '</option>');
                    }
                    $releaseSmallClass.attr('disabled', false);
                },
                error: function() {
                    alert('error');
                }
            });
        } else {
            $releaseSmallClass.attr('disabled', true);
        }
    });

    $imageContainer.delegate('.item-img-delete', 'click', function() {
        if (confirm("确定要删除吗？")) {
            var _img = $(this).parent().prev();
            var _imgPath = _img.attr('src');
            $.ajax({
                url: '/item/img/temp',
                type: 'delete',
                dataType: 'json',
                data: {
                    imgPath: _imgPath
                },
                success: function(data) {
                    if (data.code == 200) {
                        var $itemImg = $('.row>.col-xs-3>.thumbnail>.item-img');
                        var imageTemp = $imageTemp.clone();
                        imageTemp.attr('id', null);
                        imageTemp.show();
                        $itemImg.last().parent().parent().after(imageTemp);
                        _img.parent().parent().remove();
                        $itemImg = $('.row>.col-xs-3>.thumbnail>.item-img');
                        if (!$itemImg.last().hasClass('has-image')) {
                            $uploadImgBtn.uploadify('disable', false);
                        }
                    } else {
                        alert('服务器出错，请重新尝试');
                    }
                },
                error: function() {
                    alert('服务器出错，请重新尝试');
                }
            });
        }
    });

    var validator = $itemReleaseForm.validate({
        onkeyup: false,
        rules: {
            item_release_name: {
                required: true,
                rangelength: [1, 40]
            },
            item_release_key: {
                required: true,
                rangelength: [1, 40]
            }
        },
        messages: {
            item_release_name: {
                required: '请输入商品名称',
                rangelength: "商品名称不超过40个字符"
            },
            item_release_key: {
                required: '请输入关键字',
                rangelength: "商品名称不超过40个字符"
            }
        }
    });

    $inputPrice.blur(function() {
        var rule = /^[0-9]+(.[0-9]{2})?$/;
        $inputPrice.parent().parent().find('.error').remove();
        if ($inputPrice.val() !== '') {
            if (!rule.test($inputPrice.val())) {
                $inputPrice.parent().after('<div class="error tip"><strong>请输入正确的价格</strong></div>');
            }
        } else {
            $inputPrice.parent().after('<div class="error tip"><strong>请输入价格</strong></div>');
        }
    });

    $itemReleaseBtn.on('click', function() {
        var $itemImg = $('.row>.col-xs-3>.thumbnail>.item-img');
        if ($inputPrice.val() == '') {
            $inputPrice.parent().parent().find('.error').remove();
            $inputPrice.parent().after('<div class="error tip"><strong>请输入价格</strong></div>');
        }
        if ($releaseBigClass.val() == 0) {
            $releaseBigClass.focus();
        }
        if ($releaseSmallClass.val() == 0) {
            $releaseSmallClass.focus();
        }
        if (validator.form() && !$itemReleaseForm.find('div').hasClass('error') && $releaseSmallClass.val() != 0) {
            if (!$itemImg.eq(0).hasClass('has-image')) {
                alert('至少上传一张商品图片');
            } else {
                var content = editor.getContent();
                var imgPath = [];
                for (var i = 0; i < $itemImg.length; i++) {
                    if ($itemImg.eq(i).hasClass('has-image'))
                        imgPath.push($itemImg.eq(i).attr('src'));
                }
                $itemReleaseBtn.attr('disabled', true);
                $.ajax({
                    url: '/item/release',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        item_name: $inputName.val(),
                        product_id: $releaseSmallClass.val(),
                        item_key: $inputKey.val(),
                        item_price: $inputPrice.val(),
                        item_desc: content,
                        item_img: imgPath,
                        store_id: _currentStoreId
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            alert('发布成功');
                            window.location.href = '/store/' + _currentStoreId;
                        } else {
                            alert('服务器出错，请重新尝试');
                            window.location.reload();
                        }
                    },
                    error: function() {
                        alert('服务器出错，请重新尝试');
                        window.location.reload();
                    }
                });
            }
        }
    });
});