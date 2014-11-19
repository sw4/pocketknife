var pk = pk || {};
/**
Create a new datepicker control

HTML

    <div id='datepicker'></div>

Javascript

	pk.datepicker({
		element: document.getElementById('datepicker')
	});	
			
	
@class pk.datepicker
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to control
@param [options.value=0] {String} Value of initially selected option, defaults to the attribute value set on the passed element, or `0`
@param [options.name=pk-select-RandInt] {String} Name of underlying input control, defaults to the attribute value set on the passed element, or `pk-select-RandInt`
@param [options.tabindex=0] {Number} Tabindex of control, defaults to the attribute value set on the passed element, or `0`
@param [options.disabled=false] {Boolean} Disabled state of control, defaults to the attribute value set on the passed element, or `false`
@return Object {Object} Consisting of original DOM element (item `0`) and class methods (see below)
@chainable
*/
(function(pk) {
    pk.datepicker = function(opt) {
		var y = opt.year || 2014,
			m = opt.month || 11,
			d = opt.day || 1,
			weekday={
				s:['M','T','W','T','F','S','S'],
				m:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], 
				l:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']		
			},
			month={
				m:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']		
			},
			tpl="<div class='pk-datepicker'></div>",			
			el=opt.element,
			yearEl=null,
			yearsEl=null,
			monthEl=null,
			daysEl=null,
			sD=0,
			eD=0,
			pD=0;
		el=pk.replaceEl(el, tpl);		
		function parseDate(){
			function normalizeDay(v){
				if(v===0){
					return 6;
				}else{
					return v-1;
				}				
			}
			var obj= {		
				weekday:normalizeDay(new Date(y, m-1, d).getDay()),
				startday:normalizeDay(new Date(y, m-1, 1).getDay()),
				endday:new Date(y, m, 0).getDate(),
				prevend:new Date(y, m-1, 0).getDate(),
				nextend:new Date(y, (m===11 ? 0 : m+1), 0).getDate(),
				date:new Date(y, m-1, d)
			};
			return obj; 
		}
		
		function createDays(){
			sD=parseDate().startday;
			eD=parseDate().endday;
			pD=parseDate().prevend; 	
				
			sD = sD === 0 ? sD = 7 : sD;
			tpl="<thead><tr>";
			for(var w=0;w<7;w++){		
				tpl+="<th>"+weekday.m[w]+"</th>";
			}
			tpl+="</tr></thead><tbody>";		
			for(var c=0;c<42;c++){		
				if(c%7 === 0){
					tpl+="<tr>";
				}
				if(c>=sD && c<=eD+sD-1){
					tpl+="<td data-day='"+(c-sD+1)+"'>"+(c-sD+1)+"</td>";
				}else if(c<sD){
					tpl+="<td class='pk-prev' data-day='"+(pD-(sD-c-1))+"' data-month='"+(m-2 < 0 ? 11 : m-2)+"' "+(m-2 < 0 ? "data-year='"+(y-1)+"'": '')+">"+(pD-(sD-c-1))+"</td>"; 
				}else{
					tpl+="<td class='pk-next' data-day='"+(c-sD-eD+1)+"' data-month='"+(m===12 ? 0 : m)+"' "+(m===12 ? "data-year='"+(y+1)+"'": '')+">"+(c-sD-eD+1)+"</td>"; 
				}
				if(c%7 === 6){
					tpl+="</tr>";
				}
			}
			tpl+="</tbody>"; 	
			daysEl.innerHTML=tpl;
			setDay();			
		}
		
		
		function createYears(){
		
			for(i=0;i<55;i++){
				if(i%5 === 0){
					tpl+="<tr>";					
				}
				tpl+="<td>"+(y+i)+"</td>";	 
				if(i%5 === 4){
					tpl+="</tr>";				
				}
			}		
			yearsEl.innerHTML=tpl;
		}
		
		metaEl=pk.createEl("<div class='pk-datepicker-meta'>"+666+"</div>");
		el.appendChild(metaEl);			
		yearEl=pk.createEl("<div class='pk-datepicker-year'>"+y+"</div>");
		el.appendChild(yearEl);
		
		tpl="<ul class='pk-datepicker-month'>";
		for(var n=0;n<12;n++){		
			tpl+="<li data-month='"+n+"'>"+month.m[n]+"</li>";
		}
		tpl+="</ul>";
		monthEl=pk.createEl(tpl);
		el.appendChild(monthEl);	
		
		
		tpl="<table class='pk-datepicker-day'></table>";
		daysEl=pk.createEl(tpl);
		el.appendChild(daysEl);		
		
			
		yearsEl=pk.createEl("<table class='pk-datepicker-years'></table>");
		el.appendChild(yearsEl); 
		createYears();
		
		setMeta();
		setYear();
		
		function setMeta(){
			function getSuffix(n) {return n + (n < 11 || n > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((n - 1) % 10, 3)] : 'th');}
			var mDate=parseDate();
			metaEl.innerHTML=weekday.l[mDate.weekday]+" "+getSuffix(mDate.date.getDate())+" "+month.m[mDate.date.getMonth()]+" "+mDate.date.getFullYear();
		}
		function setYear(){		
			yearEl.innerHTML=y;
			setMonth();
		}		
		function setMonth(){		
			for(var n=0;n<12;n++){			
				pk.removeClass(monthEl.children[n], 'selected');
			}
			pk.addClass(monthEl.children[m-1], 'selected');
			createDays();	
		}
		function setDay(){	
			var i=0;
			for(w=0;w<6;w++){
				for(c=0;c<7;c++){
					i++;	 				
					pk.removeClass(daysEl.children[1].children[w].children[c], 'selected');
					if(i===sD+d){
						pk.addClass(daysEl.children[1].children[w].children[c], 'selected');
					}
				}		
			}
		}				
		function resolveClick(e){
			var tEl=e.target;
			if(pk.attribute(tEl, 'year')!==null){ 			
				y=parseInt(pk.attribute(tEl, 'year'),0);	
				setYear();		
			}			
			if(pk.attribute(tEl, 'month')!==null){
				m=parseInt(pk.attribute(tEl, 'month'),0)+1;		
				setMonth();				
			}
			if(pk.attribute(tEl, 'day')!==null){ 			
				d=parseInt(pk.attribute(tEl, 'day'),0);		
				setDay();
			}
			setMeta();
		}
		pk.bindEvent('click', el, resolveClick);	

		pk.bindEvent("mousewheel", yearEl, function(e) { 
			pk.preventBubble(e);
			if (e.wheelDelta > 0 || e.detail < 0) {
				y++;
            }else{ 
				y--; 
			}
			setYear();
			setMeta();
		});		
		pk.bindEvent("mousewheel", monthEl, function(e) { 
			pk.preventBubble(e);
			if (e.wheelDelta > 0 || e.detail < 0) {
				d=d > parseDate().nextend ? parseDate().nextend : d;
				if(m===12){
					m=1;
					y++;
				}else{
					m++;
				}
            }else{
				d=d > parseDate().prevend ? parseDate().prevend : d;
				if(m===1){
					m=12;
					y--;
				}else{
					m--;
				}
			}
			setYear();
			setMeta();
		});
		pk.bindEvent("mousewheel", daysEl, function(e) { 
		 	pk.preventBubble(e); 
			if (e.wheelDelta > 0 || e.detail < 0) {
				if(d===eD){				
					d=1;
					if(m===12){
						m=1;
						y++;
						setYear();
					}else{
						m++;
						setMonth();
					}
				}else{
					d++;
					setDay();
				}
            }else{
				if(d===1){				
					d=parseDate().prevend;
					if(m===1){
						m=12;
						y--;
						setYear();
					}else{
						m--;
						setMonth();
					}
				}else{
					d--;
					setDay();
				}
			}
			setMeta();
        });
		return {
			0:el		
		};
		
    };
    return pk;
})(pk);
