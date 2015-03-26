$(document).on('ready', function () {
    resizeSlide();


    $('.faqQuestions .question').on('click', function() {
        $(this).closest('.item').toggleClass('expanded');
        return false;
    });

    $('.myShoes .section.orderContent .itemTypes .itemHeader').on('click', function() {
        $(this).closest('.item').toggleClass('expanded');
        return false;
    });

    $('.menuToggleAction').on('click', function () {
        $('#menuOverlay').addClass('activated');
    });

    $('#menuOverlay').find('.closeButton').on('click', function () {
        $(this).closest('#menuOverlay').removeClass('activated');
        return false;
    });
});

$(window).on('resize', function () {
    resizeSlide();
});


function resizeSlide () {
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();

    var imageWidth  = 1600;
    var imageHeight = 889;

    var imageCoef = imageWidth / imageHeight;

    if (viewportWidth / viewportHeight > imageCoef) {
        $('.homepage .section.intro').height(viewportWidth / imageCoef);
    } else {
        //$('.homepage .section.intro').height('');
        $('.homepage .section.intro').height(Math.min(imageHeight, viewportHeight * 0.9));
    }
}