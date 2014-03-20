$(function() {
    var headImg = $('.headImg');

    $('#file_upload').uploadify({
        'queueSizeLimit' : 1,
        'method'   : 'post',
        'fileObjName':'myfile',
        'fileTypeDesc' : 'Image Files',
        'fileTypeExts':'*.gif;*.jpg;*.png',
        'buttonText':'上传头像',
        'buttonClass':'upload-position',
        'swf'      : '/assest/vendor/uploadify/uploadify.swf',
        'uploader' : '/upload',
        'onUploadSuccess' : function(file, data, response) {
            headImg.attr('src',data);
        }
    });
});