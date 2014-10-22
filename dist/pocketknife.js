// Javascript Polyfill

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
// indexOf method

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// Pocketknife Core

var pk = pk || {};
(function(pk) {
    pk.preventBubble = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    };
    pk.toggleClass = function(el, c, t) {
        if (t === true) {
            pk.addClass(el, c);
            return;
        } else if (t === false) {
            pk.removeClass(el, c);
            return;
        }
        pk.toggleClass(el, c, !pk.hasClass(el, c));
    };
    pk.hasClass = function(el, c) {
        var ca = el.getAttribute('class') || '';
        return (ca && ca.indexOf(c) > -1) ? true : false;
    };
    pk.center = function(el) {
        el.style.top = el.parentNode.clientHeight / 2 - (el.offsetHeight / 2) + 'px';
        el.style.left = el.parentNode.clientWidth / 2 - (el.offsetWidth / 2) + 'px';
    };
    pk.getStyle = function(el, p) {
        return window.getComputedStyle(el).getPropertyValue(p);
    };
    pk.addClass = function(el, c) {
        if (pk.hasClass(el, c)) {
            return;
        }
        var ca = el.getAttribute('class') || '';
        el.setAttribute('class', (ca ? ca + ' ' : '') + c);
        return el;
    };
    pk.removeClass = function(el, c) {
        var ca = el.getAttribute('class');
        if (!ca) {
            return;
        }
        el.setAttribute('class', ca.replace(c, '').trim());
        return el;
    };
    pk.bindEvent = function(e, el, fn) {
        if (e === "mousewheel") {
            e = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x  
        }
        if (el.addEventListener) {
            el.addEventListener(e, fn, false);
        } else {
            el.attachEvent("on" + e, fn);
        }
    };
    pk.layout = function(el, offsetEl) {
        var t = offsetEl ? el.getBoundingClientRect().top - offsetEl.getBoundingClientRect().top : el.offsetTop,
            l = offsetEl ? el.getBoundingClientRect().left : el.offsetLeft,
            h = el.offsetHeight,
            w = el.offsetWidth;
        return {
            top: t,
            left: l,
            right: l + w,
            bottom: t + h,
            height: h,
            width: w
        };
    };
    pk.bindListeners = function(l, el) {
        for (var e in l) {
            pk.bindEvent(e, el, l[e]);
        }
    };
    pk.getRand = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    pk.wrapEl = function(el, str) {
        var helperEl = pk.createEl(str);
        el.parentNode.insertBefore(helperEl, el);
        helperEl.appendChild(el);
        return helperEl;
    };
    pk.createEl = function(str) {
        var el = document.createElement('div');
        el.innerHTML = str;
        return el.children[0];
    };
    pk.getIndex = function(el) {
        if (!el) {
            return null;
        }
        var prop = document.body.previousElementSibling ? 'previousElementSibling' : 'previousSibling';
        var i = 1;
        while (el = el[prop]) {
            ++i;
        }
        return i - 1;
    };
    pk.replaceEl = function(el, str) {
        var newEl = pk.createEl(str);
        for (var i = 0; i < el.attributes.length; i++) {
            newEl.setAttribute(el.attributes[i].nodeName, el.attributes[i].value);
        }
        while (el.firstChild) {
            newEl.appendChild(el.firstChild);
        }
        el.parentNode.replaceChild(newEl, el);
        return newEl;
    };
    pk.toArr = function(v) {
        var a = [];
        if (v && typeof v !== "object") {
            if (v.indexOf(',') !== -1) {
                a = v.split(',');
            } else {
                a.push(v);
            }
        } else {
            a = v;
        }
        return a;
    };
    pk.collide = function(a1, a2, s) {
        s = s || 0;
        a1 = pk.toArr(a1);
        a2 = pk.toArr(a2);
        /* 
            s = switch
            0 (default) = replace a1 with a2
            1 = add a2 to a1
            2 = remove a2 from a1
            3 = toggle a2 in a1 and add/remove items if not/found                
        */
        if (s === 0) {
            return a2;
        }
        for (var i in a2) {
            var f = a1.indexOf(a2[i]) !== -1 ? true : false;
            if (!f && (s === 1 || s === 3)) {
                a1.push(a2[i]);
            } else if (f && (s === 2 || s === 3)) {
                a1.splice(parseInt(a1.indexOf(a2[i]), 0), 1);
            }
        }
        return a1;
    };
    pk.attribute = function(el, attr, val) {

        attr = el.hasAttribute(attr) ? attr : el.hasAttribute('data-' + attr) ? 'data-' + attr : attr;
        if (val === undefined) {
            return (attr === 'selected' || attr === 'disabled' || attr === 'checked') ? (el.hasAttribute(attr) ? true : false) : el.getAttribute(attr);
        }
        if (val === false && (attr === 'selected' || attr === 'disabled' || attr === 'checked')) {
            el.removeAttribute(attr);
        } else {
            el.setAttribute(attr, val);
        }
    };
    pk.addClass(document.body, 'pk-ui');
})(pk);

