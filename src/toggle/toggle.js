var pk = pk || {};
/**
Create a new toggle control
@class pk.toggle
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to control
@param options.options {Object} Object array of control options
@param options.options.value {String} Option value
@param options.options.name {String} Option name (displayed label)
@param [options.value=0] {String} Value of initially selected option, defaults to the attribute value set on the passed element, or `0`
@param [options.name=pk-toggle-RandInt] {String} Name of underlying input control, defaults to the attribute value set on the passed element, or `pk-toggle-RandInt`
@param [options.tabindex=0] {Number} Tabindex of control, defaults to the attribute value set on the passed element, or `0`
@param [options.disabled=false] {Boolean} Disabled state of control, defaults to the attribute value set on the passed element, or `false`
@param [options.listeners] {Object} Object array of event listeners to bind to underlying input(s)
@returns Object {Object} Consisting of original DOM element (item `0`) and class methods (see below)
@chainable
*/
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

        var tpl = "<div class='pk-toggle " + (inputDisabled ? 'pk-disabled' : '') + "' tabindex='" + inputTabIndex + "'>\
			<input type='hidden' name = '" + inputName + "' value='" + inputValue + "'/>\
			<div class='pk-toggle-indicator' style='width:" + (100 / options.length) + "%'></div>\
		</div>";

        tpl += "";
        el.innerHTML = '';
        el = pk.replaceEl(el, tpl);

        var optionEl = [];
        for (var o=0;o< options.length;o++) {
            var oEl = pk.createEl("<div class='pk-option' style='width:" + (100 / options.length) + "%' data-value='" + options[o].value + "'>" + options[o].name + "</div>");
            el.appendChild(oEl);
            optionEl.push(oEl);
        }

        var inputEl = el.children[0],
            indicatorEl = el.children[1];
/**
Gets or sets control value
@method val
@param [value] {String} Value to set
@return {String} Returns current value
*/     

/**
Gets or sets control disabled state
@method disabled
@param [boolean] {Boolean} Disabled state
@return {Boolean} Returns disabled state
*/ 
        var obj = {
			0:el,
            val: function(val) {
                if (val === undefined) {
                    return inputEl.value;
                }
                val = val.toString() || options[0].value.toString();
                for (var o=0;o< options.length;o++) {
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
        for (o=0;o< options.length;o++) {
            pk.bindListeners(listeners, optionEl[o]);
            if (!inputDisabled) {
                pk.bindEvent('click', optionEl[o], clickOpt);
            }
        }
        return obj;
    };
    return pk;
})(pk);
