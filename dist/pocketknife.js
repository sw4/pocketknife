var pk = pk || {};
(function (pk) {
    pk.preventBubble = function (e) {
        if (e.preventDefault) {e.preventDefault();}
        if (e.stopPropagation) {e.stopPropagation();}
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    };
    pk.toggleClass = function(el, c, t){
        if(t === true){
            pk.addClass(el,c);
            return;
        }else if(t===false){
            pk.removeClass(el,c);
            return;
        }
        pk.toggleClass(el, c, pk.hasClass(el,c));
    };
    pk.hasClass=function(el, c){
        var ca = el.getAttribute('class') || '';
        return (ca && ca.indexOf(c) > -1) ? true : false;
    };
    pk.center = function (el) {
        el.style.top = el.parentNode.clientHeight / 2 - (el.offsetHeight / 2) + 'px';
        el.style.left = el.parentNode.clientWidth / 2 - (el.offsetWidth / 2) + 'px';
    };
    pk.getStyle = function (el, p) {
        return window.getComputedStyle(el).getPropertyValue(p);
    };
    pk.addClass = function (el, c) {
        if (pk.hasClass(el,c)){ return;}
        var ca = el.getAttribute('class') || '';
        el.setAttribute('class', (ca ? ca + ' ' : '') + c);
        return el;
    };
    pk.removeClass = function (el, c) {
        var ca = el.getAttribute('class');
        if (!ca){return;}
        el.setAttribute('class', ca.replace(c, ''));
        return el;
    };
    pk.bindEvent = function (e, el, fn) {
        if(e==="mousewheel"){
            e = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x  
        }
        if (el.addEventListener) {
            el.addEventListener(e, fn, false);
        } else {
            el.attachEvent("on" + e, fn);
        }
    };
    pk.layout = function (el, offset) {
        var t = offset ? el.offsetTop : el.getBoundingClientRect().top,
            l = offset ? el.offsetLeft : el.getBoundingClientRect().left,
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
    pk.bindListeners=function(l, el){
        for(var e in l){
            pk.bindEvent(e, el, l[e]);                
        }
    };
    pk.getRand = function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    };

    pk.wrapEl = function(el, str){
        var helperEl = pk.createEl(str);    
        el.parentNode.insertBefore(helperEl, el);
        helperEl.appendChild(el);
        return helperEl;
    };
    pk.createEl=function(str){
        var el = document.createElement('div');        
        el.innerHTML=str;        
        return el.children[0];
    };
    pk.getIndex=function(el){
        if(!el){return null;}
        var prop = document.body.previousElementSibling ? 'previousElementSibling' : 'previousSibling';
        var i = 1;
        while (el = el[prop]) { ++i; }
        return i-1;        
    }; 
    pk.replaceEl = function(el,str) {
        var newEl = pk.createEl(str);         
        for(var i = 0; i < el.attributes.length; i++) {
            newEl.setAttribute(el.attributes[i].nodeName, el.attributes[i].nodeValue);
        }
        while (el.firstChild) {
            newEl.appendChild(el.firstChild);
        }
        el.parentNode.replaceChild(newEl, el);
        return newEl;
    };
    pk.attribute = function (el, attr, val){
        if(val===undefined){
            return (attr==='disabled' || attr==='checked') ? (el.hasAttribute(attr) ? true : false) : el.getAttribute(attr);
        }
        if(val===false && (attr==='disabled' || attr==='checked')){
            el.removeAttribute(attr); 
        }else{
            el.setAttribute(attr,val);
        }               
    };
})(pk);

