var pk = pk || {};
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
			monthEl=null,
			daysEl=null,
			s=0,
			e=0,
			p=0;
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
				prevend:new Date(y, m-1, 0).getDate()
			}
			return obj; 
		}
		
		function createDays(){
			s=parseDate().startday,
			e=parseDate().endday, 
			p=parseDate().prevend; 	
				
			s = s == 0 ? s = 7 : s;
			tpl="<table class='pk-datepicker-day'><thead><tr>";
			for(var w=0;w<7;w++){		
				tpl+="<th>"+weekday.m[w]+"</th>";
			}
			tpl+="</tr></thead><tbody>";		
			for(var c=0;c<42;c++){		
				if(c%7 === 0){
					tpl+="<tr>";
				}
				if(c>=s && c<=e+s-1){
					tpl+="<td data-day='"+(c-s+1)+"'>"+(c-s+1)+"</td>";
				}else if(c<s){
					tpl+="<td class='pk-prev' data-day='"+(p-(s-c-1))+"' data-month='"+(m-2 < 0 ? 11 : m-2)+"' "+(m-2 < 0 ? "data-year='"+(y-1)+"'": '')+">"+(p-(s-c-1))+"</td>"; 
				}else{
					tpl+="<td class='pk-next' data-day='"+(c-s-e+1)+"' data-month='"+(m===12 ? 0 : m)+"' "+(m===12 ? "data-year='"+(y+1)+"'": '')+">"+(c-s-e+1)+"</td>"; 
				}
				if(c%7 === 6){
					tpl+="</tr>";
				}
			}
			tpl+="</tbody></table>"; 					
			if(daysEl){
				daysEl.innerHTML='';
				daysEl=pk.replaceEl(daysEl, tpl);
			}else{			
				daysEl=pk.createEl(tpl);
				el.appendChild(daysEl);		
			}
			setDay();			
		}
			
		yearEl=pk.createEl("<div class='pk-datepicker-year'>"+y+"</div>");
		el.appendChild(yearEl);
		
		tpl="<ul class='pk-datepicker-month'>";
		for(var n=0;n<12;n++){		
			tpl+="<li data-month='"+n+"'>"+month.m[n]+"</li>";
		}
		tpl+="</ul>";
		monthEl=pk.createEl(tpl);
		el.appendChild(monthEl);	
		
		setYear(); 
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
					if(i===s+d){
						pk.addClass(daysEl.children[1].children[w].children[c], 'selected');
					}
				}		
			}
		}				
		function resolveDate(e){
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
		}
		pk.bindEvent('click', el, resolveDate);	
		
    };
    return pk;
})(pk);
