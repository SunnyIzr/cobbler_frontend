$(document).on('ready', function () {
    resizeSlide();
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