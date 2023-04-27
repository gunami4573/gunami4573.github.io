(function ($) {
    'use strict';
    var $window = $(window),
        $document = $(document),
        $html = $('html'),
        $screen = $.screen;

    var _browser = navigator.userAgent.toLowerCase();
    if (_browser.indexOf('msie 7.0') > -1) {
        _browser = 'ie ie7';
    } else if (_browser.indexOf('msie 8.0') > -1) {
        _browser = 'ie ie8';
    } else if (_browser.indexOf('msie 9.0') > -1) {
        _browser = 'ie ie9';
    } else if (_browser.indexOf('msie 10.0') > -1) {
        _browser = 'ie ie10';
    } else if (_browser.indexOf('trident/7.0') > -1) {
        _browser = 'ie ie11';
    } else if (_browser.indexOf('edge') > -1) {
        _browser = 'edge';
    } else if (_browser.indexOf('opr') > -1) {
        _browser = 'opera';
    } else if (_browser.indexOf('chrome') > -1) {
        _browser = 'chrome';
    } else if (_browser.indexOf('firefox') > -1) {
        _browser = 'firefox';
    } else if (_browser.indexOf('safari') > -1) {
        _browser = 'safari';
    } else {
        _browser = 'unknown';
    }
    window.getBrowser = function () {
        return _browser;
    };

    $html.addClass(_browser);
    $(function () {
        var $body = $('body'),
            $htmlAndBody = $html.add($body),
            $wrapper = $('#wrapper'),
            $header = $('#header'),
            $container = $('#container'),
            $footer = $('#footer');

        var $lnb = $header.find('.lnb'),
            $lnbShow = $header.find('.menu_show'),
            $lnbShowBtn = $lnbShow.find('.menu_button'),
            $lnbHide = $lnb.find('.menu_hide'),
            $lnbHideBtn = $lnbHide.find('.menu_button'),
            $lnbDepthItem = $lnb.find('.depth_item'),
            $lnbMenu = $lnb.find('.menu'),
            $lnbDepth2FirstChild = $lnbMenu.find('.depth2 > :first-child'),
            $lnbSpy = $lnbMenu.find('.spy:last'),
            lnbHeight;
        if (!$lnb.find('.depth2').length) {
            $header.attr('data-depth', 'none');
        }
        $lnbSpy.parents('.depth_item').addClass('actived');
        $lnbSpy.parents('.depth_item').prev('.depth_item').addClass('actived_prev');
        $lnbSpy.parents('.depth_item').next('.depth_item').addClass('actived_next');
        function refreshLnbHeight() {
            lnbHeight = $lnbMenu.css('transition-property', 'none').outerHeight() || '';

            $lnbMenu.css('transition-property', '');
        }
        $lnbShowBtn.on('click', function (event) {
            $html.toggleClass('lnb_show');
        });
        $lnbHideBtn.on('click', function (event) {
            $html.removeClass('lnb_show');
        });
        $('.lnb_curtain button').on('click', function (event) {
            $html.removeClass('lnb_show');
        });
        $lnbDepthItem.on('mouseover focusin', function (event) {
            if (mode === 'pc') {
                var $this = $(this),
                    $depth1Item = ($this.hasClass('depth1_item')) ? $this : $this.parents('.depth1_item');
                if (!$header.is('[data-depth="none"]')) {
                    if ($lnbMenu.hasClass('pulldown')) {
                        var maxHeight = 0;
                        $lnbDepth2FirstChild.each(function (index, element) {
                            var $element = $(element),
                                outerHeight = $element.outerHeight() || 0;
                            if (outerHeight > maxHeight) {
                                maxHeight = outerHeight;
                            }
                        });

                        $lnbMenu.height(lnbHeight + maxHeight);
                    } else if ($lnbMenu.hasClass('eachdown')) {
                        $lnbMenu.height(lnbHeight + ($depth1Item.find('.depth_list').outerHeight() || ''));
                    }
                }
                $html.addClass('lnb_open');
                $lnbDepthItem.removeClass('active active_prev active_next');
                $this.addClass('active');
                $this.prev('.depth_item').addClass('active_prev');
                $this.next('.depth_item').addClass('active_next');
                $this.parents('li').addClass('active');
                $this.parents('li').prev('.depth_item').addClass('active_prev');
                $this.parents('li').next('.depth_item').addClass('active_next');
            }
            event.stopPropagation();
        }).on('click', function (event) {
            if (mode === 'mobile') {
                var $this = $(this),
                    $depthText = $this.children('.depth_text'),
                    eventTarget = event.target,
                    IsActive = $this.is('.active');

                if ($depthText.find(eventTarget).length || $depthText[0] === eventTarget) {
                    if ($this.hasClass('depth1_item')) {
                        if ($this.hasClass('active')) {
                            $html.removeClass('lnb_open');
                        } else {
                            $html.addClass('lnb_open');
                        }
                    }

                    if ($this.children('.depth').length) {
                        var $Depth = $this.children('.depth'),
                            DepthDisplay = $Depth.css('display');
                        if (DepthDisplay !== 'none') {
                            if (!IsActive) {
                                $this.removeClass('active_prev active_next');
                                $this.addClass('active').siblings('.depth_item').removeClass('active active_prev active_next');
                                $this.prev('.depth_item').addClass('active_prev');
                                $this.next('.depth_item').addClass('active_next');
                            } else {
                                $this.removeClass('active');
                                $this.siblings('.depth_item').removeClass('active_prev active_next');
                            }
                            event.preventDefault();
                        }
                    }
                }
            }
            event.stopPropagation();
        }).each(function (index, element) {
            var $element = $(element);
            if ($element.children('.depth').length) {
                $element.addClass('has');
            } else {
                $element.addClass('solo');
            }
        });
        $lnbMenu.on('mouseleave', function (event) {
            if (mode === 'pc') {
                $lnbMenu.height('');
                $html.removeClass('lnb_open');
                $lnbDepthItem.removeClass('active active_prev active_next');
            }
        });
        $lnb.find('.depth1_item:last-child .depth:visible:last').find('> .depth_list > .depth_item:last-child .depth_text').on('focusout', function (event) {
            if (mode === 'pc') {
                $lnbMenu.height('');
                $html.removeClass('lnb_open');
                $lnbDepthItem.removeClass('active active_prev active_next');
            }
        });

        //gunami pf start -----------------------------------------------------------------------------------

        //header title start
        const mouse = newV2();
        const center = newV2();
        const distanceFromCenter = newV2();
        const distanceLerped = newV2();
        let simulateMouseMovement = true;
        const perspective = 500;
        const translateZ = -12;
        const rotate = 3;
        const skew = 3;
        const header = document.getElementById("header");
        const copies = document.getElementsByClassName("header_title_copy");
        function updateCenter() {
            const rect = header.getBoundingClientRect();
            center.x = rect.left + rect.width / 2;
            center.y = rect.top + rect.height / 2;
        }
        function trackMousePosition(event) {
            simulateMouseMovement = false;
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            distanceFromCenter.x = center.x - mouse.x;
            distanceFromCenter.y = center.y + mouse.y;
        }
        function fakeMousePosition(t) {
            distanceFromCenter.x = Math.sin(t / 500) * window.innerWidth * 0.5;
            distanceFromCenter.y = Math.cos(t / 500) * window.innerWidth * 0.2;
        }
        function updateTextPosition(t) {
            if (simulateMouseMovement) fakeMousePosition(t);
            lerpV2(distanceLerped, distanceFromCenter);
            for (var i = 1; i < copies.length + 1; i++) {
                const copy = copies[i - 1];
                copy.style.transform = makeTransformString(
                    i * distanceLerped.y * 0.03,
                    i * translateZ,
                    i * rotate * (distanceLerped.x * 0.003),
                    i * skew * (distanceLerped.x * 0.003)
                );
            }
            requestAnimationFrame(updateTextPosition);
        }
        function makeTransformString(y, z, rotate, skew) {
            return `perspective(${perspective}px) translate3d(0px, ${y}px, ${z}px) rotate(${rotate}deg) skew(${skew}deg)`;
        }
        function lerpV2(position, targetPosition) {
            position.x += (targetPosition.x - position.x) * 0.2;
            position.y += (targetPosition.y - position.y) * 0.2;
        }
        function newV2(x = 0, y = 0) {
            return {
                x : x,
                y : y
            };
        }
        updateCenter();
        //document.addEventListener("mousemove", trackMousePosition);
        window.addEventListener("resize", updateCenter);
        requestAnimationFrame(updateTextPosition);
        //header title end

        //footer verti_inner start

        //footer verti_inner end
        //gunami pf end -----------------------------------------------------------------------------------
    });

    $document.on('ready', function (event) {
        $screen({
            state: [{
                name: 'wide',
                horizontal: {
                    from: 9999,
                    to: 1601
                }
            }, {
                name: 'web',
                horizontal: {
                    from: 1500,
                    to: 1001
                }
            }, {
                name: 'tablet',
                horizontal: {
                    from: 1000,
                    to: 641
                }
            }, {
                name: 'phone',
                horizontal: {
                    from: 640,
                    to: 0
                }
            }]
        });
    });
    $window.on('load', function (event) {
        $window.on('screen:resize', function (event) {

        }).triggerHandler('screen:resize');
    });
})(jQuery);