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
