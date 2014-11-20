var pk = pk || {};
/**
Attach custom scrollbars to an element

HTML:

	<div id='scroll'>
		...long content....
    </div>
	
Javascript:

	pk.scroll({
		element: document.getElementById('scroll'),
		axis: 'xy'
	});
	
@class pk.scroll
@constructor
@param options {Object}
@param options.element {Object} DOM element to attach drag handlers to
@param [options.sensitivity=60] {Number} Number in px to scroll incrementally on `mousewheel` and `key` events. Can also be expressed as percentage, e.g. `10%` of content
@param [options.axis=y] {Object} Object consisting of `x` and `y` {Boolean} values denoting scrollable axis, DOM element to attach drag handlers to. Defaults to element attribute `pk-scroll` or `y`
@return Object {Object} Consisting of original DOM element (item `0`)
@chainable
*/
(function(pk) {
    // HELPERS FOR jQUERY+ANGULAR
    if (typeof jQuery === 'object') {
        // jquery available
        jQuery.fn.extend({
            pkScroll: function(axis) {
                pk.scroll({
                    element: this[0],
                    axis: axis
                });
            }
        });
    }
    if (typeof angular === 'object') {
        // angular available
        ( 

            function() {
                angular.module('pk-scroll', ['ng'])
                    .directive('pkScroll', function() {
                        return {
                            restrict: 'A',
                            link: function(scope, el) {
                                pk.scroll({
                                    element: el[0],
                                    axis: el[0].getAttribute('pk-scroll')
                                });
                            }
                        };
                    });
            })();
    }
    pk.scroll = function(opt) {

        var el = opt.element,
			sensitivity=60;
        // INIT SCROLL STRUCTURE

        var tpl = "<div class='pk-scroll-container'>\
            <" + el.nodeName + " class='pk-scroll-content'>\
                " + el.innerHTML + "\
            </" + el.nodeName + ">\
            <div class='pk-scroll-trackY'>\
                <div class='pk-scroll-floatY'></div>\
            </div>\
            <div class='pk-scroll-trackX'>\
                <div class='pk-scroll-floatX'></div>\
            </div>\
        </div>";
        el.innerHTML = '';
        el = pk.replaceEl(el, tpl);
        var container = el.children[0],
            trackY = el.children[1],
            floatY = trackY.children[0],
            trackX = el.children[2],
            floatX = trackX.children[0];
        // INIT VARIABLES
        var
            floatYh = 0,
            floatXw = 0,
            allowY = false,
            allowX = false,
            percY = 0,
            percX = 0,
            contentH = 0,
            contentW = 0,
            containerH = 0,
            containerW = 0,
            contentWidth = 0,
            contentHeight = 0,
            containerWidth = 0,
            containerHeight = 0,
            scrollDir = opt.axis ? opt.axis.toLowerCase() : (pk.attribute(el, 'pk-scroll') ? pk.attribute(el, 'pk-scroll') : "y");
        if (pk.getStyle(el, 'position') === "static") {
            el.style.position = "relative";
        }

        pk.bindEvent("scroll", container, function() {
            percY = container.scrollTop / (contentH - containerH);
            percX = container.scrollLeft / (contentW - containerW);
            percY = percY < 0 ? 0 : percY > 1 ? 1 : percY;
            percX = percX < 0 ? 0 : percX > 1 ? 1 : percX;
            floatY.style.top = (containerH - floatYh) * percY + 'px';
            floatX.style.left = (containerW - floatXw) * percX + 'px';
        });

        function resolveDimensions() {
            contentH = container.scrollHeight;
            contentW = container.scrollWidth;
            containerH = el.offsetHeight;
            containerW = el.offsetWidth;
            if (scrollDir.indexOf("y") > -1 && contentH > containerH) {
                allowY = true;
                pk.addClass(el, 'pk-scroll-enableY');
                floatYh = floatY.offsetHeight;
                container.scrollTop = (contentH - containerH) * percY;
            } else {
                allowY = false;
                pk.removeClass(el, 'pk-scroll-enableY');
                container.scrollTop = 0;
            }
            if (scrollDir.indexOf("x") > -1 && contentW > containerW) {
                allowX = true;
                pk.addClass(el, 'pk-scroll-enableX');
                floatXw = floatX.offsetWidth;
                container.scrollLeft = (contentW - containerW) * percX;
            } else {
                allowX = false;
                pk.removeClass(el, 'pk-scroll-enableX');
                container.scrollLeft = 0;
            }
        }
        resolveDimensions();

        setInterval(function() {
            var widthContainer = el.offsetWidth,
                heightContainer = el.offsetHeight,
                widthContent = container.scrollWidth,
                heightContent = container.scrollHeight;
            if (widthContainer !== containerWidth || heightContainer !== containerHeight || widthContent !== contentWidth || heightContent !== contentHeight) {
                contentWidth = widthContent;
                contentHeight = heightContent;
                containerWidth = widthContainer;
                containerHeight = heightContainer;
                resolveDimensions();
            }
        }, 500);

        // DRAG HANDLERS

        if (allowY) {
            pk.drag({
                element: floatY,
                move: {
                    y: true
                },
                container: {
                    element: trackY
                },
                listeners: {
                    dragging: function() {
                        container.scrollTop = (contentH - containerH) * (floatY.offsetTop / (trackY.offsetHeight - floatY.offsetHeight));
                    }
                }
            });
        }
        if (allowX) {
            pk.drag({
                element: floatX,
                move: {
                    x: true
                },
                container: {
                    element: trackX
                },
                listeners: {
                    dragging: function() {

                        container.scrollLeft = (contentW - containerW) * (floatX.offsetLeft / (trackX.offsetWidth - floatX.offsetWidth));
                    }
                }
            });
        }
        pk.bindEvent("click", floatY, function(e) {
            pk.preventBubble(e);
        });
        pk.bindEvent("click", floatX, function(e) {
            pk.preventBubble(e);
        });

        // TRACK CLICKING HANDLERS
        pk.bindEvent("click", trackY, function(e) {
            container.scrollTop = (pk.getEventOffset(e).y / containerH * (contentH - containerH));
        });
        pk.bindEvent("click", trackX, function(e) {
            container.scrollLeft = (pk.getEventOffset(e).x / containerW * (contentW - containerW));
        });

        // MOUSE WHEEL HANDLERS
        function mouseScroll(e) {
            if (e.wheelDelta > 0 || e.detail < 0) {
				if (allowY) {
					container.scrollTop -= typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerH * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;			
				} else {
					container.scrollLeft -= typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerW * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;			
				}
            }else if (allowY) {
					container.scrollTop += typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerH * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;			
			} else {
				container.scrollLeft += typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerW * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;			
			}
            /* Stop wheel propogation (prevent parent scrolling) */
            pk.preventBubble(e);
        }

        pk.bindEvent("mousewheel", container, mouseScroll);

        // TOUCH EVENT HANDLERS

        function getXy(e) {
            // touch event
            if (e.targetTouches && (e.targetTouches.length >= 1)) {
                return {
                    x: e.targetTouches[0].clientX,
                    y: e.targetTouches[0].clientY
                };
            }
            // mouse event
            return {
                x: e.clientX,
                y: e.clientY
            };
        }

        var pressed = false,
            startPos = {};

        function tap(e) {
            pressed = true;
            startPos = getXy(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function release(e) {
            pressed = false;
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function drag(e) {
            var endPos, deltaX, deltaY;
            if (pressed) {
                endPos = getXy(e);
                deltaY = startPos.y - endPos.y;
                deltaX = startPos.x - endPos.x;
                if (deltaY > 2 || deltaY < -2) {
                    startPos.y = endPos.y;
                    container.scrollTop += deltaY;

                }
                if (deltaX > 2 || deltaX < -2) {
                    startPos.x = endPos.x;
                    container.scrollLeft += deltaX;
                }
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (typeof window.ontouchstart !== 'undefined') {
            pk.bindEvent('touchstart', container[0], tap);
            pk.bindEvent('touchmove', container[0], drag);
            pk.bindEvent('touchend', window, release);
        }

        // KEYBOARD HANDLERS    
        container.setAttribute("tabindex", 0);
        pk.bindEvent('keydown', container, function(e) {
            if (document.activeElement !== container) {
                return;
            }
            if (allowY) {
                switch (e.keyCode) {
                    case 38: //up cursor						
                        container.scrollTop -= typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerH * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;
                        pk.preventBubble(e);
                        break;
                    case 40: //down cursor
                    case 32: //spacebar
                        container.scrollTop += typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerH * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;
                        pk.preventBubble(e);
                        break;
                    case 33: //page up
                        container.scrollTop -= containerH;
                        pk.preventBubble(e);
                        break;
                    case 34: //page down
                        container.scrollTop += containerH;
                        pk.preventBubble(e);
                        break;
                    case 36: //home
                        container.scrollTop = 0;
                        pk.preventBubble(e);
                        break;
                    case 35: //end
                        container.scrollTop = contentH;
                        pk.preventBubble(e);
                        break;
                }
            }
            if (allowX) {
                switch (e.keyCode) {
                    case 37: //left cursor
                        container.scrollLeft -= typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerW * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;
                        pk.preventBubble(e);
                        break;
                    case 39: //right cursor
                        container.scrollLeft += typeof sensitivity === 'string' && sensitivity.indexOf('%') ?  containerW * parseInt(sensitivity.replace('%',''),0)/100 : sensitivity;
                        pk.preventBubble(e);
                        break;
                }
            }
            return {
                0: el
            };

        });
    };
    return pk;
})(pk);
