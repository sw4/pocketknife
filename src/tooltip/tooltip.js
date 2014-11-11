var pk = pk || {};
(function(pk) {
	var ttEl=null;
	pk.tooltip=function(opt){
		if(!ttEl){
			ttEl=pk.createEl("<div class='pk-tooltip'></div>");
			document.body.appendChild(ttEl);
		}
		pk.bindEvent('mouseover', opt.element,function(){
			ttEl.innerHTML=opt.content;
			ttEl.style.display='block';			
			ttEl.style.display='';
			var tl=pk.layout(ttEl),
				pl=pk.layout(opt.element),
				t=0,l=0;
				opt.position=opt.position || 'right';
			switch(opt.position){
				case "top":
					t=pl.top-tl.height-pl.height;
					l=pl.left;
				break;
				case "bottom":
					t=pl.top;
					l=pl.left;
				break;
				default:
				case "right":
					t=pl.top-pl.height;
					l=pl.left + pl.width;
				break;				
				case "left":
					t=pl.top-pl.height;
					l=pl.left - pl.width;
				break;
			}
			ttEl.style.top=t+'px';
			ttEl.style.left=l+'px';
			pk.addClass(ttEl, 'pk-show');
			pk.addClass(ttEl, 'pk-'+opt.position);			
		});
		pk.bindEvent('mouseout', opt.element,function(){
			ttEl.innerHTML='';
			pk.removeClass(ttEl, 'pk-show');			
			pk.removeClass(ttEl, 'pk-'+opt.position);		
		});
	};
    return pk;
})(pk);
