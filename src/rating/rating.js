var pk = pk || {};


/**
Create a new stages control

<div class='info-well'>
See entry for `pk.rating`, for which `pk.stages` is an augmented psuedonym 
</div>

HTML:

	<input id='stages' />
	
Javascript:

	pk.rating({
		element: document.getElementById('stages'),
		value: 6
	});

@class pk.stages 
@constructor
@chainable
*/


/**
Create a new rating control

HTML:

	<input id='rating' />
	
Javascript:

	pk.rating({
		element: document.getElementById('rating'),
		value: 3
	});

@class pk.rating 
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to control
@param options.count {Number} Number of items
@param [options.value=0] {String} Value of initially selected option, defaults to the attribute value set on the passed element, or `0`
@param [options.name=pk-toggle-RandInt] {String} Name of underlying input control, defaults to the attribute value set on the passed element, or `pk-toggle-RandInt`
@param [options.tabindex=0] {Number} Tabindex of control, defaults to the attribute value set on the passed element, or `0`
@param [options.disabled=false] {Boolean} Disabled state of control, defaults to the attribute value set on the passed element, or `false`
@param [options.listeners] {Object} Object array of event listeners to bind to underlying input(s)
@return Object {Object} Consisting of original DOM element (item `0`) and class methods (see below)
@chainable
*/
(function(pk) {
    pk.rating = function(opt) {
        var el = opt.element,
            listeners = opt.listeners === undefined ? {} : opt.listeners,
            inputValue = opt.value || el.getAttribute('value') || 0,
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName = opt.name || el.getAttribute('name') || 'pk-rating-' + pk.getRand(1, 999),
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0,
            lastVal = inputValue,
			count=opt.count || 5;


			
        /*jshint multistr:true */
        var str = "<div class='"+ (opt.stages ? 'pk-stages' : 'pk-rating') +"'><fieldset tabindex='"+inputTabIndex+"'>";
			for(var o = count; o > 0; o--){			 
				var style='';
				if(opt.stages){
					style="style='width:"+(100/count)+"%;z-index:"+(count-o)+"'";
				}
				str+="<input type='radio' id='" + inputName + "_"+o+"' name='" + inputName + "' value='"+o+"'/><label for='" + inputName + "_"+o+"' data-label='"+o+"' "+style+"></label>";			
			}				
            str+="</fieldset></div>";
        el = pk.replaceEl(el, str);

        var rEl = [];
        rEl.push(el.children[0].children[8]);
        rEl.push(el.children[0].children[6]);
        rEl.push(el.children[0].children[4]);
        rEl.push(el.children[0].children[2]);
        rEl.push(el.children[0].children[0]);
        pk.bindListeners(listeners, rEl[0]);
        pk.bindListeners(listeners, rEl[1]);
        pk.bindListeners(listeners, rEl[2]);
        pk.bindListeners(listeners, rEl[3]);
        pk.bindListeners(listeners, rEl[4]);

        pk.bindEvent("mousewheel", el, function(e) {
            pk.preventBubble(e);
            var offset = 1;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset = -1;
            }
            obj.val(obj.val() + offset);
        });

        function clickHandler() {
            if (lastVal === obj.val()) {
                obj.val(obj.val() - 1);
            }
            lastVal = obj.val();
        }
        for (var i = 0; i < rEl.length; i++) {
            pk.bindEvent('click', rEl[i], clickHandler);
        }
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
            0: el,
            val: function(val) {
                if (val === undefined) {
                    for (var r in rEl) {
                        if (rEl[r].checked) {
                            val = rEl[r].value;
                            break;
                        }
                    }
                    return parseInt(val === undefined ? 0 : val, 0);
                }
                val = val < 0 ? 0 : val;
                val = val > 5 ? 5 : val;
                if (val === 0) {
                    rEl[0].checked = true;
                    rEl[0].checked = false;
                } else {
                    rEl[val - 1].checked = true;
                }
                lastVal = val;
            },
            disabled: function(val) {
                if (val !== undefined) {
                    pk.toggleClass(el, 'pk-disabled', val);
                    for (var r = 0; r < rEl.length; r++) {
                        pk.attribute(rEl[r], 'disabled', val);
                    }
                }
                return pk.attribute(rEl[0], 'disabled');
            }
        };
        obj.val(inputValue);
        if (inputDisabled) {
            obj.disabled(true);
        }
        return obj;
    }; 
	pk.stages = function(opt) {
		opt.stages=true;
		return pk.rating(opt);
	};	
    return pk;
	
})(pk);
