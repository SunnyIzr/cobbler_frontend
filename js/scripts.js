(function ($) {
    "use strict";

    $(document).on('ready', function () {
        if ($('#content.homepage').length > 0) {
            HomePage();
        } else if ($('#content.accessories').length > 0) {
            AccessoriesPage();
        } else if ($('#content.myShoes').length > 0) {
            MyShoesPage();
        } else if ($('#content.getStarted').length > 0) {
            GetStartedPage();
        }

        $('.faqQuestions .question').on('click', function () {
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


    function HomePage() {
        $(window).on('resize', _updateIntroSectionSize);
        _updateIntroSectionSize();

        function _updateIntroSectionSize() {
            var viewportWidth = $(window).width();
            var viewportHeight = $(window).height();

            var imageWidth = 1600;
            var imageHeight = 889;

            var imageCoef = imageWidth / imageHeight;

            if (viewportWidth / viewportHeight > imageCoef) {
                $('.homepage .section.intro').height(viewportWidth / imageCoef);
            } else {
                //$('.homepage .section.intro').height('');
                $('.homepage .section.intro').height(Math.min(imageHeight, viewportHeight * 0.9));
            }
        }
    }

    function GetStartedPage() {
        $('.orderForm .hint .icon').click(function (event) {
            event.preventDefault();

            $(this).closest('.hint').toggleClass('active');
        });

        $('.orderForm .compositeField .upDownButton').click(function (event) {
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

        $('.orderForm').submit(function (event) {
            event.preventDefault();

            var form = $(this);
            var data = form.serialize();

            $.post(
                form[0].action,
                data
            ).done(function (data) {
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
    }


    function MyShoesPage() {
        $('.section.orderContent .itemTypes .itemHeader').on('click', function () {
            $(this).closest('.item').toggleClass('expanded');
            return false;
        });
    }

    function AccessoriesPage() {
        SliderWrapper();
        StickyProcessControls();


        function SliderWrapper() {
            var _sliderInitialized = false;

            $(window).on('resize', _onResize);
            _onResize();

            function _onResize() {
                if (Foundation.utils.is_large_up()) {
                    if (!_sliderInitialized) {
                        $('#content.accessories').find('.section.accessories .itemsPages').slick({
                            dots: false,
                            arrows: true
                        });
                        _sliderInitialized = true;
                    }
                } else {
                    if (_sliderInitialized) {
                        $('#content.accessories').find('.section.accessories .itemsPages').slick('unslick');
                        _sliderInitialized = false;
                    }
                }
            }
        }

        function StickyProcessControls() {
            var _bar = $("#content.accessories").find(".processControls");
            var _topThreshold = 0;
            var _bottomThreshold = 0;
            var _document = $(document);
            var _isVisible = false;
            var _isEnabled = false;

            $(window).on('resize', _onResize);
            _onResize();

            function _onResize() {
                if (Foundation.utils.is_large_up()) {
                    if (_isEnabled) {
                        _isEnabled = false;
                        $(window).off('scroll', _updateBarState);
                        _bar.removeClass('sticky');
                        _bar.show();
                    }
                } else {
                    if (!_isEnabled) {
                        _calcThresholds();
                        $(window).on('scroll', _updateBarState);
                        _isEnabled = true;
                    }
                }
            }

            function _calcThresholds() {
                var footer = $('#footer');
                var documentHeight = $(document).height();
                var viewportHeight = $(window).height();

                var pos = _document.scrollTop();

                _topThreshold = viewportHeight * 0.2;
                _bottomThreshold = documentHeight - footer.outerHeight() - viewportHeight;

                _isVisible = pos > _topThreshold;
            }

            function _updateBarState() {
                var pos = _document.scrollTop();

                if (pos <= _bottomThreshold && pos > _topThreshold) {
                    if (!_isVisible) {
                        _bar.addClass('sticky').hide().slideDown();
                        _isVisible = true;
                    } else {
                        _bar.addClass('sticky');
                    }
                } else if (pos <= _topThreshold && _isVisible) {
                    _bar.slideUp().promise().done(function () {
                        _bar.removeClass('sticky');
                        _isVisible = false;
                    });
                } else {
                    _bar.removeClass('sticky');
                }
            }
        }
    }
})(jQuery);
