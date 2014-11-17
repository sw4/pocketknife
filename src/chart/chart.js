var pk = pk || {};

(function(pk) {
    pk.chart = function(opt) {
        var el=pk.replaceEl(opt.element, "<div class='pk-chart'></div>"),
			l=pk.layout(el),
			svgEl=pk.createEl("<svg />"),
			data=opt.data || [],
			series=opt.series,
			seriesMeta={},
			axesMeta={x:{data:[], sum:0},y:{data:[], sum:0}},
			axis=opt.axis, 
			d = l.height > l.width ? l.width : l.height,
			stroke= opt.center ? (d/2)-(d*((opt.center/2) /100)) : d/2,
			colors=opt.colors || {},
			type=opt.type,
			margin=opt.margin || 25,
			legendEl=pk.createEl("<div class='pk-table pk-legend'></div>"), 
			legend=typeof opt.legend==='function'?opt.legend:!opt.legend ? false : function(mInf){

				if(series.length > 1){
					var hTpl="<div class='pk-row pk-legend-header'><div class='pk-legend-category pk-cell'></div>";
					for(var e=0;e<series.length;e++){
						hTpl+="<div class='pk-cell pk-legend-series'>"+series[e]+"</div>";
					}
					legendEl.innerHTML+=hTpl+"</div>";
				}
				
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
				var cIt=pk.findEl(legendEl, {class:'pk-legend-series'});	
				for(t=0;t<cIt.length;t++){
					bindHover(cIt[t]);
				}
			};		
			

		if(data.length===0){return;}	
		
		pk.addClass(el, 'pk-'+type+'-chart');
		
		pk.addClass(el, (l.height >= l.width ? "pk-legend-bottom" : "pk-legend-right")); 
			
		data.sort(function(a, b){
		 return a[axis.x]-b[axis.x];
		});
		
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
		
		
		pk.attribute(svgEl, {height:type==='pie' ? d : l.height, width:type==='pie' ? d : l.width});
		
		/*
		START PIE CHART
		*/
		switch(type){
		
			case "pie":
			
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
			break;
		}
		/*
		END PIE CHART
		*/

		

		for(var i=0;i<data.length;i++){		 
		
		
			seriesMeta[data[i][series]] = seriesMeta[data[i][series]] || {
				x:{
					data:[],
					sum:0
				},
				y:{
					data:[],
					sum:0
				},			
			};
			seriesMeta[data[i][series]].x.data.push(data[i][axis.x]);				
			seriesMeta[data[i][series]].x.sum+=data[i][axis.x];				
			seriesMeta[data[i][series]].y.data.push(data[i][axis.y]);
			seriesMeta[data[i][series]].y.sum+=data[i][axis.y];
			seriesMeta[data[i][series]].y.min = !seriesMeta[data[i][series]].y.min || data[i][axis.x] < seriesMeta[data[i][series]].y.min ? data[i][axis.x] : seriesMeta[data[i][series]].y.min;
			seriesMeta[data[i][series]].y.max = !seriesMeta[data[i][series]].y.max || data[i][axis.x] > seriesMeta[data[i][series]].y.max ? data[i][axis.x] : seriesMeta[data[i][series]].y.max;
			seriesMeta[data[i][series]].y.range = Math.abs(seriesMeta[data[i][series]].y.max-seriesMeta[data[i][series]].y.min);
			seriesMeta[data[i][series]].x.min = !seriesMeta[data[i][series]].x.min || data[i][axis.x] < seriesMeta[data[i][series]].x.min ? data[i][axis.x] : seriesMeta[data[i][series]].x.min;
			seriesMeta[data[i][series]].x.max = !seriesMeta[data[i][series]].x.max || data[i][axis.x] > seriesMeta[data[i][series]].x.max ? data[i][axis.x] : seriesMeta[data[i][series]].x.max;
			seriesMeta[data[i][series]].x.range = Math.abs(seriesMeta[data[i][series]].x.max-seriesMeta[data[i][series]].x.min);
			
			axesMeta.x.data.push(data[i][axis.x]);
			axesMeta.x.sum+=data[i][axis.x];
			axesMeta.y.data.push(data[i][axis.y]);
			axesMeta.y.sum+=data[i][axis.y];
			
			

			
		}
		axesMeta.x.min=Math.min.apply(Math, axesMeta.x.data);
		axesMeta.x.min = axesMeta.x.min <= 0 ? axesMeta.x.min : 0;
		axesMeta.x.max=Math.max.apply(Math, axesMeta.x.data);
		axesMeta.x.range = Math.abs(axesMeta.x.max-axesMeta.x.min);
		axesMeta.y.min=Math.min.apply(Math, axesMeta.y.data);
		axesMeta.y.min = axesMeta.y.min <= 0 ? axesMeta.y.min : 0;
		axesMeta.y.max=Math.max.apply(Math, axesMeta.y.data);
		axesMeta.y.range = Math.abs(axesMeta.y.max-axesMeta.y.min);
		
		
		// Get range pixel amounts
		yUnit= ((l.height-(margin*2))/axesMeta.y.range);
		xUnit= ((l.width-(margin*2))/(axesMeta.x.range));
		
		
		// Draw AXES
		var svgTpl="<g class='pk-axes'>\
			<g class='pk-yAxis' transform='translate("+margin+","+margin+")'>\
				<line y2='"+(l.height-(margin*2))+"'></line>";
			for(var t=0;t<=axesMeta.y.range;t++){
				svgTpl+="<g class='tick' transform='translate(-5,"+Math.floor(t*yUnit)+")'>\
					<line x2='5'></line>\
					<text x='-10' y='4'>"+((axesMeta.y.range+axesMeta.y.min)-t)+"</text>\
				</g>";					
			}
			svgTpl+="</g>\
			<g class='pk-xAxis' transform='translate("+margin+","+(l.height-margin)+")'>\
				<line x2='"+(l.width-(margin*2))+"'></line>";
				
 
			for(t=0;t<=axesMeta.x.range;t++){
				svgTpl+="<g class='tick' transform='translate("+Math.floor(t*xUnit)+", 0)'>\
					<line y2='5'></line>\
					<text y='17' x='-4' y='4'>"+(t+axesMeta.x.min)+"</text>\
				</g>";					
			}	
			svgTpl+="</g>\
		</g><g class='pk-series'></g>";
		svgEl.innerHTML=svgTpl;
		
		/*
		Draw Series
		*/
		var sIndex=0;
		for(var s in seriesMeta){	
			sIndex++;
			
			if(!colors[s]){
				colors[s]=pk.color.random(); 
			}
			
			var seriesEl=pk.createEl("<g class='pk-series-"+sIndex+"' />");
			var sPath='';
			for(i=0;i<seriesMeta[s].x.data.length;i++){			
				if(i==0){
					sPath+="M";
				}else{
					sPath+=" L ";
				}
				var pxX=Math.round(margin + (xUnit * (seriesMeta[s].x.data[i]-axesMeta.x.min))),
					pxY=Math.round(l.height-(margin + (yUnit * (seriesMeta[s].y.data[i]-axesMeta.y.min))));
				sPath+=pxX + " " +pxY;
			
				seriesEl.appendChild(pk.createEl("<circle cx='"+pxX+"' cy='"+pxY+"' r='5' fill='"+colors[s]+"' stroke='"+colors[s]+"' />")); 
			}
			
			seriesEl.insertBefore(pk.createEl("<path fill='none' stroke='"+colors[s]+"' d='"+sPath.trim()+"' />"),seriesEl.firstChild );
			svgEl.children[1].appendChild(seriesEl);
		};
		
		
		if(typeof legend === 'function'){
			legend(metaObj); 
		}
		el.appendChild(svgEl);
		// el.appendChild(legendEl);

		
    };
    return pk;
})(pk);
