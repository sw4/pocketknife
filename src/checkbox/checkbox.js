var pk = pk || {};
(function(pk) {
    pk.checkbox = function(opt) {
        var el = opt.element,
            //    listeners = opt.listeners === undefined ? {} : opt.listeners,
            inputValue = opt.value || el.getAttribute('value') || 0,
            inputLabel = opt.label || el.getAttribute('label') || el.innerHTML,
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName = opt.name || el.getAttribute('name') || 'pk-checkbox-' + pk.getRand(1, 999),
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0;

        /*jshint multistr:true */
        var str = "<label class='pk-checkbox' for='" + inputName + "'>\
		<input type = 'checkbox'  id = '" + inputName + "'  name = '" + inputName + "'  value = '" + inputValue + "'  tabindex = '" + inputTabIndex + "' / >\
            <span class = 'pk-label' > " + inputLabel + " </span>\
		</label>";
        el.innerHTML = '';
        el = pk.replaceEl(el, str);

        var obj = {
            0: el,
            val: function(val) {
                if (val === undefined) {
                    return inputValue;
                }
                pk.attribute(el.children[0], 'checked', Boolean(val));
            },
            disabled: function(val) {
                if (val !== undefined) {
                    pk.toggleClass(el, 'pk-disabled', Boolean(val));
                    pk.attribute(el.children[0], 'disabled', Boolean(val));
                }
                return pk.attribute(el.children[0], 'disabled');
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