var pk = pk || {};
(function(pk) {
    pk.drag = function(opt) {
        var el = opt.element;
        var handle = opt.handle || opt.element;
        var container = {
            element: opt.container && opt.container.element ? opt.container.element : document.body,
            style: opt.container && opt.container.style ? opt.container.style : 'restrict'
        };

        pk.addClass(handle, 'pk-drag');
        var fn = opt.listeners;
        var m = opt.move;
        if (m && typeof m !== 'object') {
            m = {
                x: true,
                y: true
            };
        }
        var dragging = false;
        var dragStart = {};
        var startOffset;
        var containerD = {};
        var elD = {};

        function augmentEvent(e) {

            e.dragStart = dragStart;
            e.dragOffset = startOffset;

            e.dragEnd = {
                x: e.clientX,
                y: e.clientY
            };
            e.dragDist = {
                x: e.dragEnd.x - e.dragStart.x,
                y: e.dragEnd.y - e.dragStart.y
            };
            e.dragPerc = {
                x: (pk.layout(el).left + e.dragDist.x + e.dragOffset.x) / pk.layout(container.element).width,
                y: (pk.layout(el).top + e.dragDist.y + e.dragOffset.y) / pk.layout(container.element).height
            };
            return e;
        }

        pk.bindEvent("mousedown", handle, function(e) {
            dragging = true;
            dragStart = {
                x: e.clientX,
                y: e.clientY
            };
            startOffset = {
                x: e.clientX - el.getBoundingClientRect().left,
                y: e.clientY - el.getBoundingClientRect().top
            };
            e = augmentEvent(e);
            pk.addClass(handle, 'pk-drag-dragging');
            pk.addClass(document.body, 'pk-noselect');
            document.onselectstart = function() {
                return false;
            };
            containerD = pk.layout(container.element);
            elD = pk.layout(el);
            if (fn && fn.dragstart) {
                fn.dragstart(el, e);
            }
        });
        pk.bindEvent("mouseup", window, function(e) {
            if (!dragging) {
                return;
            }
            dragging = false;
            e = augmentEvent(e);
            pk.removeClass(handle, 'pk-drag-dragging');
            pk.removeClass(document.body, 'pk-noselect');
            document.onselectstart = function() {
                return true;
            };
            if (m && container.style === "snap") {
                contain();
            }
            if (fn && fn.dragend) {
                fn.dragend(el, e);
            }
        });

        function contain() {


            var h = container.element.tagName === "BODY" ? document.documentElement.clientHeight : container.element.offsetHeight,
                w = container.element.tagName === "BODY" ? document.documentElement.clientWidth : container.element.offsetWidth;

            if (m.x && el.offsetLeft < 0) {
                el.style.left = 0 + 'px';
            } else if (m.x && el.offsetLeft > w - el.offsetWidth) {
                el.style.left = w - el.offsetWidth + 'px';
            }
            if (m.y && el.offsetTop < 0) {
                el.style.top = 0 + 'px';
            } else if (m.y && el.offsetTop > h - el.offsetHeight) {
                el.style.top = h - el.offsetHeight + 'px';
            }
        }
        pk.bindEvent("mousemove", window, function(e) {
            if (!dragging) {
                return;
            }
            e = augmentEvent(e);
            if (m.x) {
                el.style.left = el.offsetLeft + (e.dragEnd.x - el.getBoundingClientRect().left) - e.dragOffset.x + 'px';
            }
            if (m.y) {
                el.style.top = el.offsetTop + (e.dragEnd.y - el.getBoundingClientRect().top) - e.dragOffset.y + 'px';
            }
            if (container.style === "restrict") {
                contain();
            }
            if (fn && fn.dragging) {
                fn.dragging(el, e);
            }
        });
    };
})(pk);

