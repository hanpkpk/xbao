$(function() {
    var $orderBar = $('.item-list-total-bar');
    var $filterName = $('.item-list-total-title');
    var baseUrl = $filterName.eq(0).attr('href');

    $filterName.on('click', function() {
        if ($(this).hasClass('active')) {
            if ($(this).find('i').hasClass('fa-arrow-down')) {
                var sort = $(this).attr('data-sort');
                window.location.href = baseUrl + '&sort=' + (parseInt(sort) + 1);
            } else {
                var sort = $(this).attr('data-sort');
                window.location.href = baseUrl + '&sort=' + sort;
            }
        } else {
            var sort = $(this).attr('data-sort');
            window.location.href = baseUrl + '&sort=' + sort;
        }
    });
});