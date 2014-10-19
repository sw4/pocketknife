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
