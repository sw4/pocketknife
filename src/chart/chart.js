var pk = pk || {};

(function(pk) {
    pk.chart = function(opt) {
        var tpl="<div class='pk-chart'></div>",
			el=pk.replaceEl(opt.element, tpl),
			l=pk.layout(el),
			svgEl=pk.createEl("<svg />"),
			data=opt.data || [],
			series=opt.series,
			seriesMeta={},
			axis=opt.axis, 
			d = l.height > l.width ? l.width : l.height,
			stroke= opt.center ? (d/2)-(d*((opt.center/2) /100)) : d/2,
			colors=opt.colors || {},
			tooltip = opt.tooltip || true ;		
		if(data.length===0){return;}		
		
		function showTooltip(c, v, p, o){
			var tContent=typeof tooltip === 'function' ? tooltip(c, v, p) : c+": "+v+" ("+p+"%)";
			pk.tooltip({element:pathEl, content:tContent, position:'bottom', offset:o});
		} 
	
		pk.attribute(svgEl, {height:d, width:d});
		for(var s in series){		
			seriesMeta[series[s]]={}
			seriesMeta[series[s]].data=[];		
			seriesMeta[series[s]].sum=0; 
			for(var i=0;i<data.length;i++){			
				seriesMeta[series[s]].data.push(data[i][series[s]]);
				seriesMeta[series[s]].sum+=Math.abs(parseInt(data[i][series[s]],0));
				if(!colors[data[i][axis.x]]){
					colors[data[i][axis.x]]=pk.color.percentage(i/data.length); 
				}
			}			
			seriesMeta[series[s]].min=Math.min.apply(Math, seriesMeta[series[s]].data);
			seriesMeta[series[s]].max=Math.max.apply(Math, seriesMeta[series[s]].data);
			seriesMeta[series[s]].range=Math.abs(seriesMeta[series[s]].max-seriesMeta[series[s]].min);
		}
		var sIndex=0;
		for(s in seriesMeta){
			// seriesMeta[s].data.sort();
			var ttlArc=0;
			for(var i=0;i<seriesMeta[s].data.length;i++){	
				var pathCol=pk.color.darken(colors[data[i][axis.x]], sIndex*(50/series.length));
				var pathEl=pk.createEl("<path x='"+d/2+"' y='"+d/2+"' fill='none' stroke='"+pathCol+"' d='' stroke-width='"+(stroke/series.length)+"'/>");
				svgEl.appendChild(pathEl);
				var arc = Math.round((Math.abs(seriesMeta[s].data[i])/seriesMeta[s].sum)*360);
				var r=((d-stroke/2)/2) - (stroke/2*sIndex);
				r = sIndex > 0 ? r+2: r;
				pk.attribute(pathEl, {'d':pk.svg.arcPath(d/2, d/2,  r, ttlArc, ttlArc+arc), 'data-saturation':pk.color.hex2hsv(pathCol)[1]});  
				
				if(tooltip && pk.tooltip){ 
				   /*
					// var midDegrees=ttlArc+(arc/2),
					// oY=

					offset=pk.svg.arcPoint(ttlArc+(arc/2), r);
					// var sX=Math.cos() 
					
					showTooltip(data[i][axis.x],data[i][s],Math.round(arc*100/360), function(pEl, ttEl){
						var pL=pk.layout(pEl.parentNode);
						console.log((offset.x));
						ttEl.style.top=pL.top+(pL.height/2) + (-1*offset.y)+'px';
						ttEl.style.left=pL.left+(pL.width/2) + offset.x+'px';
						console.log(ttEl);
					}); 
					*/
				}
				pk.bindEvent('mouseover', pathEl, function(e){
					pk.attribute(e.target, {'stroke':pk.color.saturate(pk.attribute(e.target, 'stroke'), 60, true)});
				});			 	
				pk.bindEvent('mouseout', pathEl, function(e){
					pk.attribute(e.target, 'stroke', pk.color.saturate(pk.attribute(e.target, 'stroke'), pk.attribute(e.target, 'data-saturation')));
				});
				ttlArc+=arc;
			}	
			sIndex++;			
		}		
		
		el.appendChild(svgEl);
		// (val - min) * 100 / range +


		
    };
    return pk;
})(pk);