var pk = pk || {};
(function (pk) {
    pk.draggable = function (opt) {
        var el = opt.element;
        var handle = opt.handle || opt.element;
        var container = {
            element: opt.container && opt.container.element ? opt.container.element : document.body,
            style: opt.container && opt.container.style ? opt.container.style : 'restrict'
        };

        pk.addClass(handle, 'pk-drag-draggable');
        var fn = opt.listeners;
        var m = opt.move;
        if (m && typeof m !== 'object') {
            m= {
                x: true,
                y: true
            };
        }
        var dragging = false;
        var dragStart = {};
        var startOffset;
        var containerD = {};
        var elD = {};
        
        function augmentEvent(e){
            
            e.dragStart = dragStart;
            e.dragOffset = startOffset;
            
            e.dragEnd = {
                x: e.clientX,
                y: e.clientY
            };
            e.dragDist = {
                x:e.dragEnd.x - e.dragStart.x,
                y:e.dragEnd.y - e.dragStart.y 
            };
            e.dragPerc = {
                x:(pk.layout(el).left + e.dragDist.x + e.dragOffset.x) / pk.layout(container.element).width,
                y:(pk.layout(el).top + e.dragDist.y + e.dragOffset.y) / pk.layout(container.element).height
            };
            return e;
        }
        
        pk.bindEvent("mousedown", handle, function (e) {
            dragging = true;
            dragStart = {
                x: e.clientX,
                y: e.clientY
            };
            startOffset = {
                x: e.clientX - el.getBoundingClientRect().left,
                y: e.clientY - el.getBoundingClientRect().top
            };            
            e=augmentEvent(e);
            pk.addClass(handle, 'pk-drag-dragging');
            pk.addClass(document.body, 'pk-noselect');
            document.onselectstart = function () {
                return false;
            };
            containerD = pk.layout(container.element);
            elD = pk.layout(el);
            if (fn && fn.dragstart){ fn.dragstart(el, e);}
        });
        pk.bindEvent("mouseup", window, function (e) {
            if (!dragging){ return;}
            dragging = false;
            e=augmentEvent(e);
            pk.removeClass(handle, 'pk-drag-dragging');
            pk.removeClass(document.body, 'pk-noselect');
            document.onselectstart = function () {
                return true;
            };
            if (m && container.style === "snap") {
                contain();
            }
            if (fn && fn.dragend){ fn.dragend(el, e);}
        });

        function contain() {
            
            
            var h=container.element.tagName ==="BODY" ? document.documentElement.clientHeight : container.element.offsetHeight,
                w=container.element.tagName ==="BODY" ? document.documentElement.clientWidth : container.element.offsetWidth;
            
            if (m.x && el.offsetLeft < 0) {
                el.style.left = 0 + 'px';
            } else if (m.x && el.offsetLeft > w - el.offsetWidth) {
                el.style.left = w - el.offsetWidth + 'px';
            }
            if (m.y && el.offsetTop < 0) {
                el.style.top = 0 + 'px';
            } else if (m.y && el.offsetTop > h - el.offsetHeight) {
                el.style.top = h - el.offsetHeight + 'px';
            }
        }
        pk.bindEvent("mousemove", window, function (e) {
            if (!dragging){ return;}
            e=augmentEvent(e);
            if (m.x){ el.style.left = el.offsetLeft + (e.dragEnd.x - el.getBoundingClientRect().left) - e.dragOffset.x + 'px';}
            if (m.y){ el.style.top = el.offsetTop + (e.dragEnd.y - el.getBoundingClientRect().top) - e.dragOffset.y + 'px';}
            if (container.style === "restrict"){ contain();}
            if (fn && fn.dragging){ fn.dragging(el, e);}
        });
    };
})(pk);

