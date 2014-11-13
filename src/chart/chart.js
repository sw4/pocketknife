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
			stroke=50;			
		if(data.length===0){return;}
		
		var d = l.height > l.width ? l.width : l.height;
		
		pk.attribute(svgEl, {height:d, width:d});



		for(var s in series){		
			seriesMeta[series[s]]={}
			seriesMeta[series[s]].data=[];		
			seriesMeta[series[s]].sum=0;
			// loop through dataset
			for(var i=0;i<data.length;i++){
				seriesMeta[series[s]].data.push(data[i][series[s]]);
				seriesMeta[series[s]].sum+=Math.abs(parseInt(data[i][series[s]],0));
			}			
			seriesMeta[series[s]].min=Math.min.apply(Math, seriesMeta[series[s]].data);
			seriesMeta[series[s]].max=Math.max.apply(Math, seriesMeta[series[s]].data);
			seriesMeta[series[s]].range=Math.abs(seriesMeta[series[s]].max-seriesMeta[series[s]].min);
		}
		
		for(s in seriesMeta){
		 
			console.log(document.createElementNS ("http://www.w3.org/2000/svg","line"));
			 
			var ttlArc=0;
			for(var i=0;i<seriesMeta[s].data.length;i++){			
				var pathEl=pk.createEl("<path x='"+d/2+"' y='"+d/2+"' fill='none' stroke='blue' d='' stroke-width='"+(stroke/series.length)+"'/>");
				svgEl.appendChild(pathEl);
				var arc = Math.round((Math.abs(seriesMeta[s].data[i])/seriesMeta[s].sum)*360);
				// pk.attribute(pathEl, 'd', pk.svg.arcPath(d/2, d/2, d/2, ttlArc, ttlArc+arc)); 
				pk.attribute(pathEl, 'd', pk.svg.arcPath(d/2, d/2, (d/2)-stroke, ttlArc, ttlArc+arc));  
				ttlArc+=arc;				
			}			
		}		
		
		el.appendChild(svgEl);
		// (val - min) * 100 / range +


		
    };
    return pk;
})(pk);
