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

    $('.getStarted .orderForm .hint .icon').click(function(event) {
        event.preventDefault();

        $(this).closest('.hint').toggleClass('active');
    });

    $('.getStarted .orderForm .compositeField .upDownButton').click(function(event) {
        event.preventDefault();

        var $this = $(this);
        var control = $this.closest('.compositeField');

        var valueLabel = control.find('.value');
        var input = control.find('input');

        var currentValue = parseInt(input.val());

        if ($this.hasClass('increase')) {
            currentValue += 1;
        } else {
            if (currentValue == 0) {
                return false;
            }

            currentValue -= 1;
        }

        input.val(currentValue);
        valueLabel.text(currentValue);

        var form = control.closest('form');

        form.submit();
    });

    $('.getStarted .orderForm').submit(function(event) {
        event.preventDefault();

        var form = $(this);
        var data = form.serialize();

        $.post(
            form[0].action,
            data
        ).done(function(data) {
            var orderAmount = parseInt(data);
            form.find('.totalContainer .value .digit').text(orderAmount);

            var processControls = $('#content').find('.processControls');
            if (orderAmount > 0) {
                processControls.slideDown('slow');
            } else {
                processControls.slideUp('slow');
            }
        }).fail(function () {
            alert('Whoops! It looks, that we have some issues on our side. Please, try again later or contact the support.');
        });
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