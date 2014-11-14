var pk = pk || {};

(function(pk) {
    pk.chart = function(opt) {
        var el=pk.replaceEl(opt.element, "<div class='pk-chart'></div>"),
			l=pk.layout(el),
			svgEl=pk.createEl("<svg />"),
			data=opt.data || [],
			series=opt.series,
			seriesMeta={},
			axis=opt.axis, 
			d = l.height > l.width ? l.width : l.height,
			stroke= opt.center ? (d/2)-(d*((opt.center/2) /100)) : d/2,
			colors=opt.colors || {},
			legendEl=pk.createEl("<div class='pk-table pk-legend'></div>"), 
			legend=typeof opt.legend==='function'?opt.legend:!opt.legend ? false : function(mInf){
			//	legendEl.children[0].innerHTML='';
			//	legendEl.children[1].innerHTML='';	
/*				
				if(series.length > 1){
					var hTpl="<div class='pk-row''><div class='pk-legend-category pk-cell'></div>";
					for(var e=0;e<series.length;e++){
						hTpl+="<div class='pk-cell pk-legend-series'>"+series[e]+"</div>";
					}
					legendEl.children[0].innerHTML=hTpl+"</div>";
				}			
*/				
				for(var c in mInf){
					var sI=0;
					var lTpl="<div class='pk-row pk-legend-entry'>";					
					if(series.length > 1){
						lTpl+="<div class='pk-cell pk-legend-category'>"+c+":</div>";
					}
					for(var s in mInf[c]){ 
						lTpl+="<div class='pk-cell pk-legend-series' data-rel='"+('rel'+s+c).replace(' ' ,'')+"'><span class='pk-indicator' style='background-color:"+mInf[c][s].color+";'></span>"+mInf[c][s].percentage+"%"+"</div>";
						sI++;
					}  
					if(series.length === 1){
						lTpl+="<div class='pk-cell pk-legend-category'>"+c+"</div>";
					}
					lTpl+="</div>"; 
					legendEl.innerHTML+=lTpl;	
				}				
			//	var cIt=pk.findEl(legendEl, {class:'pk-legend-series'});	
			//	for(t=0;t<cIt.length;t++){
			//		bindHover(cIt[t]);
			//	}
			};		
			pk.addClass(el, (l.height >= l.width ? "pk-legend-bottom" : "pk-legend-right")); 
			
			
		if(data.length===0){return;}		
		
		function bindHover(hEl){		
			pk.bindEvent('mouseover', hEl, function(e){		
				var hIt=pk.findEl(el, {attribute:{name:'data-rel', value:pk.attribute(e.target, 'data-rel')}});	
				for(h=0;h<hIt.length;h++){							
					pk.addClass(hIt[h], 'selected'); 
				}					
			});			 	
			pk.bindEvent('mouseout', hEl, function(e){
				var hIt=pk.findEl(el, {attribute:{name:'data-rel', value:pk.attribute(e.target, 'data-rel')}});	
				for(h=0;h<hIt.length;h++){							
					pk.removeClass(hIt[h], 'selected'); 
				}	
			});		
		}
		
		
		pk.attribute(svgEl, {height:d, width:d});
		for(var s in series){		
			seriesMeta[series[s]]={};
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
		var metaObj={};
		for(s in seriesMeta){
			var ttlArc=0;
			for(var i=0;i<seriesMeta[s].data.length;i++){	
			
				var pathCol=pk.color.darken(colors[data[i][axis.x]], sIndex*(50/series.length));
				var pathEl=pk.createEl("<path x='"+d/2+"' y='"+d/2+"' fill='none' stroke='"+pathCol+"' d='' stroke-width='"+(stroke/series.length+1)+"'/>");
				
				svgEl.appendChild(pathEl);
				var arc = Math.round((Math.abs(seriesMeta[s].data[i])/seriesMeta[s].sum)*360);
				var r=((d-stroke/2)/2) - (stroke/2*sIndex);
				r = series.length>1 ? r : (d/2)-stroke/2;
				pk.attribute(pathEl, {'d':pk.svg.arcPath(d/2, d/2,  r, ttlArc, ttlArc+arc), 'data-rel':('rel'+s+data[i][axis.x]).replace(' ' ,'')});  
				if(typeof legend === 'function'){
					if(!metaObj[data[i][axis.x]]){
						metaObj[data[i][axis.x]]={};
					}
					if(!metaObj[data[i][axis.x]][s]){
						metaObj[data[i][axis.x]][s]={
							value:data[i][s],
							percentage:Math.round(arc*100/360),
							color:pathCol,
							relEl:pathEl
						};
					}
				}
				
				bindHover(pathEl);
				
				ttlArc+=arc;
			}	
			sIndex++;			
		}		
		if(typeof legend === 'function'){
			legend(metaObj); 
		}
		el.appendChild(svgEl);
		el.appendChild(legendEl);


		
    };
    return pk;
})(pk);
