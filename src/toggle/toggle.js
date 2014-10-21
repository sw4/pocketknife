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
                        indicatorEl.style.left = (pk.layout(el).width / options.length * o) + 'px';
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