var pk = pk || {};
(function(pk) {
    pk.modal = function(opt) {
        var e = opt.context || document.body;
        var h = opt.header;
        var c = opt.content;
        if (!e) {
            return;
        }
        var content = document.createElement('div');
        var mask = document.createElement('div');
        var box = document.createElement('div');
        var close = document.createElement('span');
        var header = document.createElement('div');
        var boxH = 0;
        header.innerHTML = h;
        content.innerHTML = c;
        pk.addClass(box, 'pk-modal-box');
        pk.addClass(close, 'pk-modal-close');
        pk.addClass(header, 'pk-modal-header').appendChild(close);
        pk.addClass(content, 'pk-modal-content');
        box.appendChild(header);
        box.appendChild(content);
        pk.addClass(mask, 'pk-modal-mask').appendChild(box);

        if (document.body.children.length > 0) {
            document.body.insertBefore(mask, document.body.children[0]);
        } else {
            document.body.appendChild(mask);
        }

        function closeModal() {
            pk.removeClass(mask, 'pk-show');
            setTimeout(function() {
                mask.parentNode.removeChild(mask);
            }, 500);
        }
        pk.bindEvent("click", mask, function(e) {
            if (e.target !== mask) {
                return;
            }
            closeModal();
        });
        pk.bindEvent("click", close, closeModal);
        pk.bindEvent("resize", window, function() {
            pk.center(box);
        });
        setTimeout(function() {
            pk.addClass(mask, 'pk-show');
        }, 10);

        boxH = box.offsetHeight;
        setInterval(function() {
            var boxHN = box.offsetHeight;
            if (boxH !== boxHN) {
                pk.center(box);
                boxH = boxHN;
            }
        }, 500);
        pk.center(box);

        if (opt.drag !== false && pk.drag) {
            pk.drag({
                element: box,
                handle: header,
                move: true
            });
        }
    };
    return pk;
})(pk);

var pk = pk || {};
(function(pk) {
    pk.rating = function(opt) {
        var el = opt.element,
            listeners = opt.listeners === undefined ? {} : opt.listeners,
            inputValue = opt.value || el.getAttribute('value') || 0,
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName = opt.name || el.getAttribute('name') || 'pk-rating-' + pk.getRand(1, 999),
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0;

        /*jshint multistr:true */
        var str = "<div class='pk-rating'>\
            <fieldset>\
                <input type='radio' id='" + inputName + "_5' name='" + inputName + "' value='5' tabindex='" + inputTabIndex + "'/>\
                <label for='" + inputName + "_5'></label>\
                <input type='radio' id='" + inputName + "_4' name='" + inputName + "' value='4' />\
                <label for='" + inputName + "_4'></label>\
                <input type='radio' id='" + inputName + "_3' name='" + inputName + "' value='3' />\
                <label for='" + inputName + "_3'></label>\
                <input type='radio' id='" + inputName + "_2' name='" + inputName + "' value='2' />\
                <label for='" + inputName + "_2'></label>\
                <input type='radio' id='" + inputName + "_1' name='" + inputName + "' value='1' />\
                <label for='" + inputName + "_1'></label>\
            </fieldset>\
        </div>";
        el = pk.replaceEl(el, str);

        var rEl = [];
        rEl.push(el.children[0].children[8]);
        rEl.push(el.children[0].children[6]);
        rEl.push(el.children[0].children[4]);
        rEl.push(el.children[0].children[2]);
        rEl.push(el.children[0].children[0]);
        pk.bindListeners(listeners, rEl[0]);
        pk.bindListeners(listeners, rEl[1]);
        pk.bindListeners(listeners, rEl[2]);
        pk.bindListeners(listeners, rEl[3]);
        pk.bindListeners(listeners, rEl[4]);

        pk.bindEvent("mousewheel", el, function(e) {
            pk.preventBubble(e);
            var offset = 1;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset = -1;
            }
            obj.val(obj.val() + offset);
        });

        var obj = {
            0: el,
            val: function(val) {
                if (val === undefined) {
                    for (var r in rEl) {
                        if (rEl[r].checked) {
                            val = rEl[r].value;
                            break;
                        }
                    }
                    return parseInt(val === undefined ? 0 : val, 0);
                }
                val = val < 0 ? 0 : val;
                val = val > 5 ? 5 : val;
                if (val === 0) {
                    rEl[0].checked = true;
                    rEl[0].checked = false;
                } else {
                    rEl[val - 1].checked = true;
                }
            },
            disabled: function(val) {
                if (val !== undefined) {
                    pk.toggleClass(el, 'pk-disabled', val);
                    for (var r in rEl) {
                        pk.attribute(rEl[r], 'disabled', val);
                    }
                }
                return pk.attribute(rEl[0], 'disabled');
            }
        };
        obj.val(inputValue);
        if (inputDisabled) {
            obj.disabled(true);
        }
        return obj;
    };
    return pk;
})(pk);

