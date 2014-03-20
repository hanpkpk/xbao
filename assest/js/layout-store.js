$(function() {
    var $liBelong = $(".li-belong");
    var $navigation = $('.navigation-label');

    $liBelong.on('click', function() {
        if ($(this).attr('data-isshown') == 0) {
            $.ajax({
                url: '/store/navigation',
                type: 'post',
                dataType: 'json',
                data: {
                    belong: $(this).attr('data-value')
                },
            }).success(function(data) {
                for (var i = 0; i < data.name.length; i++) {
                    $navigation.find("ul." + data.belong).append('<li><a>' + data.name[i] + '</a></li>');
                }
                $('.navigation-label').find('li.' + data.belong).attr('data-isshown', '1');
                $navigation.find("ul." + data.belong).slideDown();
                $('.navigation-label').find('li.' + data.belong).find('i').removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-left');
            }).error(function(err) {
                alert(err);
            });
        } else {
            if ($(this).find('i').hasClass('fa-chevron-circle-down')) {
                $(this).next().slideDown();
                $(this).find('i').removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-left');
            } else {
                $(this).next().slideUp();
                $(this).find('i').removeClass('fa-chevron-circle-left').addClass('fa-chevron-circle-down');
            }
        }
    });
});