var pk = pk || {};
(function (pk) {
    // HELPERS FOR jQUERY+ANGULAR
    if (typeof jQuery === 'object') {
        // jquery available
        jQuery.fn.extend({
            pkScroll: function (axis) {
                pk.scroll({
                    element: this[0],
                    axis: axis
                });
            }
        });
    }
    if (typeof angular === 'object') {
        // angular available
        (

        function () {
            angular.module('pk-scroll', ['ng'])
                .directive('pkScroll', function () {
                return {
                    restrict: 'A',
                    link: function (scope, el) {
                        pk.scroll({
                            element: el[0],
                            axis: el[0].getAttribute('pk-scroll')
                        });
                    }
                };
            });
        })();
    }
    pk.scroll = function (opt) {
        if (!opt.axis){ return;}
        var el = opt.element;
        // INIT SCROLL STRUCTURE
        pk.addClass(el, 'pk-scroll-container');
        var container = document.createElement(el.nodeName);
        pk.addClass(container, 'pk-scroll-content').innerHTML = el.innerHTML;
        var trackY = document.createElement('div');
        pk.addClass(trackY, 'pk-scroll-trackY');
        var floatY = document.createElement('div');
        pk.addClass(floatY, 'pk-scroll-floatY');
        trackY.appendChild(floatY);
        var trackX = document.createElement('div');
        pk.addClass(trackX, 'pk-scroll-trackX');
        var floatX = document.createElement('div');
        pk.addClass(floatX, 'pk-scroll-floatX');
        trackX.appendChild(floatX);
        el.innerHTML = '';
        el.appendChild(container);
        el.appendChild(trackY);
        el.appendChild(trackX);

        // INIT VARIABLES

        var
        floatYh = 0,
            floatXw = 0,
            allowY = false,
            allowX = false,
            percY = 0,
            percX = 0,
            contentH = 0,
            contentW = 0,
            containerH = 0,
            containerW = 0,
            contentWidth = 0,
            contentHeight = 0,
            containerWidth = 0,
            containerHeight = 0,
            scrollDir = opt.axis.toLowerCase();
        if (pk.getStyle(el, 'position') === "static") {el.style.position = "relative";}

        pk.bindEvent("scroll", container, function () {
            percY = container.scrollTop / (contentH - containerH);
            percX = container.scrollLeft / (contentW - containerW);
            percY = percY < 0 ? 0 : percY > 1 ? 1 : percY;
            percX = percX < 0 ? 0 : percX > 1 ? 1 : percX;
            floatY.style.top = (containerH - floatYh) * percY + 'px';
            floatX.style.left = (containerW - floatXw) * percX + 'px';
        });

        function resolveDimensions() {
            contentH = container.scrollHeight;
            contentW = container.scrollWidth;
            containerH = el.offsetHeight;
            containerW = el.offsetWidth;
            if (scrollDir.indexOf("y") > -1 && contentH > containerH) {
                allowY = true;
                pk.addClass(el, 'pk-scroll-enableY');
                floatYh = floatY.offsetHeight;
                container.scrollTop = (contentH - containerH) * percY;
            } else {
                allowY = false;
                pk.removeClass(el, 'pk-scroll-enableY');
                container.scrollTop = 0;
            }
            if (scrollDir.indexOf("x") > -1 && contentW > containerW) {
                allowX = true;
                pk.addClass(el, 'pk-scroll-enableX');
                floatXw = floatX.offsetWidth;
                container.scrollLeft = (contentW - containerW) * percX;
            } else {
                allowX = false;
                pk.removeClass(el, 'pk-scroll-enableX');
                container.scrollLeft = 0;
            }
        }
        resolveDimensions();

        setInterval(function () {
            var widthContainer = el.offsetWidth,
                heightContainer = el.offsetHeight,
                widthContent = container.scrollWidth,
                heightContent = container.scrollHeight;
            if (widthContainer !== containerWidth || heightContainer !== containerHeight || widthContent !== contentWidth || heightContent !== contentHeight) {
                contentWidth = widthContent;
                contentHeight = heightContent;
                containerWidth = widthContainer;
                containerHeight = heightContainer;
                resolveDimensions();
            }
        }, 500);

        // DRAG HANDLERS

        if(allowY){
            pk.draggable({
                element: floatY,
                move: {
                    y: true
                },
                container: {
                    element: trackY
                },
                listeners: {
                    dragging: function () {
                        container.scrollTop = (contentH - containerH) * (floatY.offsetTop / (trackY.offsetHeight - floatY.offsetHeight));
                    }
                }
            });
        }
        if(allowX){
            pk.draggable({
                element: floatX,
                move: {
                    x: true
                },
                container: {
                    element: trackX
                },
                listeners: {
                    dragging: function () {
    
                        container.scrollLeft = (contentW - containerW) * (floatX.offsetLeft / (trackX.offsetWidth - floatX.offsetWidth));
                    }
                }
            });
        }
        pk.bindEvent("click", floatY, function (e) {
            pk.preventBubble(e);
        });
        pk.bindEvent("click", floatX, function (e) {
            pk.preventBubble(e);
        });

        // TRACK CLICKING HANDLERS
        pk.bindEvent("click", trackY, function (e) {
            container.scrollTop = ((e.pageY - el.getBoundingClientRect().top) / containerH * (contentH - containerH));
        });
        pk.bindEvent("click", trackX, function (e) {
            container.scrollLeft = ((e.pageX - el.getBoundingClientRect().left) / containerW * (contentW - containerW));
        });

        // MOUSE WHEEL HANDLERS
        function mouseScroll(e) {
            var offset = 0.1;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset = offset * -1;
            }
            if (allowY) {
                container.scrollTop = Math.round(container.scrollTop + (contentH - containerH) * offset);
            } else {
                container.scrollLeft = Math.round(container.scrollLeft + (contentW - containerW) * offset);
            }
            /* Stop wheel propogation (prevent parent scrolling) */
            pk.preventBubble(e);
        }

        pk.bindEvent("mousewheel", container, mouseScroll);

        // TOUCH EVENT HANDLERS

        function getXy(e) {
            // touch event
            if (e.targetTouches && (e.targetTouches.length >= 1)) {
                return {
                    x: e.targetTouches[0].clientX,
                    y: e.targetTouches[0].clientY
                };
            }
            // mouse event
            return {
                x: e.clientX,
                y: e.clientY
            };
        }

        var pressed = false,
            startPos = {};

        function tap(e) {
            pressed = true;
            startPos = getXy(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function release(e) {
            pressed = false;
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        function drag(e) {
            var endPos, deltaX, deltaY;
            if (pressed) {
                endPos = getXy(e);
                deltaY = startPos.y - endPos.y;
                deltaX = startPos.x - endPos.x;
                if (deltaY > 2 || deltaY < -2) {
                    startPos.y = endPos.y;
                    container.scrollTop += deltaY;

                }
                if (deltaX > 2 || deltaX < -2) {
                    startPos.x = endPos.x;
                    container.scrollLeft += deltaX;
                }
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (typeof window.ontouchstart !== 'undefined') {
            pk.bindEvent('touchstart', container[0], tap);
            pk.bindEvent('touchmove', container[0], drag);
            pk.bindEvent('touchend', window, release);
        }

        // KEYBOARD HANDLERS    
        container.setAttribute("tabindex", 0);
        pk.bindEvent('keydown', container, function (e) {
            if(allowY){                
                switch (e.keyCode) {
                    case 38: //up cursor
                        container.scrollTop -= containerH * 0.1;
                        break;
                    case 40: //down cursor
                    case 32: //spacebar
                        container.scrollTop += containerH * 0.1;
                        break;
                    case 33: //page up
                        container.scrollTop -= containerH;
                        break;
                    case 34: //page down
                        container.scrollTop += containerH;
                        break;
                    case 36: //home
                        container.scrollTop = 0;
                        break;
                    case 35: //end
                        container.scrollTop = contentH;
                        break;
                }                
            }
            if(allowX){                
                switch (e.keyCode) {
                    case 37: //left cursor
                        container.scrollLeft -= containerW * 0.1;
                        break;
                    case 39: //right cursor
                        container.scrollLeft += containerW * 0.1;
                        break;
                }                
            }
            pk.preventBubble(e);
        });
    };
    return pk;
})(pk);

var pk = pk || {};
(function (pk) {
    pk.modal = function (opt) {      
        var e = opt.context || document.body;
        var h = opt.header;
        var c = opt.content;        
        if (!e){ return;}
        var content = document.createElement('div');
        var mask = document.createElement('div');
        var box = document.createElement('div');
        var close = document.createElement('span');
        var header = document.createElement('div');
        var boxH = 0;
        header.innerHTML = h;
        content.innerHTML = c;
        pk.addClass(box, 'pk-modal-box');
        pk.addClass(close, 'pk-modal-close');
        pk.addClass(header, 'pk-modal-header').appendChild(close);
        pk.addClass(content, 'pk-modal-content');
        box.appendChild(header);
        box.appendChild(content);
        pk.addClass(mask, 'pk-modal-mask').appendChild(box);
        e.parentNode.appendChild(mask);
        function closeModal() {
            pk.addClass(pk.removeClass(mask, 'pk-show'), 'pk-hide');
            setTimeout(function () {
                mask.parentNode.removeChild(mask);
            }, 500);
        }
        pk.bindEvent("click", mask, function (e) {
            if (e.target !== mask){ return;}
            closeModal();
        });
        pk.bindEvent("click", close, closeModal);
        pk.bindEvent("resize", window, function () {
            pk.center(box);
        });
        pk.addClass(mask, 'pk-show');
        boxH = box.offsetHeight;
        setInterval(function () {
            var boxHN = box.offsetHeight;
            if (boxH !== boxHN) {
                pk.center(box);
                boxH = boxHN;
            }
        }, 500);
        pk.center(box);
        if(opt.draggable && pk.draggable){
            pk.draggable({
                element: box,
                handle: header,
                move: true
            });
        }
    };
    return pk;
})(pk);

var pk = pk || {};
(function (pk) {    
    pk.rating = function (opt) {        
        var el=opt.element,
            listeners=opt.listeners === undefined ? {} : opt.listeners,
            inputValue=opt.value || el.getAttribute('value') || 0,
            inputDisabled=(opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',   
            inputName=opt.name || el.getAttribute('name') || 'pk-rating-'+pk.getRand(1,999),
            inputTabIndex=opt.tabindex || el.getAttribute('tabindex') || 0;         
        
            /*jshint multistr:true */
        var str="<div class='pk-rating'>\
            <fieldset>\
                <input type='radio' id='"+inputName+"_5' name='"+inputName+"' value='5' tabindex='"+inputTabIndex+"'/>\
                <label for='"+inputName+"_5'></label>\
                <input type='radio' id='"+inputName+"_4' name='"+inputName+"' value='4' />\
                <label for='"+inputName+"_4'></label>\
                <input type='radio' id='"+inputName+"_3' name='"+inputName+"' value='3' />\
                <label for='"+inputName+"_3'></label>\
                <input type='radio' id='"+inputName+"_2' name='"+inputName+"' value='2' />\
                <label for='"+inputName+"_2'></label>\
                <input type='radio' id='"+inputName+"_1' name='"+inputName+"' value='1' />\
                <label for='"+inputName+"_1'></label>\
            </fieldset>\
        </div>";
        el = pk.replaceEl(el, str);

        var rEl=[];
            rEl.push(el.children[0].children[8]),
            rEl.push(el.children[0].children[6]),
            rEl.push(el.children[0].children[4]),
            rEl.push(el.children[0].children[2]),
            rEl.push(el.children[0].children[0]);
        pk.bindListeners(listeners, rEl[0]);
        pk.bindListeners(listeners, rEl[1]);
        pk.bindListeners(listeners, rEl[2]);
        pk.bindListeners(listeners, rEl[3]);
        pk.bindListeners(listeners, rEl[4]);

        pk.bindEvent("mousewheel", el, function(e){
            var offset=1;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset=-1;
            }
            obj.val(obj.val()+offset);         
        }); 
        
        var obj={
            0:el,
            val:function(val){                
                if(val===undefined){
                   for(var r in rEl){
                        if(rEl[r].checked){                         
                            val= rEl[r].value;
                            break;
                        }  
                   }
                   return parseInt(val === undefined ? 0 : val,0);
                }
                val = val < 0 ? 0 : val;
                val = val > 5 ? 5 : val;
                if(val===0){
                    rEl[0].checked=true;       
                    rEl[0].checked=false;                    
                }else{
                    rEl[val-1].checked=true;
                } 
            },
            disabled:function(val){
                if(val!==undefined){
                    pk.toggleClass(el, 'pk-disabled', val);
                    for(var r in rEl){
                        pk.attribute(rEl[r], 'disabled', val);
                    }
                }
                return pk.attribute(rEl[0], 'disabled');
            }
        };
        obj.val(inputValue);
        if(inputDisabled){obj.disabled(true);}
        return obj;        
    };
    return pk;
})(pk);

var pk = pk || {};
(function (pk) {    
    pk.toggleswitch = function (opt) {
        var el=opt.element,
            labelOn=opt.label && opt.label.on ? opt.label.on : 'ON',
            labelOff=opt.label && opt.label.off ? opt.label.off : 'OFF',
            listeners=opt.listeners === undefined ? {} : opt.listeners,
            inputValue=(opt.checked || el.getAttribute('checked')) ? 'checked' : '',
            inputDisabled=(opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName=opt.name || el.getAttribute('name') || 'pk-toggleswitch-'+pk.getRand(1,999),
            inputTabIndex=opt.tabindex || el.getAttribute('tabindex') || 0;         
        
        var tpl = "<label class='pk-toggleswitch pk-noselect "+(inputDisabled ? 'pk-disabled' : '')+"' tabindex='"+inputTabIndex+"'>\
            <input type='checkbox' "+inputValue+" "+inputDisabled+" name='"+inputName+"'/>\
            <div class='pk-toggleswitch-indicator'></div>\
            <span class='pk-toggleswitch-off'>"+labelOff+"</span>\
            <span class='pk-toggleswitch-on'>"+labelOn+"</span>\
        </label>";      
        
        el= pk.replaceEl(el, tpl);
        var inputEl=el.children[0];   
        pk.bindListeners(listeners, inputEl);
        pk.bindEvent("mousewheel", el, function(e){
            var offset=true;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset= false;
            }
            obj.toggled(offset);         
        }); 
        var obj={
            0:el,
            toggled:function(val){
                return pk.attribute(inputEl, 'checked', val);
            },
            disabled:function(val){
                if(val!==undefined){
                    pk.toggleClass(el, 'pk-disabled', val);
                }
                return pk.attribute(inputEl, 'disabled', val);
            }
        };
        return obj;
        
    };
    return pk;
})(pk);

var pk = pk || {};
(function (pk) {    
    pk.slider = function (opt) {
        var el=opt.element,        
            units=opt.units === undefined ? '' : opt.units,
            listeners=opt.listeners === undefined ? {} : opt.listeners,
            min=opt.min || 0,
            max=opt.max || 100,
            axis = opt.axis,
            range=Math.abs(max-min),
            inputValue=opt.value || el.getAttribute('value') || 0,
            inputDisabled=(opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',            
            inputName=opt.name || el.getAttribute('name') || 'pk-slider-'+pk.getRand(1,999),
            inputTabIndex=opt.tabindex || el.getAttribute('tabindex') || 0; 
        
        if(!axis || !(axis.indexOf("x") <0 || axis.indexOf("y") <0)) {
          axis="x";
        }
        
        var tpl = "<div class='pk-slider pk-slider-"+axis+" "+(inputDisabled ? 'pk-disabled' : '')+"' tabindex='"+inputTabIndex+"'>\
            <input type='text' name='"+inputName+"' "+inputDisabled+" value='"+inputValue+"'/>\
            <div class='pk-slider-bar'>\
                <span class='pk-slider-value'></span><span class='pk-slider-units'></span>\
            </div>\
            <div class='pk-slider-mask'></div>\
        </div>";
        el= pk.replaceEl(el, tpl);
            var maskEl = el.children[2],
                barEl = el.children[1],
                inputEl = el.children[0],
                valueEl = barEl.children[0],
                unitsEl = barEl.children[1];        


        pk.bindListeners(listeners, inputEl);
        pk.draggable({
            element:maskEl,
            contain:{element:el},
            move:false,
            listeners:{
                dragging:function(el,e){
                    if(obj.disabled()){return false;}
                    var perc=axis==="x" ? (e.dragDist.x + e.dragOffset.x )  / pk.layout(el).width : 1- (e.dragDist.y + e.dragOffset.y )  / pk.layout(el).height;
                    perc = perc < 0 ? 0 : perc;
                    perc = perc > 1 ? 1 : perc;                   
                    obj.val(min+ Math.round(perc*range));
                    if(listeners & listeners.sliding){
                        listeners.sliding(el, e);
                    }
                },
                dragstart:function(el,e){
                    if(obj.disabled()){return false;}
                    if(listeners & listeners.slidestart){
                        listeners.slidestart(el, e);
                    }
                },                
                dragend:function(el,e){
                    if(obj.disabled()){return false;}
                    if(listeners & listeners.slideend){
                        listeners.slideend(el, e);
                    }                    
                }
            }
        });
        pk.bindEvent('click', maskEl, function(e){
           if(obj.disabled()){return false;}
           var perc = axis ==="x" ?((e.clientX - maskEl.getBoundingClientRect().left) / pk.layout(el).width) : 1- ((e.clientY - maskEl.getBoundingClientRect().top) / pk.layout(el).height);
           obj.val(min+ Math.round(perc*range));
        });
        pk.bindEvent("mousewheel", el, function(e){
            if(obj.disabled()){return false;}
            var offset=0.1;
            if (e.wheelDelta > 0 || e.detail < 0) {
                offset = offset * -1;
            }
            obj.val(range*offset+parseInt(obj.val(),0));            
        });        
        var obj={
            0:el,
            val:function(val, force){
                if(val===undefined || (obj.disabled() && !force)){return inputEl.value;}                  
                val = val < min ? min : val;
                val = val > max ? max : val;
                inputEl.value=val;                
                if(axis === "x"){
                    barEl.style.width=(val - min)*100 / range+'%';
                }else{
                    barEl.style.height=(val - min)*100 / range+'%';
                }
                valueEl.innerHTML=val;
                unitsEl.innerHTML= units;
            },
            disabled:function(val){
                if(val!==undefined){
                    pk.toggleClass(el, 'pk-disabled', val);
                }
                return pk.attribute(inputEl, 'disabled', val);
            }
        };
        obj.val(inputValue, true);
        return obj;
    };
    return pk;
})(pk);
