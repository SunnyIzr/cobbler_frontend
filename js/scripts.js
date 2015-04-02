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
        } else if ($('#content.contactUs').length > 0) {
            ContactUsPage();
        }

        MainMenu();

        $('.faqQuestions .question').on('click', function () {
            $(this).closest('.item').toggleClass('expanded');
            return false;
        });
    });

    function MainMenu() {
        var overlay = $('#menuOverlay');
        var transEndEventNames = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'msTransition': 'MSTransitionEnd',
                'transition': 'transitionend'
            },
            transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
            support = { transitions : Modernizr.csstransitions };


        function toggleOverlay() {
            if( overlay.hasClass('activated') ) {
                overlay.removeClass('activated' );
                overlay.addClass('closing');

                var onEndTransitionFn = function( ev ) {
                    if( support.transitions ) {
                        if( ev.propertyName !== 'visibility' ) { return; }
                        this.removeEventListener( transEndEventName, onEndTransitionFn );
                    }
                    overlay.removeClass('closing' );
                };

                if( support.transitions ) {
                    overlay.get(0).addEventListener( transEndEventName, onEndTransitionFn );
                } else {
                    onEndTransitionFn();
                }
            } else if( !overlay.hasClass('closing') ) {
                overlay.addClass('activated');
            }
        }


        $('.menuToggleAction').on('click', toggleOverlay);
        overlay.find('.closeButton').on('click', toggleOverlay);
    }

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
        var orderQuantityLimit = 5;

        var orderForm = $('#orderForm');

        orderForm._controllers = [];

        orderForm.shiftFieldValue = function (fieldName, increment) {
            var field = this.find('[name=' + fieldName + ']');
            var currentValue = parseInt(field.val());

            currentValue += increment;
            if (currentValue < 0) {
                currentValue = 0;
            }

            field.val(currentValue);

            for(var i=0; i<this._controllers.length; i++) {
                this._controllers[i].setFieldValue(fieldName, currentValue);
            }

            this.submit();

            this.checkLimits();
        };

        orderForm.checkLimits = function() {
            var quantity = 0;
            orderForm.find('input[type="hidden"]').each(function() {
                quantity += parseInt($(this).val());
            });

            for(var i=0; i<this._controllers.length; i++) {
                if (quantity > orderQuantityLimit) {
                    this._controllers[i].showQuantityWarning();
                } else {
                    this._controllers[i].hideQuantityWarning();
                }
            }
        };

        orderForm.increaseField = function (fieldName) {
            this.shiftFieldValue(fieldName, +1);
        };

        orderForm.decreaseField = function (fieldName) {
            this.shiftFieldValue(fieldName, -1);
        };

        orderForm.addController = function (controller) {
            this._controllers.push(controller);
        };

        orderForm.submit(function (event) {
            event.preventDefault();

            var form = orderForm;
            var data = form.serialize();

            $.post(
                form[0].action,
                data
            ).done(function (data) {
                var orderAmount = parseInt(data);

                for(var i=0; i<form._controllers.length; i++) {
                    form._controllers[i].setTotal(orderAmount);
                }

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


        $('.orderFormController').each(function() {
            var controller = $(this);
            orderForm.addController(controller);
            controller._form = orderForm;

            controller.setFieldValue = function (fieldName, value) {
              this.find('[data-field-name=' + fieldName + '] .value').text(value);
            };

            controller.setTotal = function (value) {
                this.find('.totalContainer .value .digit').text(value);
            };

            controller.find('.compositeField .upDownButton').click(function (event) {
                event.preventDefault();

                var $this = $(this);
                var control = $this.closest('.compositeField');

                if ($this.hasClass('increase')) {
                    controller._form.increaseField(control.data('fieldName'));
                } else {
                    controller._form.decreaseField(control.data('fieldName'));
                }
            });

            controller.showQuantityWarning = function () {
                controller.find('.quantityWarning').css('visibility', 'visible');
            };

            controller.hideQuantityWarning = function () {
                controller.find('.quantityWarning').css('visibility', 'hidden');
            };
        });

        $('.orderFormController .hint .icon').click(function (event) {
            event.preventDefault();

            $(this).closest('.hint').toggleClass('active');
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

    function ContactUsPage() {
        var map;
        var geocoder;
        var address = '379 w. broadway ny ny';

        function initialize() {
            geocoder = new google.maps.Geocoder();

            var mapOptions = {
                zoom: 18,
                center: new google.maps.LatLng(40.723665,-74.002159)
            };
            map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            codeAddress();
        }

        function codeAddress() {
            geocoder.geocode({'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                }
            });
        }

        google.maps.event.addDomListener(window, 'load', initialize);
    }
})(jQuery);
