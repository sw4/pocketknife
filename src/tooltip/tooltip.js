var pk = pk || {};
/**
Class used for creating tooltips

HTML

    <span id='tooltip'>Show Tooltip</span>

Javascript:

	pk.tooltip({
		element:document.getElementById('tooltip'),
		content:'Tooltip content',
		position:'left'
	});

@class pk.tooltip
@constructor
@param options {Object}
@param options.element {Object} DOM element to apply tooltip to
@param [options.content] {String} Tooltip content (`HTML` allowed)
@param [options.position=right] {String} Tooltip position (`top`, `right`, `bottom` or `left`)
@param [options.delay=500] {Number} Time in `ms` before tooltip is shown
@return Object {Object} Returns target element (item `0`)
@chainable
*/

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
				t=0,l=0, o={x:(opt.offset ? (opt.offset.x ? opt.offset.x : 0) : 0),y:(opt.offset ? (opt.offset.y ? opt.offset.y : 0) : 0)};
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
			ttEl.style.top=t+o.y+'px';
			ttEl.style.left=l+o.x+'px';
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
		return {
			0:opt.element
		};
	};
    return pk;
})(pk);
