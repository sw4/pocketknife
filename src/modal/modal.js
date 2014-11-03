var pk = pk || {};

/**
Create a new modal component
@class pk.modal
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to component
@param [options.header] {String} Modal header content (`HTML` allowed)
@param [options.content] {String} Modal body content (`HTML` allowed)
@param [options.draggable] {Boolean} Whether to allow modal dragging
@returns Object {Object} Consisting of original DOM element (item `0`) and class methods (see below)
@chainable
*/

(function(pk) {
    pk.modal = function(opt) {
        var h = opt.header,
            c = opt.content;
        /*jshint multistr: true */
        var tpl = "<div class='pk-modal-mask'>\
			<div class='pk-modal-box pk-animated'>\
				<div class='pk-modal-header'>" + h + "<span class='pk-modal-close'></span></div>\
				<div class='pk-modal-content'>" + c + "</div>\
			</div>\
		</div>";

        var el = pk.createEl(tpl),
            box = el.children[0],
            header = box.children[0],
            close = header.children[0];

        if (document.body.children.length > 0) {
            document.body.insertBefore(el, document.body.children[0]);
        } else {
            document.body.appendChild(el);
        }

        function closeModal() {
            pk.removeClass(el, 'pk-show');
            setTimeout(function() {
                el.parentNode.removeChild(el);
            }, 500);
        }
        pk.bindEvent("click", el, function(e) {
            if (e.target !== el) {
                return;
            }
            closeModal();
        });
        pk.bindEvent("click", close, closeModal);
        pk.bindEvent("resize", window, function() {
            pk.center(box);
        });
        setTimeout(function() {
            pk.addClass(el, 'pk-show');
        }, 10);

        var boxH = box.offsetHeight || 0;
        setInterval(function() {
            var boxHN = box.offsetHeight;
            if (boxH !== boxHN) {
                pk.center(box);
                boxH = boxHN;
            }
        }, 500);
        pk.center(box);

        if (opt.draggable !== false && pk.drag) {
            pk.drag({
                element: box,
                handle: header,
                move: true,
                listeners: {
                    dragstart: function() {
                        pk.removeClass(box, 'pk-animated');
                    },
                    dragend: function() {
                        pk.addClass(box, 'pk-animated');
                    }
                }
            });
        }
        /**
        Closes modal and removes from DOM
        @method close
        */
        return {
            0: el,
            close: closeModal
        };
    };
    return pk;
})(pk);
