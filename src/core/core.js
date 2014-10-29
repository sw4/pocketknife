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

var pk = pk || {};
(function(pk) {
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
    pk.toggleClass = function(el, c, t) {
        if (t === true) {
            pk.addClass(el, c);
            return;
        } else if (t === false) {
            pk.removeClass(el, c);
            return;
        }
        pk.toggleClass(el, c, !pk.hasClass(el, c));
    };
    pk.hasClass = function(el, c) {
        var ca = el.getAttribute('class') || '';
        return (ca && ca.indexOf(c) > -1) ? true : false;
    };
    pk.center = function(el) {
        el.style.top = el.parentNode.clientHeight / 2 - (el.offsetHeight / 2) + 'px';
        el.style.left = el.parentNode.clientWidth / 2 - (el.offsetWidth / 2) + 'px';
    };
    pk.getStyle = function(el, p) {
        return window.getComputedStyle(el).getPropertyValue(p);
    };
    pk.addClass = function(el, c) {
        if (pk.hasClass(el, c)) {
            return;
        }
        var ca = el.getAttribute('class') || '';
        el.setAttribute('class', (ca ? ca + ' ' : '') + c);
        return el;
    };
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
    pk.bindEvent = function(e, el, fn) {
        if (e === "mousewheel") {
            e = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x  
        }
        if (el.addEventListener) {
            el.addEventListener(e, fn, false);
        } else {
            el.attachEvent("on" + e, fn);
        }
    };
	pk.unbindEvent = function(e, el, fn) {
		if (el.removeEventListener){
			el.removeEventListener (e,fn,false);
		}
		if (el.detachEvent){
			el.detachEvent ('on'+e,fn); 
		}
	};
    pk.layout = function(el, offsetEl) {
        var t = offsetEl ? el.getBoundingClientRect().top - offsetEl.getBoundingClientRect().top : el.offsetTop,
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
    pk.bindListeners = function(l, el) {
        for (var e in l) {
			if(l.hasOwnProperty(e)){
				pk.bindEvent(e, el, l[e]);
			}
        }
    };
    pk.getRand = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    pk.getUnits = function(str) {
        return str.replace(/\d+/, '');
    };
    pk.wrapEl = function(el, str) {
        var helperEl = pk.createEl(str);
        el.parentNode.insertBefore(helperEl, el);
        helperEl.appendChild(el);
        return helperEl;
    };
    pk.createEl = function(str) {
        var el = document.createElement('div');
        el.innerHTML = str;
        return el.children[0];
    };
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
    };
    pk.addClass(document.body, 'pk-ui');
})(pk);
