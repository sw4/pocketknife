var pk = pk || {};
/**
Create a new slider control

HTML:

	<input id='slider' />
	
Javascript:

	pk.slider({
		element: document.getElementById('slider'),
		units: 'mm',
		min: 30,
		max: 980, 
		value: 133
	});
	
@class pk.slider
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to control
@param [options.value=0] {Number} Initial value, defaults to the attribute value set on the passed element, or `0`
@param [options.axis=x] {String} Either `x` (horizontal) or `y` (vertical), ignored if slider is circle
@param [options.min=0] {Number} Minimum value
@param [options.max=100] {Number} Maximum value
@param [options.decimals=0] {Number} Number of decimal places
@param [options.name=pk-slider-RandInt] {String} Name of underlying input control, defaults to the attribute value set on the passed element, or `pk-slider-RandInt`
@param [options.tabindex=0] {Number} Tabindex of control, defaults to the attribute value set on the passed element, or `0`
@param [options.disabled=false] {Boolean} Disabled state of control, defaults to the attribute value set on the passed element, or `false`
@param [options.listeners] {Object} Object array of event listeners to bind to underlying input(s)
@param [options.circle=false] {Object} Object array of properties to define circular slider
@param [options.circle.stroke=20] {Number} Stroke width of slider circle
@return Object {Object} Consisting of original DOM element (item `0`) and class methods (see below)
@chainable
*/
(function(pk) {
    pk.slider = function(opt) {
        var el = opt.element,
            units = opt.units === undefined ? '' : opt.units,
            listeners = opt.listeners === undefined ? {} : opt.listeners,
            min = opt.min || 0,
            max = opt.max || 100,
            decimals = opt.decimals || 0,
            axis = opt.axis || "x",
            range = Math.abs(max - min),
            inputValue = opt.value || el.getAttribute('value') || 0,
            inputDisabled = (opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName = opt.name || el.getAttribute('name') || 'pk-slider-' + pk.getRand(1, 999),
            inputTabIndex = opt.tabindex || el.getAttribute('tabindex') || 0,
			circle = opt.circle || false;
			// circle=false;
			if(circle){			
				circle={
					stroke:circle.stroke || 20
				}
			}

        if (!axis || !(axis.indexOf("x") < 0 || axis.indexOf("y") < 0)) {
            axis = "x";
        }

        var tpl = "<div class='pk-slider pk-slider-" + axis + " " + (inputDisabled ? 'pk-disabled' : '') + " " +(circle ? 'pk-slider-circle': '') + "' tabindex='" + inputTabIndex + "'>\
            <input type='hidden' name='" + inputName + "' " + inputDisabled + " value='" + inputValue + "'/>\
        </div>";
		
		/*
		var tpl = "<div class='pk-slider pk-slider-" + axis + " " + (inputDisabled ? 'pk-disabled' : '') + "' tabindex='" + inputTabIndex + "'>\
            <input type='hidden' name='" + inputName + "' " + inputDisabled + " value='" + inputValue + "'/>\            
        </div>";
		*/
        el = pk.replaceEl(el, tpl);
		var l=pk.layout(el);
		var d = l.height > l.width ? l.height : l.width;
		function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
		  return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		  };
		}

		function describeArc(x, y, radius, startAngle, endAngle){
			endAngle = endAngle == 360 || endAngle > 360 ? 359.9 : endAngle ;
			var start = polarToCartesian(x, y, radius, endAngle);
			var end = polarToCartesian(x, y, radius, startAngle);

			var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

			var d = [
				"M", start.x, start.y, 
				"A", radius, radius, 0, arcSweep, 0, end.x, end.y
			].join(" ");

			return d;       
		}
		
		var innerTpl='';
		if(circle){			
			innerTpl="<svg height='"+d+"' width='"+d+"' xmlns='http://www.w3.org/2000/svg' version='1.1'>\
			   <circle class='pk-slider-circle' cx='"+d/2+"' cy='"+d/2+"' r='"+((d-circle.stroke)/2)+"' stroke='black' stroke-width='"+circle.stroke+"' fill='none' />\
			   <path x='"+d/2+"' y='"+d/2+"' fill='none' stroke='red' d='' stroke-width='"+circle.stroke+"'/>\
			</svg>";
			el.appendChild(pk.createEl(innerTpl));
			el.appendChild(pk.createEl("<span class='pk-slider-monitor'><span class='pk-slider-value'></span><span class='pk-slider-units'></span></span>"));
			
		}else{
			// get biggest dimension
			innerTpl="<div class='pk-slider-bar pk-animated'>\
                <span class='pk-slider-value'></span><span class='pk-slider-units'></span>\
            </div>";
			el.appendChild(pk.createEl(innerTpl));
		}
		
		var pathEl = el.children[1].children[1]; 
		pk.attribute(pathEl, 'd', describeArc(d/2, d/2, (d-circle.stroke)/2, 0, 360));
		

        var indicatorEl = circle ? el.children[1].children[1] : el.children[1],
            inputEl = el.children[0],
            valueEl = circle ? el.children[2].children[0] : indicatorEl.children[0],
            unitsEl = circle ? el.children[2].children[1] : indicatorEl.children[1];

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
            element: el,
            contain: {
                element: el
            },
            move: false,
            listeners: {
                dragging: function(el, e) {
                    if (obj.disabled()) {
                        return false;
                    }
					var perc=0;
				    var p =pk.layout(el,e);
					if(circle){
						var origin={
							x:p.left+(p.width/2),
							y:p.top+(p.height/2)
						}
						if(e.pageX >= origin.x){
							perc = 90-Math.atan((origin.y-e.pageY)/(e.pageX-origin.x))*180/Math.PI;					 
						}else{					 
							perc = 180+(90-Math.atan((origin.y-e.pageY)/(e.pageX-origin.x))*180/Math.PI);
						}		
						perc=perc/360;						
					}else{
						perc = axis === "x" ? (e.dragDist.x + e.dragOffset.x) / pk.layout(el).width : 1 - (e.dragDist.y + e.dragOffset.y) / pk.layout(el).height;
						perc = perc < 0 ? 0 : perc;
						perc = perc > 1 ? 1 : perc;
						
					}
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
                    pk.removeClass(indicatorEl, 'pk-animated');
                },
                dragend: function(el, e) {
                    if (obj.disabled()) {
                        return false;
                    }
                    if (listeners && listeners.slideend) {
                        listeners.slideend(el, e);
                    }
                    pk.addClass(indicatorEl, 'pk-animated');
                }
            }
        });
		
        pk.bindEvent('click', el, function(e) {
            if (obj.disabled()) {
                return false;
            }
			var perc=0;
			if(circle){			
				var p =pk.position(el,e);
				var origin={
					x:p.left+(p.width/2),
					y:p.top+(p.height/2)
				}
				if(e.pageX >= origin.x){
					perc = 90-Math.atan((origin.y-e.pageY)/(e.pageX-origin.x))*180/Math.PI;					 
				}else{					 
					perc = 180+(90-Math.atan((origin.y-e.pageY)/(e.pageX-origin.x))*180/Math.PI);
				}		
				perc=perc/360;					
			}else{
				perc = axis === "x" ? ((e.clientX - el.getBoundingClientRect().left) / pk.layout(el).width) : 1 - ((e.clientY - el.getBoundingClientRect().top) / pk.layout(el).height);
			}
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
				if(circle){  
					pk.attribute(pathEl, 'd', describeArc(d/2, d/2, (d-circle.stroke)/2, 0, (val - min) *360 / range));						
				}else{
					if (axis === "x") {
						indicatorEl.style.width = (val - min) * 100 / range + '%';
					} else {
						indicatorEl.style.height = (val - min) * 100 / range + '%';
					}
				}
                valueEl.innerHTML = val.toFixed(decimals);
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
