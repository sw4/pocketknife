var pk = pk || {};
/**
Utility class for creating draggable elements
@class pk.drag
@constructor
@param options {Object}
@param options.element {Object} DOM element to attach drag handlers to
@param [options.handle=element] {Object} DOM element (child of `element`) to use as drag handle
@param options.move {Object} Show movement during drag, either `true`, `false` or an object consisting of `x` and `y` {Boolean} values
@param options.container {Object} Object containing details about container
@param options.container.element=document.body {Object} DOM element used as container, defaults to `document.body`
@param options.container.style=restrict {String} Type of containment, either `restrict`, `snap` or {Object} consisting of `x` and `y` values calculated relative to `container.element`
@param [options.listeners] {Object} Object array of event listeners to bind to underlying element(s) - consisting of `dragstart`, `dragend` and `dragging`
@returns Object {Object} Consisting of original DOM element (item `0`)
@chainable
*/
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
/**
Fired on drag event starting
@event dragstart
@param element {Object} Element event fired on
@param event {Object} Event object
*/

/**
Fired on during drag event
@event dragging
@param element {Object} Element event fired on
@param event {Object} Event object
*/

/**
Fired on drag event ending
@event dragend
@param element {Object} Element event fired on
@param event {Object} Event object
*/
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
                w = container.element.tagName === "BODY" ? document.documentElement.clientWidth : container.element.offsetWidth,
				oX = container.style.x || 0, oY = container.style.y || 0;

            if (m.x && el.offsetLeft < (0 + oX)) {
                el.style.left = (0 + oX) + 'px';
            } else if (m.x && el.offsetLeft > w - el.offsetWidth - oX) {
                el.style.left = w - el.offsetWidth - oX + 'px';
            }
            if (m.y && el.offsetTop < (0 + oY)) {
                el.style.top = (0 + oY) + 'px';
            } else if (m.y && el.offsetTop > h - el.offsetHeight - oY) {
                el.style.top = h - el.offsetHeight - oY + 'px';
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
            if (container.style === "restrict" || container.style.x || container.style.y) {
                contain();
            }
            if (fn && fn.dragging) {
                fn.dragging(el, e);
            }
        });
		return obj{
			0:el
		}
    };
})(pk);
