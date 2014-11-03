var pk = pk || {};
/**
Create a new slider control
@class pk.slider
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to control
@param [options.value=0] {Number} Initial value, defaults to the attribute value set on the passed element, or `0`
@param [options.min=0] {Number} Minimum value
@param [options.max=100] {Number} Maximum value
@param [options.name=pk-slider-RandInt] {String} Name of underlying input control, defaults to the attribute value set on the passed element, or `pk-slider-RandInt`
@param [options.tabindex=0] {Number} Tabindex of control, defaults to the attribute value set on the passed element, or `0`
@param [options.disabled=false] {Boolean} Disabled state of control, defaults to the attribute value set on the passed element, or `false`
@param [options.listeners] {Object} Object array of event listeners to bind to underlying input(s)
@returns Object {Object} Consisting of original DOM element (item `0`) and class methods (see below)
@chainable
*/
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
            <div class='pk-slider-bar pk-animated'>\
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

        /**
        Fired on slide event starting
        @event slidestart
        @param element {Object} Element event fired on
        @param event {Object} Event object
        */

        /**
        Fired on during slide event
        @event sliding
        @param element {Object} Element event fired on
        @param event {Object} Event object
        */

        /**
        Fired on slide event ending
        @event slideend
        @param element {Object} Element event fired on
        @param event {Object} Event object
        */
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
                    if (listeners && listeners.sliding) {
                        listeners.sliding(el, e);
                    }
                },
                dragstart: function(el, e) {
                    if (obj.disabled()) {
                        return false;
                    }
                    if (listeners && listeners.slidestart) {
                        listeners.slidestart(el, e);
                    }
                    pk.removeClass(barEl, 'pk-animated');
                },
                dragend: function(el, e) {
                    if (obj.disabled()) {
                        return false;
                    }
                    if (listeners && listeners.slideend) {
                        listeners.slideend(el, e);
                    }
                    pk.addClass(barEl, 'pk-animated');
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
        /**
        Gets or sets control value
        @method val
        @param [value] {Number} Value to set
        @return {Number} Returns current value
        */

        /**
        Gets or sets control disabled state
        @method disabled
        @param [boolean] {Boolean} Disabled state
        @return {Boolean} Returns disabled state
        */
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