var pk = pk || {};
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

        var el = opt.element;
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
            container.scrollTop = (e.offsetY / containerH * (contentH - containerH));
        });
        pk.bindEvent("click", trackX, function(e) {
            container.scrollLeft = (e.offsetX / containerW * (contentW - containerW));
        });

        // MOUSE WHEEL HANDLERS
        function mouseScroll(e) {
            var offset = 0.1;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset = offset * -1;
            }
            if (allowY) {
                container.scrollTop = Math.round(container.scrollTop + (contentH - containerH) * offset);
            } else {
                container.scrollLeft = Math.round(container.scrollLeft + (contentW - containerW) * offset);
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
            if (allowY) {
                switch (e.keyCode) {
                    case 38: //up cursor
                        container.scrollTop -= containerH * 0.1;
                        break;
                    case 40: //down cursor
                    case 32: //spacebar
                        container.scrollTop += containerH * 0.1;
                        break;
                    case 33: //page up
                        container.scrollTop -= containerH;
                        break;
                    case 34: //page down
                        container.scrollTop += containerH;
                        break;
                    case 36: //home
                        container.scrollTop = 0;
                        break;
                    case 35: //end
                        container.scrollTop = contentH;
                        break;
                }
            }
            if (allowX) {
                switch (e.keyCode) {
                    case 37: //left cursor
                        container.scrollLeft -= containerW * 0.1;
                        break;
                    case 39: //right cursor
                        container.scrollLeft += containerW * 0.1;
                        break;
                }
            }
            pk.preventBubble(e);
        });
    };
    return pk;
})(pk);

var pk = pk || {};
(function(pk) {
    pk.select = function(opt) {

        var el = opt.element,
            options = opt.options || [],
            inputValue = opt.value || pk.attribute(el, 'value') || [],
            inputName = opt.name || pk.attribute(el, 'name') || 'pk-select-' + pk.getRand(1, 999),
            dropdown = Boolean(opt.dropdown),
            inputMultiple = (Boolean(opt.multiple) === true || pk.attribute(el, 'multiple')) ? true : false,
            inputPlaceholder = opt.placeholder || pk.attribute(el, 'placeholder') || 'Please select...',
            // listeners=opt.listeners === undefined ? {} : opt.listeners,            
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0;

        inputName = (inputMultiple && inputName.indexOf('[]') === -1) ? inputName + '[]' : inputName.replace('[]', '');

        // input value is now an array
        inputValue = pk.toArr(inputValue);

        // populate options if none present and the underlying element is SELECT or UL
        if (options.length === 0 && (el.nodeName === "SELECT" || el.nodeName === "UL")) {
            for (var i = 0; i < el.children.length; i++) {
                var oVal = pk.attribute(el.children[i], 'value'),
                    oName = el.children[i].innerHTML;
                oVal = oVal || oName;
                if (pk.attribute(el.children[i], 'selected') && inputValue.indexOf(oVal) === -1) {
                    inputValue.push(oVal);
                }
                options.push({
                    name: oName,
                    value: oVal
                });
            }
        }

        // build the template
        var tpl = "<div class='pk-select " + (dropdown ? 'pk-select-dropdown' : '') + " " + (inputDisabled ? 'pk-disabled' : '') + "' tabindex='" + inputTabIndex + "'>\
                <input type='hidden' name='" + inputName + "'/>\
                <div class='pk-select-value " + (!inputValue || inputValue.length < 1 ? 'pk-placeholder' : '') + "'>sdsd</div>\
            <ul>";
        for (var o in options) {
            tpl += "<li class='pk-option' data-value='" + options[o].value + "'>" + options[o].name + "</li>";
        }
        tpl += "</ul></div>";

        el.innerHTML = '';
        el = pk.replaceEl(el, tpl);

        var triggerEl = el.children[1],
            inputEl = el.children[0],
            optionsEl = el.children[2];

        if (dropdown && !inputDisabled) {
            var overlayEl = document.body.insertBefore(pk.createEl("<div class='pk-overlay'></div>"), document.body.children[0]);
            pk.bindEvent('click', overlayEl, function() {
                pk.removeClass(overlayEl, 'pk-show');
                pk.toggleClass(el, 'pk-show');
            });
            pk.bindEvent('click', el, function(e) {

                if (pk.attribute(e.target, 'data-value') && pk.hasClass(e.target, 'pk-select-value-tag')) {
                    inputValue = pk.collide(inputValue, pk.attribute(e.target, 'data-value'), 2);
                    updateValue();
                }


                if (pk.hasClass(e.target, 'pk-select-value-tag') || (inputMultiple && pk.hasClass(e.target, 'pk-option')) || !pk.hasClass(el, 'pk-show')) {
                    pk.addClass(overlayEl, 'pk-show');
                    pk.addClass(el, 'pk-show');
                } else {
                    pk.removeClass(overlayEl, 'pk-show');
                    pk.removeClass(el, 'pk-show');
                }

            });
        }


        function updateValue() {
            var valueHTML = '';
            if (!inputMultiple) {
                inputValue.splice(1, inputValue.length - 1);
            }
            for (var o in options) {
                options[o].selected = (inputValue.indexOf(options[o].value) !== -1) ? true : false;
                pk.toggleClass(optionsEl.children[o], 'pk-selected', options[o].selected);
                if (options[o].selected) {
                    valueHTML = inputMultiple ? valueHTML += "<span class='pk-select-value-tag' data-value='" + options[o].value + "'>" + options[o].name + "</span>" : options[o].name;
                }
            }
            triggerEl.innerHTML = valueHTML ? valueHTML : inputPlaceholder;
            if (inputValue.length < 1) {
                pk.addClass(triggerEl, 'pk-placeholder');
            } else {
                pk.removeClass(triggerEl, 'pk-placeholder');
            }
            // update underlying input element
            inputEl.value = inputMultiple ? inputValue : inputValue.join('');
        }
        if (!inputDisabled) {
            pk.bindEvent('click', optionsEl, function(e) {
                if (e.target.nodeName === "LI") {
                    inputValue = inputMultiple ? pk.collide(inputValue, options[pk.getIndex(e.target)].value, 3) : pk.collide(inputValue, options[pk.getIndex(e.target)].value);
                    updateValue();
                }
            });
        }
        updateValue();
    };
    return pk;
})(pk);

