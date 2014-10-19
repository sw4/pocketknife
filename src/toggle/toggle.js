var pk = pk || {};
(function (pk) {    
    pk.toggle = function (opt) {
        var el=opt.element,
            labelOn=opt.label && opt.label.on ? opt.label.on : 'ON',
            labelOff=opt.label && opt.label.off ? opt.label.off : 'OFF',
            listeners=opt.listeners === undefined ? {} : opt.listeners,
            inputValue=(opt.checked || el.getAttribute('checked')) ? 'checked' : '',
            inputDisabled=(opt.disabled || el.getAttribute('disabled')) ? 'disabled' : '',
            inputName=opt.name || el.getAttribute('name') || 'pk-toggle-'+pk.getRand(1,999),
            inputTabIndex=opt.tabindex || el.getAttribute('tabindex') || 0;         
        
        var tpl = "<label class='pk-toggle pk-noselect "+(inputDisabled ? 'pk-disabled' : '')+"' tabindex='"+inputTabIndex+"'>\
            <input type='checkbox' "+inputValue+" "+inputDisabled+" name='"+inputName+"'/>\
            <div class='pk-toggle-indicator'></div>\
            <span class='pk-toggle-off'>"+labelOff+"</span>\
            <span class='pk-toggle-on'>"+labelOn+"</span>\
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
