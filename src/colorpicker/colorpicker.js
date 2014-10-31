var pk = pk || {};
(function(pk) {    
    pk.colorpicker = function(opt) {
	
	
    var type = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML"),
        picker, 
		slide, 
		hueOffset = 15, 
		svgNS = 'http://www.w3.org/2000/svg';

		
	
        var el = opt.element,
			tpl="<div class='pk-colorpicker'>\
				<div class='pk-colorpicker-area'>\
					<div class='pk-colorpicker-slPicker'></div>\
				</div>\
				<div class='pk-colorpicker-range'>\
					<div class='pk-colorpicker-hPicker'></div>\
				</div>\
			</div>";
		
		el = pk.replaceEl(el, tpl);
		var areaTpl, areaEl, rangeTpl, rangeEl;
		if (type == 'SVG') {
			var areaTpl="<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='100%' height='100%'>\
				<defs>\
					<linearGradient id='gradient-black-0' x1='0%' y1='100%' x2='0%' y2='0%'>\
						<stop offset='0%' stop-color='#000000' stop-opacity='1'></stop>\
						<stop offset='100%' stop-color='#CC9A81' stop-opacity='0'></stop>\
					</linearGradient>\
					<linearGradient id='gradient-white-0' x1='0%' y1='100%' x2='100%' y2='100%'>\
						<stop offset='0%' stop-color='#FFFFFF' stop-opacity='1'></stop>\
						<stop offset='100%' stop-color='#CC9A81' stop-opacity='0'></stop>\
					</linearGradient>\
				</defs>\
				<rect x='0' y='0' width='100%' height='100%' fill='url(#gradient-white-0)'></rect>\
				<rect x='0' y='0' width='100%' height='100%' fill='url(#gradient-black-0)'></rect>\
			</svg>";
			var rangeTpl="<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='100%' height='100%'>\
				<defs>\
					<linearGradient id='gradient-hsv-0' x1='0%' y1='100%' x2='0%' y2='0%'>\
						<stop offset='0%' stop-color='#FF0000' stop-opacity='1'></stop>\
						<stop offset='13%' stop-color='#FF00FF' stop-opacity='1'></stop>\
						<stop offset='25%' stop-color='#8000FF' stop-opacity='1'></stop>\
						<stop offset='38%' stop-color='#0040FF' stop-opacity='1'></stop>\
						<stop offset='50%' stop-color='#00FFFF' stop-opacity='1'></stop>\
						<stop offset='63%' stop-color='#00FF40' stop-opacity='1'></stop>\
						<stop offset='75%' stop-color='#0BED00' stop-opacity='1'></stop>\
						<stop offset='88%' stop-color='#FFFF00' stop-opacity='1'></stop>\
						<stop offset='100%' stop-color='#FF0000' stop-opacity='1'></stop>\
					</linearGradient>\
				</defs>\
				<rect x='0' y='0' width='100%' height='100%' fill='url(#gradient-hsv-0)'></rect>\
			</svg>";
	} else if (type == 'VML') {		
	
		areaTpl="<DIV style='position: relative; width: 100%; height: 100%'>\
            <v:rect style='position: absolute; top: 0; left: 0; width: 100%; height: 100%' stroked='f' filled='t'>\
            <v:fill type='gradient' method='none' angle='0' color='red' color2='red' colors='8519f fuchsia;.25 #8000ff;24903f #0040ff;.5 aqua;41287f #00ff40;.75 #0bed00;57671f yellow'></v:fill>\
            </v:rect>\
		</DIV>";
		
		rangeTpl="<DIV style='position: relative; width: 100%; height: 100%'>\
            <v:rect style='position: absolute; left: -1px; top: -1px; width: 101%; height: 101%' stroked='f' filled='t'>\
				<v:fill type='gradient' method='none' angle='270' color='#FFFFFF' opacity='100%' color2='#CC9A81' o:opacity2='0%'></v:fill>\
            </v:rect>\
            <v:rect style='position: absolute; left: 0px; top: 0px; width: 100%; height: 101%' stroked='f' filled='t'>\
				<v:fill type='gradient' method='none' angle='0' color='#000000' opacity='100%' color2='#CC9A81' o:opacity2='0%'></v:fill>\
            </v:rect>\
		</DIV>";
		
        if (!document.namespaces['v'])
            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
	}	
	
	
	 
	areaEl=pk.createEl(areaTpl);	
	rangeEl=pk.createEl(rangeTpl);			
	el.children[0].appendChild(areaEl);
	el.children[1].appendChild(rangeEl);
	
	var lightnessEl=el.children[0].children[0];
	var hueEl=el.children[1].children[0];
	
	var hsv={
		h:0,
		s:0,
		v:0
	};
	var color='#ffffff';
	resolvePos=function(rEl, c){	
		var x=c.x,
			y=c.y,
			pEl = rEl.parentNode,
			pH = pk.layout(pEl).height,
			pW = pk.layout(pEl).width,			
			h = pk.layout(rEl).height,
			w = pk.layout(rEl).width;	
			
			if(x){
				if(c.x<0){
					c.x=0;
				}else if(c.x>1){
					c.x=1;
				}
				x=x * pW;
				if(x<0-w/2){
					x=-1*w/2;
				}else if(x > pW-w/2){
					x=pW-w/2;
				}					
				rEl.style.left=x+'px';
			}
			if(y){
				if(c.y<0){
					c.y=0;
				}else if(c.y>1){
					c.y=1;
				}
				y=y * pH;
				if(y<0-h/2){
					y=-1*h/2;
				}else if(y > pH-h/2){
					y=pH-h/2;
				}
				rEl.style.top=y+'px';	
			}				
		
		if(rEl===lightnessEl){
			hsv.s=Math.round(c.x * 100);
			hsv.v=Math.round((1-c.y) * 100);
			color=pk.color.hsv2hex([hsv.h, hsv.s, hsv.v ]);
		}
		if(rEl===hueEl){
			hsv.h=Math.round(c.y * 360);
			color=pk.color.hsv2hex([hsv.h, hsv.s, hsv.v ]);
			lightnessEl.parentNode.style.backgroundColor=pk.color.hsv2hex([hsv.h, 100, 100 ]);
		}
		// document.getElementById('colorpicker2').style.color=color;
	}
	pk.bindEvent('click', lightnessEl.parentNode, function(e){
		resolvePos(lightnessEl, {x:pk.getEventOffset(e).x / pk.layout(lightnessEl.parentNode).width, y:pk.getEventOffset(e).y / pk.layout(lightnessEl.parentNode).width});
	});
	pk.bindEvent('click', hueEl.parentNode, function(e){
		resolvePos(hueEl, {x:false, y:pk.getEventOffset(e).y / pk.layout(hueEl.parentNode).height});
	});
	pk.drag({
		element:hueEl.parentNode,
		move:false,
		container: {
			element: hueEl.parentNode
		},
		listeners:{
			dragging:function(el,e){
				resolvePos(hueEl, {x:false, y:e.dragPerc.y});
			}		
		}
	});

	pk.drag({
		element:lightnessEl.parentNode,
		move: false,
		container:{
			element:lightnessEl.parentNode
		},
		listeners:{
			dragging:function(el,e){
				resolvePos(lightnessEl, e.dragPerc);			
			}		
		}
	});		
	
	var setColor=function(hex){
		hsvArr=pk.color.hex2hsv(hex);
		hsv={
			h:hsvArr[0],
			s:hsvArr[1],
			v:hsvArr[2]
		};
		resolvePos(hueEl, {x:false, y:hsv.h/360});
		resolvePos(lightnessEl, {x:hsv.s/100, y:1-(hsv.v/100)});
		return color;
	};		
	setColor('#808080');
    };
    return pk;
})(pk);
 
