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
            <input type='text' name='" + inputName + "' " + inputDisabled + " value='" + inputValue + "'/>\
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
                }
                return pk.attribute(inputEl, 'disabled', val);
            }
        };
        obj.val(inputValue, true);
        return obj;
    };
    return pk;
})(pk);
