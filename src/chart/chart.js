var pk = pk || {};
/**
Create a new chart component

HTML

	<div id='chart'></div>

Javascript:

	pk.chart({
		element: document.getElementById('chart'),
		type:'pie',
		data: [
			{category:"cat",series1:8, series2:2},
			{category:"pig",series1:2, series2:6},
			{category:"cow",series1:9, series2:9},
			{category:"bird",series1:5, series2:2},
			{category:"dog",series1:2, series2:7},
			{category:"emu",series1:6, series2:3},
			{category:"hamster",series1:2, series2:3}
		],
		center:20,
		legend:true,
		axis:{
			x:'category'
		},
		series: ['series1', 'series2']
	});
	
@class pk.chart
@constructor 
@beta
@param type {String} Chart type to create, `pi`, or `line`
@param [center=0] {Number} If chart type `pie`, the inner radius to create a donut chart, expressed as a percentage of diameter (`2*r`)
@param data {Object} Object array of data to use for the chart
@param axis {Object} Object keys in data to use for `x` and `y` axes
@param axis.x {String} Object keys in data to use for `x` axis
@param [axis.y] {String} Object keys in data to use for `y` axis, marked optional as not required for `pie` charts
@param [axis.r=false] {String} String denoting object key in data to use for point radius, can be set to number
@param series {Array} Object keys in data used for series designation - only an Array for `pie` charts
@param series {String} Object key in data used for series designation - only a String for `line` charts
@param [margin] {Object} Object of `top`, `right`, `left` and `bottom` margin amounts in pixels. Defaults to `20,20,50,20`
@param [colors] {Object} Object key value pairs where the key is a series name, the value is the value to use
@param [legend] {Function} Custom function responsible for building chart legend, defaults to stock constructor if not passed

@chainable
*/
(function(pk) {
    pk.chart = function(opt) {
        var el=pk.replaceEl(opt.element, "<div class='pk-chart'></div>"),
			l=pk.layout(el),
			svgEl=pk.createEl("<svg />"),
			axesEl=pk.createEl("<g class='pk-axes' />"),
			data=opt.data || [],
			series=opt.series,
			seriesMeta={},
			axesMeta={x:{data:[], sum:0},y:{data:[], sum:0}, r:{data:[], sum:0}},
			axis=opt.axis,
			d = l.height > l.width ? l.width : l.height,
			stroke= opt.center ? (d/2)-(d*((opt.center/2) /100)) : d/2,
			colors=opt.colors || {},
			type=opt.type,
			margin={
				top:opt.margin && opt.margin.top || 20,
				right:opt.margin && opt.margin.right || 20,
				bottom:opt.margin && opt.margin.bottom || 50,
				left:opt.margin && opt.margin.left || 20,
				series:0,
				category:10
			},
			legendEl=pk.createEl("<div class='pk-legend'></div>"), 
			legend=typeof opt.legend==='function'?opt.legend:!opt.legend ? false : function(mInf){

				
				if(type==='pie'){
					pk.addClass(legendEl, 'pk-table');
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
							lTpl+="<div class='pk-cell pk-legend-series' data-rel='"+('rel'+s+c).replace(' ' ,'')+"'><span class='pk-indicator' style='border-color:"+mInf[c][s].color+";background-color:"+mInf[c][s].color+";' data-rel='"+('rel'+s).replace(' ' ,'')+"'></span>"+mInf[c][s].percentage+"%"+"</div>";
							sI++;
						}   
						if(series.length === 1){
							lTpl+="<div class='pk-cell pk-legend-category'>"+c+"</div>";
						}
						lTpl+="</div>"; 
						legendEl.innerHTML+=lTpl;	 
					}	
					pk.addClass(el, (l.height >= l.width ? "pk-legend-bottom" : "pk-legend-right")); 
	
				}else{
					for(s in mInf){
						legendEl.innerHTML+= "<div class='pk-legend-series' data-rel='"+('rel'+s).replace(' ' ,'')+"'><span class='pk-indicator' style='border-color:"+colors[s]+";background-color:"+colors[s]+";' data-rel='"+('rel'+s).replace(' ' ,'')+"'></span>"+s+"</div>";						
					}					
				}
				
			};		

		
		if(data.length===0){return;}	

		
		// calculate composite margins for ease of use
		margin.x=margin.left+margin.right;
		margin.y=margin.top+margin.bottom;
		
		pk.addClass(el, 'pk-'+type+'-chart');
			
		data.sort(function(a,b) {return (a[axis.x] > b[axis.x]) ? 1 : ((b[axis.x] > a[axis.x]) ? -1 : 0);} );		
		
		pk.bindEvent('mouseover', el, function(e){		
			if(pk.attribute(e.target, 'data-rel')){
				var hIt=pk.findEl(el, {attribute:{name:'data-rel', value:pk.attribute(e.target, 'data-rel')}});	
				for(h=0;h<hIt.length;h++){							
					pk.addClass(hIt[h], 'selected'); 
				}	
			}				
		});
		pk.bindEvent('mouseout', el, function(e){
			if(pk.attribute(e.target, 'data-rel')){
				var hIt=pk.findEl(el, {attribute:{name:'data-rel', value:pk.attribute(e.target, 'data-rel')}});	
				for(h=0;h<hIt.length;h++){							
					pk.removeClass(hIt[h], 'selected'); 
				}	
			}
		});		
		
		
		pk.attribute(svgEl, {height:type==='pie' ? d : l.height, width:type==='pie' ? d : l.width});
		
		/*
		START PIE CHART
		*/
		
		if(type==='pie'){
			
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
					
					ttlArc+=arc;
				}	
				sIndex++;			
			}
			legend(metaObj); 
		
		/*
		START LINE, SCATTER, AREA, BUBBLE, BAR, COLUMN CHART
		*/
			
		}else{	
	
			svgEl.appendChild(axesEl);	
			
			function drawAxis(xy, type){
				// Draw AXES
				// Series of .5 pt adjustments to create crisp edges in IE
				var svgTpl="";
				if(xy==='x'){
					svgTpl="<g class='pk-xAxis' transform='translate("+margin.left+","+(l.height-margin.bottom+.5)+")'>\
							<line x2='"+(l.width-margin.x)+"'></line>";
						
						// var xCount= type==='ordinal' ? axesMeta.x.range : axesMeta.x.range;
						 
						for(t=0;t<=axesMeta.x.range;t++){
						console.log(axesMeta.x, t, type);
							svgTpl+="<g class='tick' transform='translate("+(Math.floor((t*axesMeta.x.unit)+(type==='categorical' ? axesMeta.x.unit: 0))+0.5)+", 0)'>\
								<line y2='5'></line>";
								if(t>0 || type==='categorical'){svgTpl+="<line class='pk-tick-line' y2='"+(-1*(l.height-margin.y-1))+"'></line>";}							
								svgTpl+="<text "+ (type==='categorical' ? "x='-"+(axesMeta.x.unit/2) : "")+"' y='17' y='4' text-anchor='middle'>"+(type==='ordinal' ? (t+axesMeta.x.min) : axesMeta.x.data[t])+"</text>\
							</g>";					
						} 
						svgTpl+="</g>";
				}else if(xy==='y'){
					svgTpl="<g class='pk-yAxis' transform='translate("+(margin.left-.5)+","+margin.top+")'>\
							<line y2='"+(l.height-margin.y)+"'></line>";
						for(var t=0;t<=axesMeta.y.range;t++){
							svgTpl+="<g class='tick' transform='translate(-5,"+(Math.floor(t*axesMeta.y.unit)+0.5)+")'>\
								<line x2='5'></line>";  
								if(t<axesMeta.y.range){svgTpl+="<line class='pk-tick-line' x1='6' x2='"+(5+l.width-margin.x)+"'></line>";}
								svgTpl+="<text x='-10' y='4' text-anchor='start'>"+((axesMeta.y.range+axesMeta.y.min)-t)+"</text>\
							</g>";				 	
						}
						svgTpl+="</g>";
				}				
				axesEl.appendChild(pk.createEl(svgTpl));			
			}	
	
			function resolveAxis(xyr, type){
				
				for(var i=0;i<data.length;i++){				
					seriesMeta[data[i][series]] = seriesMeta[data[i][series]] || {};
					seriesMeta[data[i][series]][xyr] = seriesMeta[data[i][series]][xyr] || {
						data:[],
						sum:0
					};					
					seriesMeta[data[i][series]][xyr].data.push(data[i][axis[xyr]]);	
					
					if(type==='ordinal'){						
						seriesMeta[data[i][series]][xyr].sum+=data[i][axis[xyr]];	
						seriesMeta[data[i][series]][xyr].min = !seriesMeta[data[i][series]][xyr].min || data[i][axis[xyr]] < seriesMeta[data[i][series]][xyr].min ? data[i][axis[xyr]] : seriesMeta[data[i][series]][xyr].min;
						seriesMeta[data[i][series]][xyr].max = !seriesMeta[data[i][series]][xyr].max || data[i][axis[xyr]] > seriesMeta[data[i][series]][xyr].max ? data[i][axis[xyr]] : seriesMeta[data[i][series]][xyr].max;
						seriesMeta[data[i][series]][xyr].range = Math.abs(seriesMeta[data[i][series]][xyr].max-seriesMeta[data[i][series]][xyr].min);
						axesMeta[xyr].data.push(data[i][axis[xyr]]);	
						axesMeta[xyr].sum+=data[i][axis[xyr]];
					}else{					
						if(axesMeta[xyr].data.indexOf(data[i][axis[xyr]])===-1){axesMeta[xyr].data.push(data[i][axis[xyr]]);}
					}
				}
				if(type==='ordinal'){		
					axesMeta[xyr].min=Math.min.apply(Math, axesMeta[xyr].data);
					axesMeta[xyr].min = axesMeta[xyr].min <= 0 ? axesMeta[xyr].min : 0;
					axesMeta[xyr].max=Math.max.apply(Math, axesMeta[xyr].data);
					axesMeta[xyr].range = Math.abs(axesMeta[xyr].max-axesMeta[xyr].min);
				}
				if(xyr==='x' || xyr ==='y'){
					if(type === 'ordinal'){
						axesMeta[xyr].unit = ((xyr === 'x' ? l.width : l.height)-margin[xyr])/axesMeta[xyr].range;
					}else{
						axesMeta[xyr].unit = ((xyr === 'x' ? l.width : l.height)-margin[xyr]) / axesMeta[xyr].data.length;					
						axesMeta[xyr].range = axesMeta[xyr].data.length-1;
					}					
					drawAxis(xyr, type);
				} 
				
			}
			
			resolveAxis('x',type==='column' ? 'categorical' : 'ordinal');
			resolveAxis('y','ordinal');	
			
			var groupEl=pk.createEl("<g class='pk-series'></g>");
			svgEl.appendChild(groupEl);
			
			/*
			Draw Series
			*/

			var sIndex=0;
			for(var s in seriesMeta){				
				if(!colors[s]){
					colors[s]=pk.color.random();  
				}					
				var seriesEl=pk.createEl("<g class='pk-series-"+sIndex+"' />");
				var sPath='', aPath='', sRect='';
				
				for(i=0;i<seriesMeta[s].x.data.length;i++){	
				
					var pxX=0,
						pxY=0;

					if(['column'].indexOf(type)===-1){							
						pxX=Math.round(margin.left + (axesMeta.x.unit * (seriesMeta[s].x.data[i]-axesMeta.x.min)));
						pxY=Math.round(l.height-(margin.bottom + (axesMeta.y.unit * (seriesMeta[s].y.data[i]-axesMeta.y.min))));
						if(i==0){
							sPath+="M";
						}else{
							sPath+=" L "; 
						}
						sPath+=pxX + " " +pxY;
					}else{ 
						pxY = pxY;
						pxX= Math.floor(margin.left+(sIndex*(axesMeta.x.unit/Object.keys(seriesMeta).length)+(axesMeta.x.unit * axesMeta.x.data.indexOf(seriesMeta[s].x.data[i]))));
						pxY=axesMeta.y.unit * (seriesMeta[s].y.data[i]-axesMeta.y.min);
						seriesEl.appendChild(pk.createEl("<rect x='"+(pxX-1)+"' y='"+(l.height-margin.bottom-pxY)+"' height='"+pxY+"' width='"+(1+(axesMeta.x.unit/Object.keys(seriesMeta).length))+"' stroke='"+colors[s]+"' fill='"+colors[s]+"' data-rel='rel"+s.replace(' ','')+"'/>"));						
					}
					if(['area'].indexOf(type)!==-1){
						if(i==0){
							aPath+="M"+pxX + " " +(l.height-margin.bottom);
						}
						aPath+=" L "+pxX + " " +pxY;
						if(i==seriesMeta[s].x.data.length-1){					
							aPath+=" L "+pxX + " " +(l.height-margin.bottom);
						}
					}
					if(axis.r && ['column', 'bar'].indexOf(type)===-1){
						// draw points
						if(typeof axis.r === 'string' && data[0][axis.r]!=='undefined'){						
							resolveAxis('r', 'ordinal'); 
						}else if(typeof axis.r === 'string'){
							axis.r=5;
						}
						var r=seriesMeta[s].r.data[i] ? (seriesMeta[s].r.data[i]*20 / axesMeta.r.range)  : typeof axis.r === 'number' ? axis.r : 5;						
						seriesEl.appendChild(pk.createEl("<circle cx='"+pxX+"' cy='"+pxY+"' r='"+r+"' fill='"+colors[s]+"' stroke='"+colors[s]+"' data-rel='rel"+s.replace(' ','')+"' />"));
					}						
				} 
				if(['scatter'].indexOf(type)!==-1){ 
					// draw connecting lines
					seriesEl.insertBefore(pk.createEl("<path class='pk-line' fill='none' stroke='"+colors[s]+"' d='"+sPath.trim()+"' data-rel='rel"+s.replace(' ','')+"' />"),seriesEl.firstChild );
				}else if(['area'].indexOf(type)!==-1){
					// draw fill area
					seriesEl.insertBefore(pk.createEl("<path class='pk-area' fill='"+colors[s]+"' d='"+aPath.trim()+"' data-rel='rel"+s.replace(' ','')+"' />"),seriesEl.firstChild );
				}
				groupEl.appendChild(seriesEl);  
				sIndex++;
			};
			legend(seriesMeta); 
		}	
		
		if(legend){			
			el.appendChild(legendEl);
		}
		el.appendChild(svgEl);
		
		return {
			0:el		
		}

		
    };
    return pk;
})(pk);
