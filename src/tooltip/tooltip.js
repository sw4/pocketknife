var pk = pk || {};
(function(pk) {
	var ttEl=null;
	pk.tooltip=function(opt){
		if(!ttEl){
			ttEl=pk.createEl("<div class='pk-tooltip'></div>");
			document.body.appendChild(ttEl);
		}
		var delay=opt.delay || 500, timer=null;
		pk.bindEvent('mouseover', opt.element,function(){
			ttEl.innerHTML=opt.content;
			ttEl.style.display='block';	
			var tl=pk.layout(ttEl),
				pl=pk.layout(opt.element),
				t=0,l=0;
				opt.position=opt.position || 'right';		
			ttEl.style.display='';
			switch(opt.position){
				case "top":
					t=pl.top-tl.height;
					l=pl.left;
				break;
				case "bottom":
					t=pl.top+pl.height;
					l=pl.left;
				break;
				default:
				case "right":
					t=pl.top;
					l=pl.left + pl.width;
				break;				
				case "left": 
					t=pl.top;
					l=pl.left - tl.width;
				break;
			}
			ttEl.style.top=t+'px';
			ttEl.style.left=l+'px';
			pk.addClass(ttEl, 'pk-'+opt.position);		
			
			if(!timer){
				timer = setTimeout(function(){				
					pk.addClass(ttEl, 'pk-show');	
					clearTimeout(timer);
					timer=null;
				},delay);
			}
			
		});
		pk.bindEvent('mouseout', opt.element,function(){
			ttEl.innerHTML='';
			if(timer){	
				clearTimeout(timer);
				timer=null;
			}
			pk.removeClass(ttEl, 'pk-show');			
			pk.removeClass(ttEl, 'pk-'+opt.position);		
		});
	};
    return pk;
})(pk);