var pk = pk || {};
(function(pk) {
    pk.slider = function(opt) {
        var el = opt.element,
            units = opt.units === undefined ? '' : opt.units,
            listeners = opt.listeners === undefined ? {} : opt.listeners,
            min = opt.min || 0,
            max = opt.max || 100,
            axis = opt.axis,
            range = Math.abs(max - min),
            inputValue = opt.value || el.getAttribute('value') || 0,
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName = opt.name || el.getAttribute('name') || 'pk-slider-' + pk.getRand(1, 999),
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0;

        if (!axis || !(axis.indexOf("x") < 0 || axis.indexOf("y") < 0)) {
            axis = "x";
        }

        var tpl = "<div class='pk-slider pk-slider-" + axis + " " + (inputDisabled ? 'pk-disabled' : '') + "' tabindex='" + inputTabIndex + "'>\
            <input type='hidden' name='" + inputName + "' " + inputDisabled + " value='" + inputValue + "'/>\
            <div class='pk-slider-bar'>\
                <span class='pk-slider-value'></span><span class='pk-slider-units'></span>\
            </div>\
            <div class='pk-slider-mask'></div>\
        </div>";
        el = pk.replaceEl(el, tpl);
        var maskEl = el.children[2],
            barEl = el.children[1],
            inputEl = el.children[0],
            valueEl = barEl.children[0],
            unitsEl = barEl.children[1];


        pk.bindListeners(listeners, inputEl);
        pk.drag({
            element: maskEl,
            contain: {
                element: el
            },
            move: false,
            listeners: {
                dragging: function(el, e) {
                    if (obj.disabled()) {
                        return false;
                    }
                    var perc = axis === "x" ? (e.dragDist.x + e.dragOffset.x) / pk.layout(el).width : 1 - (e.dragDist.y + e.dragOffset.y) / pk.layout(el).height;
                    perc = perc < 0 ? 0 : perc;
                    perc = perc > 1 ? 1 : perc;
                    obj.val(min + Math.round(perc * range));
                    if (listeners & listeners.sliding) {
                        listeners.sliding(el, e);
                    }
                },
                dragstart: function(el, e) {
                    if (obj.disabled()) {
                        return false;
                    }
                    if (listeners & listeners.slidestart) {
                        listeners.slidestart(el, e);
                    }
                },
                dragend: function(el, e) {
                    if (obj.disabled()) {
                        return false;
                    }
                    if (listeners & listeners.slideend) {
                        listeners.slideend(el, e);
                    }
                }
            }
        });
        pk.bindEvent('click', maskEl, function(e) {
            if (obj.disabled()) {
                return false;
            }
            var perc = axis === "x" ? ((e.clientX - maskEl.getBoundingClientRect().left) / pk.layout(el).width) : 1 - ((e.clientY - maskEl.getBoundingClientRect().top) / pk.layout(el).height);
            obj.val(min + Math.round(perc * range));
        });
        pk.bindEvent("mousewheel", el, function(e) {
            pk.preventBubble(e);
            if (obj.disabled()) {
                return false;
            }
            var offset = 0.1;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset = offset * -1;
            }
            obj.val(range * offset + parseInt(obj.val(), 0));
        });
        var obj = {
            0: el,
            val: function(val, force) {
                if (val === undefined || (obj.disabled() && !force)) {
                    return inputEl.value;
                }
                val = val < min ? min : val;
                val = val > max ? max : val;
                inputEl.value = val;
                if (axis === "x") {
                    barEl.style.width = (val - min) * 100 / range + '%';
                } else {
                    barEl.style.height = (val - min) * 100 / range + '%';
                }
                valueEl.innerHTML = val;
                unitsEl.innerHTML = units;
            },
            disabled: function(val) {
                if (val !== undefined) {
                    pk.toggleClass(el, 'pk-disabled', val);
                    pk.attribute(inputEl, 'disabled', val);
                }
                return pk.attribute(inputEl, 'disabled');
            }
        };
        obj.val(inputValue, true);
        return obj;
    };
    return pk;
})(pk);

