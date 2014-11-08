// Javascript Polyfill

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
// indexOf method

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        if (this === null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);
        var len = O.length || 0;

        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// Pocketknife Core
/**
@module pocketknife
*/
var pk = pk || {};
(function(pk) {
/**
@class pk
@static
*/

/**
For the passed event object prevent bubbling up the DOM tree
@method preventBubble
@param event {Object} Event Object
@return {Boolean} Returns `false`
*/

    pk.preventBubble = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    };

/**
For the passed element, toggle presence of CSS class
@method toggleClass
@param element {Object} DOM element
@param class {String} CSS class
@param toggle {Boolean} Optional. `true` to add class if not present, `false` to remove. If ommitted, method will detect and apply/remove as necessary.
@return {Boolean} `true` if class added, `false` if removed.
*/


    pk.toggleClass = function(el, c, t) {
        if (t === true) {
            pk.addClass(el, c);
            return true;
        } else if (t === false) {
            pk.removeClass(el, c);
            return false;
        }
        pk.toggleClass(el, c, !pk.hasClass(el, c));
        return pk.hasClass(el, c);
    };

/**
For the passed element, detect presence of CSS class
@method hasClass
@param element {Object} DOM element
@param class {String} CSS class
@return {Boolean} `true` if class found, `false` if not.
*/

    pk.hasClass = function(el, c) {
        var ca = el.getAttribute('class') || '';
        return (ca && ca.indexOf(c) > -1) ? true : false;
    };
/**
For the passed element, center horizontally and vertically within the parentNode
@method center
@param element {Object} DOM element
@return {Object} Returns passed DOM element
@chainable
*/    
    pk.center = function(el) {
        el.style.top = el.parentNode.clientHeight / 2 - (el.offsetHeight / 2) + 'px';
        el.style.left = el.parentNode.clientWidth / 2 - (el.offsetWidth / 2) + 'px';
   return el;
/**
For the passed element, get the passed style property value
@method getStyle
@param element {Object} DOM element
@param property {String} Style property to fetch
@return {String} Returns style property value
*/   
    };
    pk.getStyle = function(el, p) {
        return window.getComputedStyle(el).getPropertyValue(p);
    };


/**
For the passed element, add CSS class
@method addClass
@param element {Object} DOM element
@param class {String} CSS class
@return {Object} Returns passed DOM element
@chainable
*/  
    pk.addClass = function(el, c) {
        if (pk.hasClass(el, c)) {
            return;
        }
        var ca = el.getAttribute('class') || '';
        el.setAttribute('class', (ca ? ca + ' ' : '') + c);
        return el;
    };
/**
For the passed element, remove CSS class
@method removeClass
@param element {Object} DOM element
@param class {String} CSS class
@return {Object} Returns passed DOM element
@chainable
*/  
    pk.removeClass = function(el, c) {
        var ca = el.getAttribute('class');
        if (!ca) {
            return;
        }
        if(ca===c){
            el.removeAttribute('class');
        }else{
            el.setAttribute('class', ca.replace(c, '').trim());
        }
        return el;
    };
/**
Bind an element handler to a DOM node
@method bindEvent
@param event {String} Event type to bind
@param element {Object} DOM element
@param function {Function} Event handler to bind, function is passed originating event when called 
@return {Object} Returns passed DOM element
@chainable
*/      
    pk.bindEvent = function(e, el, fn) {
        if (e === "mousewheel") {
            e = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x  
        }
        if (el.addEventListener) {
            el.addEventListener(e, fn, false);
        } else {
            el.attachEvent("on" + e, fn);
        }
        return el;
    };
/**
Unbind an element handler from a DOM node
@method unbindEvent
@param event {String} Event type to bind
@param element {Object} DOM element
@param function {Function} Event handler to unbind 
@return {Object} Returns passed DOM element
@chainable
*/      
	pk.unbindEvent = function(e, el, fn) {
		if (el.removeEventListener){
			el.removeEventListener (e,fn,false);
		}
		if (el.detachEvent){
			el.detachEvent ('on'+e,fn); 
		}
        return el;
	};
/**
Fetch layout and positioning properties of passed DOM element
@method layout
@param element {Object} DOM element
@param offset {Boolean} Calculate values relative to parent or viewport `<html />`
@return {Object} Returns object consisting of `top`, `right`, `bottom`, `left`, `height` and `width` values
*/  
    pk.layout = function(el, offsetEl) {
        var t = offsetEl ? el.getBoundingClientRect().top : el.offsetTop,
            l = offsetEl ? el.getBoundingClientRect().left : el.offsetLeft,
            h = el.offsetHeight,
            w = el.offsetWidth;
        return {
            top: t,
            left: l,
            right: l + w,
            bottom: t + h,
            height: h,
            width: w
        };
    };
/**
Calculate positioning properties of passed DOM element, optionally augment passed event using `procEvent` for event based positioning
@method position
@param element {Object} DOM element
@param event {Object} Event
@return {Object} Returns object consisting of `top`, `right`, `bottom`, `left`, `height` and `width` values as well as sub `offset` and `parent` objects
*/  
pk.position=function(el, e){
    if(e){e=pk.procEvent(e);}
    var p={
        offset:el.getBoundingClientRect(),
        parent:{
            top:el.offsetTop,
            left:el.offsetLeft
        },
        height:el.offsetHeight,
        width:el.offsetWidth
    };

    p.top=p.offset.top+document.body.scrollTop;
    p.left=p.offset.left+document.body.scrollLeft;
    return p;
};
/**
Apply a series of event listeners to a DOM element
@method bindListeners
@param listeners {Object} Consisting of event objects to pass to `bindEvent` method
@param element {Object} DOM element
@return {Object} Returns passed DOM element
@chainable
*/ 
    pk.bindListeners = function(l, el) {
        for (var e in l) {
			if(l.hasOwnProperty(e)){
				pk.bindEvent(e, el, l[e]);
			}
        }
        return el;
    };
/**
Generate a random number between the passed `min` and `max` values
@method getRand
@param min {Number} Minimum value of calculated number
@param max {Number} Maximum value of calculated number
@return {Number} Returns pseudo-random number between §min§ and §max§
*/     
    pk.getRand = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
/**
Extract unit type from passed string
@method getUnits
@param String {String} Alphanumeric string (e.g. style property value)
@return {String} Returns unit type
*/         
    pk.getUnits = function(str) {
        return str.replace(/\d+/, '');
    };
/**
Wrap the passed DOM element in a new DOM node created from the `wrapper` string
@method wrapEl
@param element {Object} DOM element to wrap
@param wrapper {String} HTML string representing the new DOM wrapper
@return {Object} Returns newly created DOM wrapper element
@chainable
*/     
    pk.wrapEl = function(el, str) {
        var helperEl = pk.createEl(str);
        el.parentNode.insertBefore(helperEl, el);
        helperEl.appendChild(el);
        return helperEl;
    };
/**
Create a new DOM element from the passed `HTML` string
@method createEl
@param HTML {String} HTML string representing the new DOM element
@return {Object} Returns newly created DOM element
@chainable
*/  
    pk.createEl = function(str) {
        var el = document.createElement('div');
        el.innerHTML = str;
        return el.children[0];
    };
/**
Get the index of the passed DOM node within the immediate parent
@method getIndex
@param element {Object} DOM element to return index for
@return {Number} Returns index of passed element
*/  
    pk.getIndex = function(el) {
        if (!el) {
            return null;
        }
        var prop = document.body.previousElementSibling ? 'previousElementSibling' : 'previousSibling';
        var i = 1;
        while ((el = el[prop])) {
            ++i;
        }
        return i - 1;
    };
                            /**
Replace the passed DOM element with a new element created from the passed string, inclusive of all original attributes
@method replaceEl
@param element {Object} The DOM eleemnt to replace
@param HTML {String} HTML string representing the new DOM element
@return {Object} Returns newly created DOM element
@chainable
*/  
    pk.replaceEl = function(el, str) {
        var newEl = pk.createEl(str);
        for (var i = 0; i < el.attributes.length; i++) {
            newEl.setAttribute(el.attributes[i].nodeName, el.attributes[i].value);
        }
        while (el.firstChild) {
            newEl.appendChild(el.firstChild);
        }
        el.parentNode.replaceChild(newEl, el);
        return newEl;
    };
/**
Forces the passed variable into an array, xploding comma seperated strings, keeping existing arrys, collapsing objects and or converting strings as necessary
@method toArr
@param variable {Undefined} Variable to force into array
@return {Array} Returns array of passed variable
*/  
    pk.toArr = function(v) {	
        var a = [];
        if (v && typeof v !== "object") {
            if (v.indexOf(',') !== -1) {
                a = v.split(',');
            } else {
                a.push(v);
            }
        } else {
            a = v;
        }
        return a;
    };
/**
Collides two arrays, either replacing one with the other, removing one from another, adding one to another or toggling the values of one in another
@method collide
@param array1 {Array} Base array
@param array2 {Array} Collider array
@param [type=0] {Number} Type of collision, `0` default, replace `array1` with `array2`, `1` add `array2` to `array1`, `2` remove `array2` from `array1`, `3` toggle `array2` values in `array1` (intelligent add/replace)
@return {Array} Returns resulting `array`
*/  
    pk.collide = function(a1, a2, s) {
        s = s || 0;
        a1 = pk.toArr(a1);
        a2 = pk.toArr(a2);
        /* 
            s = switch
            0 (default) = replace a1 with a2
            1 = add a2 to a1
            2 = remove a2 from a1
            3 = toggle a2 in a1 and add/remove items if not/found                
        */
        if (s === 0) {
            return a2;
        }
        for (var i=0;i< a2.length;i++) {
            var f = a1.indexOf(a2[i]) !== -1 ? true : false;
            if (!f && (s === 1 || s === 3)) {
                a1.push(a2[i]);
            } else if (f && (s === 2 || s === 3)) {
                a1.splice(parseInt(a1.indexOf(a2[i]), 0), 1);
            }
        }
        return a1;
    };
/**
Returns normalized percentage value
@method perc
@param Value {Float} value (amount)
@param Total {Float} total (out of)
@return {Float} Returns noramlized percentage value between 1 and 0
*/ 	
    pk.perc = function(v,t) {
        v=v/t;
		v = v < 0 ? 0 : v;
		v = v > 1 ? 1 : v;		
        return v;
    };	
/**
Gets of sets attribute values, either explicely or impliitely declared
@method attribute
@param element {Object} Related DOM element
@param attribute {String} Attribute name
@param value {String} Optional to get, or value of type specific to attribute 
@return {Object} Returns `element`
@chainable
*/ 
    pk.attribute = function(el, attr, val) {
        if (typeof el !== "object") {
            return false;
        }
        attr = el.hasAttribute(attr) ? attr : el.hasAttribute('data-' + attr) ? 'data-' + attr : attr;
        if (val === undefined) {
            return (attr === 'selected' || attr === 'disabled' || attr === 'checked') ? (el.hasAttribute(attr) ? true : el[attr]) : el.getAttribute(attr);
        }
        if (val === false && (attr === 'selected' || attr === 'disabled' || attr === 'checked')) {
            el.removeAttribute(attr);
            el[attr] = false;
        } else {
            el.setAttribute(attr, val);
            el[attr] = true;
        }
        return el;
    };
/**
Augments event object with additional X and Y helper coordinates
@method procEvent
@param event {Object} Event to normalize
@return {Object} Returns object with the additional attributes `posX`, `posY` are normalized absolutes, `offsetX`, offsetY` are normalized parent offsets, `viewportX`, `viewportY` are normalized viewport offsets
*/     
    pk.procEvent=function(e){
        e.posX = 0;
        e.posY = 0;
        if (!e) var e = window.event;
        if (e.pageX || e.pageY)     {
            e.posX = e.pageX;
            e.posY = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            e.posX = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
            e.posY = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
        }
        if(e.offsetX===undefined){
            e.offsetX=e.layerX;
        }
        if(e.offsetY===undefined){
            e.offsetY=e.layerY;
        }
        e.viewportY=e.posY-document.body.scrollTop;
        e.viewportX=e.posX-document.body.scrollLeft;
        return e;
    }
/**
Gets browser agnostic offset coordinates for applicable mouse events
@method getEventOffset
@param event {Object} Event to normalize
@return {Object} Returns object comprising of normalized `x` and `y` offsets
*/ 
	pk.getEventOffset=function(e){
		return {
			x:e.offsetX===undefined?e.layerX:e.offsetX,
			y:e.offsetY===undefined?e.layerY:e.offsetY
		};
	};
	
    window.onload=function(){pk.addClass(document.body, 'pk-ui');}
})(pk);
