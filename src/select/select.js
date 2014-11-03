var pk = pk || {};
/**
Create a new select control
@class pk.select
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to control
@param options.options {Object} Object array of control options
@param options.options.value {String} Option value
@param options.options.name {String} Option name (displayed label)
@param options.options.selected {Boolean} Option selected state
@param [options.value=0] {String} Value of initially selected option, defaults to the attribute value set on the passed element, or `0`
@param [options.name=pk-select-RandInt] {String} Name of underlying input control, defaults to the attribute value set on the passed element, or `pk-select-RandInt`
@param [options.placeholder=string] {String} Placeholder when no options selected, defaults to the attribute value set on the passed element, or `Please select...`
@param [options.multiple=false] {Boolean} Whether to allow multiple options to be selected, defaults to the attribute value set on the passed element, or `false`
@param [options.dropdown=false] {Boolean} Display options in dropdown list
@param [options.tabindex=0] {Number} Tabindex of control, defaults to the attribute value set on the passed element, or `0`
@param [options.disabled=false] {Boolean} Disabled state of control, defaults to the attribute value set on the passed element, or `false`
@returns Object {Object} Consisting of original DOM element (item `0`) and class methods (see below)
@chainable
*/
(function(pk) {
    pk.select = function(opt) {

        var el = opt.element,
            options = opt.options || [],
            inputValue = opt.value || pk.attribute(el, 'value') || [],
            inputName = opt.name || pk.attribute(el, 'name') || 'pk-select-' + pk.getRand(1, 999),
            dropdown = Boolean(opt.dropdown),
            inputMultiple = (Boolean(opt.multiple) === true || pk.attribute(el, 'multiple')) ? true : false,
            inputPlaceholder = opt.placeholder || pk.attribute(el, 'placeholder') || 'Please select...',
            // listeners=opt.listeners === undefined ? {} : opt.listeners,            
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0;

        inputName = (inputMultiple && inputName.indexOf('[]') === -1) ? inputName + '[]' : inputName.replace('[]', '');

        // input value is now an array
        inputValue = pk.toArr(inputValue);

        // populate options if none present and the underlying element is SELECT or UL
        if (options.length === 0 && (el.nodeName === "SELECT" || el.nodeName === "UL")) {
            for (var i = 0; i < el.children.length; i++) {
                var oVal = pk.attribute(el.children[i], 'value'),
                    oName = el.children[i].innerHTML;
                oVal = oVal || oName;
                if (pk.attribute(el.children[i], 'selected') && inputValue.indexOf(oVal) === -1) {
                    inputValue.push(oVal);
                }
                options.push({
                    name: oName,
                    value: oVal
                });
            }
        }

        /*jshint multistr:true */
        var tpl = "<div class='pk-select " + (inputMultiple ? 'pk-select-multiple' : '') + " " + (dropdown ? 'pk-select-dropdown' : '') + " " + (inputDisabled ? 'pk-disabled' : '') + "' tabindex='" + inputTabIndex + "'>\
                <input type='hidden' name='" + inputName + "'/>\
                <div class='pk-select-value " + (!inputValue || inputValue.length < 1 ? 'pk-placeholder' : '') + "'>sdsd</div>\
            <ul>";
        for (var o = 0; o < options.length; o++) {
            tpl += "<li class='pk-option' data-value='" + options[o].value + "'>" + options[o].name + "</li>";
        }
        tpl += "</ul></div>";

        el.innerHTML = '';
        el = pk.replaceEl(el, tpl);

        var triggerEl = el.children[1],
            inputEl = el.children[0],
            optionsEl = el.children[2];

        if (dropdown && !inputDisabled) {
            var overlayEl = document.body.insertBefore(pk.createEl("<div class='pk-overlay'></div>"), document.body.children[0]);
            pk.bindEvent('click', overlayEl, function() {
                pk.removeClass(overlayEl, 'pk-show');
                pk.toggleClass(el, 'pk-show');
            });
            pk.bindEvent('click', el, function(e) {

                if (pk.attribute(e.target, 'data-value') && pk.hasClass(e.target, 'pk-select-value-tag')) {
                    inputValue = pk.collide(inputValue, pk.attribute(e.target, 'data-value'), 2);
                    updateValue();
                }


                if (pk.hasClass(e.target, 'pk-select-value-tag') || (inputMultiple && pk.hasClass(e.target, 'pk-option')) || !pk.hasClass(el, 'pk-show')) {
                    pk.addClass(overlayEl, 'pk-show');
                    pk.addClass(el, 'pk-show');
                } else {
                    pk.removeClass(overlayEl, 'pk-show');
                    pk.removeClass(el, 'pk-show');
                }

            });
        }


        function updateValue() {
            var valueHTML = '';
            if (!inputMultiple) {
                inputValue.splice(1, inputValue.length - 1);
            }
            for (var o = 0; o < options.length; o++) {
                options[o].selected = (inputValue.indexOf(options[o].value) !== -1) ? true : false;
                pk.toggleClass(optionsEl.children[o], 'pk-selected', options[o].selected);
                if (options[o].selected) {
                    valueHTML = inputMultiple ? valueHTML += "<span class='pk-select-value-tag' data-value='" + options[o].value + "'>" + options[o].name + "</span>" : options[o].name;
                }
            }
            triggerEl.innerHTML = valueHTML ? valueHTML : inputPlaceholder;
            if (inputValue.length < 1) {
                pk.addClass(triggerEl, 'pk-placeholder');
            } else {
                pk.removeClass(triggerEl, 'pk-placeholder');
            }
            // update underlying input element
            inputEl.value = inputMultiple ? inputValue : inputValue.join('');
        }
        if (!inputDisabled) {
            pk.bindEvent('click', optionsEl, function(e) {
                if (e.target.nodeName === "LI") {
                    inputValue = inputMultiple ? pk.collide(inputValue, options[pk.getIndex(e.target)].value, 3) : pk.collide(inputValue, options[pk.getIndex(e.target)].value);
                    updateValue();
                }
            });
        }
        updateValue();
        return {
            0: el
        };
    };
    return pk;
})(pk);