var pk = pk || {};
(function(pk) {
    pk.toggle = function(opt) {
        var el = opt.element,
            options = opt.options || [],
            // more complex as can take true/false values
            inputValue = opt.value !== undefined ? opt.value : pk.attribute(el, 'value') !== undefined ? pk.attribute(el, 'value') : options[0].value,
            listeners = opt.listeners === undefined ? {} : opt.listeners,
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName = opt.name || el.getAttribute('name') || 'pk-toggle-' + pk.getRand(1, 999),
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0;

        if (!options) {
            return;
        }

        var tpl = "<div class='pk-toggle pk-noselect " + (inputDisabled ? 'pk-disabled' : '') + "' tabindex='" + inputTabIndex + "'>\
			<input type='hidden' name = '" + inputName + "' value='" + inputValue + "'/>\
			<div class='pk-toggle-indicator' style='width:" + (100 / options.length) + "%'></div>\
		</div>";

        tpl += "";
        el.innerHTML = '';
        el = pk.replaceEl(el, tpl);

        var optionEl = [];
        for (var o in options) {
            var oEl = pk.createEl("<div class='pk-option' style='width:" + (100 / options.length) + "%' data-value='" + options[o].value + "'>" + options[o].name + "</div>");
            el.appendChild(oEl);
            optionEl.push(oEl);
        }

        var inputEl = el.children[0],
            indicatorEl = el.children[1];

        var obj = {
            val: function(val) {
                if (val === undefined) {
                    return inputEl.value;
                }
                val = val.toString() || options[0].value.toString();
                for (var o in options) {
                    if (options[o].value.toString() === val) {
                        indicatorEl.style.left = parseInt(o, 0) * 100 / options.length + '%';
                        inputEl.value = val;
                        pk.addClass(optionEl[o], 'pk-selected');
                    } else {
                        pk.removeClass(optionEl[o], 'pk-selected');
                    }
                }
            },
            disabled: function(val) {
                if (val !== undefined) {
                    pk.toggleClass(el, 'pk-disabled', val);
                    pk.attribute(inputEl, 'disabled', val);
                }
                return pk.attribute(inputEl, 'disabled');
            }
        };
        obj.val(inputValue);

        function clickOpt(e) {
            obj.val(pk.attribute(e.target, 'data-value'));
        }
        for (o in optionEl) {
            pk.bindListeners(listeners, optionEl[o]);
            if (!inputDisabled) {
                pk.bindEvent('click', optionEl[o], clickOpt);
            }
        }
        return obj;
    };
    return pk;
})(pk);
