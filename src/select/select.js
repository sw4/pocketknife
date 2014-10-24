var pk = pk || {};
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

        // build the template
        var tpl = "<div class='pk-select " + (inputMultiple ? 'pk-select-multiple' : '') + " " + (dropdown ? 'pk-select-dropdown' : '') + " " + (inputDisabled ? 'pk-disabled' : '') + "' tabindex='" + inputTabIndex + "'>\
                <input type='hidden' name='" + inputName + "'/>\
                <div class='pk-select-value " + (!inputValue || inputValue.length < 1 ? 'pk-placeholder' : '') + "'>sdsd</div>\
            <ul>";
        for (var o in options) {
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
            for (var o in options) {
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
    };
    return pk;
})(pk);
