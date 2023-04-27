(function ($) {
    var _$window = $(window),
        _html = document.documentElement,
        _htmlCss = _getCss(_html),
        _$extend = $.extend,
        _$inArray = $.inArray,
        _$isNumeric = $.isNumeric,
        _$trim = $.trim,
        _$isArray = $.isArray,
        _element = document.getElementById('screen'),
        _settings = {};
    if (!_element) {
        _element = document.createElement('div');
        _element.id = 'screen';
    }

    function _getCss(element) {
        var result;
        try {
            result = element.currentStyle || getComputedStyle(element);
        } catch (e) {

        }
        return result;
    }  //_getCss end

    function _deduplicateArray(value) {
        var result = [];
        for (var i = 0, valueLength = value.length; i < valueLength; i++) {
            var element = value[i];

            if (_$inArray(element, result) === -1) {
                result.push(element);
            }
        }
        return result;
    }  //_deduplicateArray end

    function _compareArray(value, array) {
        var truth = [],
            untruth = [],
            result = {
                truth: truth,
                untruth: untruth
            };
        for (var i = 0, valueLength = value.length; i < valueLength; i++) {
            var element = value[i];

            if (_$inArray(element, array) > -1) {
                truth.push(element);
            } else {
                untruth.push(element);
            }
        }
        return result;
    }  //_compareArray end

    function _sortArray(value, array) {
        var result = [],
            i = 0,
            valueLength = value.length;
        for (; i < valueLength; i++) {
            var element = value[i],
                index = _$inArray(element, array);

            if (index > -1) {
                result[index] = element;
            }
        }
        for (i = 0; i < result.length; i++) {
            if (!result.hasOwnProperty(i)) {
                result.splice(i, 1);

                i--;
            }
        }
        return result;
    }  //_sortArray end

    function _getScrollbarSize() {
        return _element.offsetWidth - _element.clientWidth;
    }  //_getScrollbarSize end

    function getScrollBarWidth() {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;
        document.body.removeChild(outer);
        return (w1 - w2);
    }  //getScrollBarWidth end

    function _hasScrollbar() {
        var overflowX = _htmlCss.overflowX,
            overflowY = _htmlCss.overflowY;
        return {
            horizontal: _html.scrollWidth > _html.clientWidth && overflowX !== 'hidden' || overflowX === 'scroll',
            vertical: _html.scrollHeight > _html.clientHeight && overflowY !== 'hidden' || overflowY === 'scroll'
        };
    }  //_hasScrollbar end

    function _filterScreenState(value) {
        var result = [];
        if (typeof value === 'string') {
            value = [value];
        }
        if (_$isArray(value)) {
            var name = _settings.name;

            result = _sortArray(_compareArray(_deduplicateArray(value), name).truth, name);
        }
        return result;
    }  //_filterScreenState end

    function _setScreenInfo() {
        var hasScrollbar = _hasScrollbar(),
            hasHorizontalScrollbar = hasScrollbar.horizontal,
            hasVerticalScrollbar = hasScrollbar.vertical,
            scrollbarSize = getScrollBarWidth(),
            screenWidth = _$window.width(),
            screenHeight = _$window.height();
        if (hasVerticalScrollbar) {
            screenWidth += scrollbarSize;
        }
        if (hasHorizontalScrollbar) {
            screenHeight += scrollbarSize;
        }
        _settings.horizontalScrollbar = hasHorizontalScrollbar;
        _settings.verticalScrollbar = hasVerticalScrollbar;
        _settings.scrollbarSize = scrollbarSize;
        _settings.width = screenWidth;
        _settings.height = screenHeight;
    }  //_setScreenInfo end

    function _setScreenInfoState(value) {
        var state = _settings.state,
            filterState = _compareArray(value, state),
            activeState = filterState.untruth,
            deactiveState = _compareArray(state, filterState.truth).untruth;
        if (activeState.length || deactiveState.length) {
            _settings.state = value;
        }
        return (activeState.length || deactiveState.length) && (_settings.state = value, console.log("상태 : " + value.join(", "))), {
            activeState: activeState,
            deactiveState: deactiveState
        };
    }  //_setScreenInfoState end

    function _callScreenEvent(value) {
        _$screen.settings = _$extend(true, _$screen.settings, _settings);
        for (var i = 0, valueLength = value.length; i < valueLength; i++) {
            var type = 'screen',
                state = value[i];
            _$window.triggerHandler(type, state);
            _$window.triggerHandler(type + ':' + state, state);
        }
    }  //_callScreenEvent end

    function _destroyScreen() {
        _$window.off('.screen');
        _settings.state = [];
        _$screen.settings = undefined;
        $(_element).remove();
    }  //_destroyScreen end

    var _$screen = $.screen = function (options) {
        if (options) {
            var state = options.state,
                name = [],
                width = 0,
                height = 0,
                timer = 0,
                code = 'var inState = [];\n\n';
            _destroyScreen();
            _html.appendChild(_element);

            if (_$isArray(state)) {
                for (var i = 0, stateLength = state.length; i < stateLength; i++) {
                    var value = state[i];
                    if (value) {
                        var stateName = value.name;
                        if (typeof stateName === 'string') {
                            stateName = _$trim(stateName);
                            if (stateName) {
                                var horizontal = value.horizontal,
                                    hasHorizontal = false,
                                    vertical = value.vertical,
                                    hasVertical = false;
                                if (horizontal) {
                                    var horizontalFrom = horizontal.from,
                                        horizontalTo = horizontal.to;
                                    if (!_$isNumeric(horizontalFrom)) {
                                        horizontalFrom = -1;
                                    }
                                    if (!_$isNumeric(horizontalTo)) {
                                        horizontalTo = -1;
                                    }
                                    if (horizontalFrom >= 0 && horizontalTo >= 0 && horizontalFrom >= horizontalTo) {
                                        hasHorizontal = true;
                                    }
                                }

                                if (vertical) {
                                    var verticalFrom = vertical.from,
                                        verticalTo = vertical.to;
                                    if (!_$isNumeric(verticalFrom)) {
                                        verticalFrom = -1;
                                    }
                                    if (!_$isNumeric(verticalTo)) {
                                        verticalTo = -1;
                                    }
                                    if (verticalFrom >= 0 && verticalTo >= 0 && verticalFrom >= verticalTo) {
                                        hasVertical = true;
                                    }
                                }

                                if (hasHorizontal || hasVertical) {
                                    code += 'if(';

                                    if (hasHorizontal) {
                                        code += 'width <= ' + horizontalFrom + ' && width >= ' + horizontalTo;
                                    }

                                    if (hasVertical) {
                                        if (hasHorizontal) {
                                            code += ' && ';
                                        }
                                        code += 'height <= ' + verticalFrom + ' && height >= ' + verticalTo;
                                    }

                                    code += ') {\n';
                                    code += '    inState.push(\'' + stateName + '\');\n';
                                    code += '}\n\n';
                                    name.push(stateName);
                                }  //(hasHorizontal || hasVertical) end
                            }  //(stateName) end
                        }  //(typeof stateName === 'string') end
                    }  //(value) end
                }  //(var i = 0, stateLength = state.length; i < stateLength; i++) end
            }  //(_$isArray(state)) end

            _settings.name = name;
            _$window.on('resize.screen', function (event) {
                _setScreenInfo();

                var screenWidth = _settings.width,
                    screenHeight = _settings.height,
                    resizeState = [],
                    resizedState = [],
                    isWidthChange = false,
                    isHeightChange = false,
                    isTrigger = event.isTrigger;
                if (screenWidth !== width) {
                    width = screenWidth;

                    isWidthChange = true;
                }
                if (screenHeight !== height) {
                    height = screenHeight;

                    isHeightChange = true;
                }
                if (isTrigger) {
                    isWidthChange = false;
                    isHeightChange = false;
                }
                _settings.widthChange = isWidthChange;
                _settings.heightChange = isHeightChange;
                eval(code);

                if (!inState.length) {
                    inState[0] = 'none';
                }

                var setState = _setScreenInfoState(inState),
                    activeState = setState.activeState;

                if (!isTrigger) {
                    resizeState[0] = 'resize';
                    resizedState[0] = 'resized';
                }

                for (var i = 0, inStateLength = inState.length; i < inStateLength; i++) {
                    var value = inState[i];
                    if (!isTrigger) {
                        resizeState.push('resize:' + value);
                        resizedState.push('resized:' + value);
                    }
                    if (_$inArray(value, activeState) > -1) {
                        resizeState.push(value);
                    }
                }
                _callScreenEvent(resizeState);

                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }

                timer = setTimeout(function () {
                    _setScreenInfo();
                    _settings.widthChange = false;
                    _settings.heightChange = false;
                    _callScreenEvent(resizedState);
                }, 250);
            }).triggerHandler('resize.screen');
        }
        return _$window;
    };

    _$screen.setState = function (value) {
        var state = _filterScreenState(value),
            result = false;
        if (state.length) {
            var setState = _setScreenInfoState(state),
                activeState = setState.activeState;
            if (activeState.length || setState.deactiveState.length) {
                _callScreenEvent(activeState);
                result = true;
            }
        }
        return result;
    };
})(window.jQuery);