var pk = pk || {};
(function(pk) {
    pk.modal = function(opt) {
        var h = opt.header,
            c = opt.content;

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

        if (opt.drag !== false && pk.drag) {
            pk.drag({
                element: box,
                handle: header,
                move: true,
				listeners:{
					dragstart:function(){
						pk.removeClass(box, 'pk-animated');
					},
					dragend:function(){
						pk.addClass(box, 'pk-animated');
					}
				}
            });
        }
    };
    return pk;
})(pk);
