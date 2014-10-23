var pk = pk || {};
(function(pk) {
    pk.carousel = function(opt) {

        var el = opt.element,
            options = opt.options || [],
            value = opt.value || 0,
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0;


        if (options.length === 0 && el.nodeName === "UL") {
            for (var i = 0; i < el.children.length; i++) {
                options.push(el.children[i].innerHTML);
            }
        }

        var tpl = "<div class='pk-carousel pk-noselect' tabindex='" + inputTabIndex + "'><ul>",
            navEl = [],
            optionEl = [];
        for (var o = 0; o < options.length; o++) {
            optionEl.push(pk.createEl("<li class='pk-option'>" + options[o] + "</li>"));
            navEl.push(pk.createEl("<span class='pk-nav-item' data-nav='=" + o + "'></span>"));
        }
        tpl += "</ul><span class='pk-nav-prev' data-nav='-1'></span><span data-nav='+1' class='pk-nav-next'></span></div>";

        el.innerHTML = '';
        el = pk.replaceEl(el, tpl);
        for (o = 0; o < options.length; o++) {
            el.children[0].appendChild(optionEl[o]);
            el.appendChild(navEl[o]);
        }

        function clickHandler(e) {
            obj.val(pk.attribute(e.target, 'data-nav'));
        }
        for (var c in el.children) {
            if (pk.attribute(el.children[c], 'data-nav')) {
                pk.bindEvent('click', el.children[c], clickHandler);
            }
        }

        pk.bindEvent("mousewheel", el, function(e) {
            pk.preventBubble(e);
            obj.val((e.wheelDelta > 0 || e.detail < 0) ? '-1' : '+1');
        });

        pk.bindEvent('keydown', el, function(e) {
            switch (e.keyCode) {
                case 34: //page down
                case 40: //down cursor
                case 37: //left cursor
                    obj.val('-1');
                    break;
                case 33: //page up
                case 32: //spacebar				
                case 38: //up cursor
                case 39: //right cursor
                    obj.val('+1');
                    break;
                case 36: //home
                    obj.val(0);
                    break;
                case 35: //end
                    obj.val(options.length - 1);
                    break;
            }
            pk.preventBubble(e);
        });

        var obj = {
            val: function(val) {
                val = val.toString();
                if (val === undefined) {
                    return value;
                }
                if (val.indexOf("-") !== -1) {
                    value = value - parseInt(val.replace('-', ''), 0) < 0 ? options.length - 1 : --value;
                } else if (val.indexOf("+") !== -1) {
                    value = value + parseInt(val.replace('+', ''), 0) > options.length - 1 ? 0 : ++value;
                } else {
                    value = parseInt(val.replace('=', ''), 0);
                    value = value < 0 ? 0 : value > options.length - 1 ? options.length - 1 : value;
                }
                for (o = 0; o < options.length; o++) {
                    if (parseInt(o, 0) === value) {
                        pk.addClass(optionEl[o], 'pk-selected');
                        pk.addClass(navEl[o], 'pk-selected');
                    } else {
                        pk.removeClass(optionEl[o], 'pk-selected');
                        pk.removeClass(navEl[o], 'pk-selected');
                    }
                }
            }
        };
        obj.val(value);
        return obj;
    };
    return pk;
})(pk);
