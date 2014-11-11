var pk = pk || {};
(function(pk) {
    pk.datepicker = function(opt) {
		function parseDate( y, m, d){
		m = m || 10;
		d= d || 1;
			var obj= {		
				weekday:new Date(y, m, d).getDay(),
				endday:new Date(y, m+1, 0).getDate(),
				prevend:new Date(y, m, 0).getDate()
			}
			if(obj.weekday==0){
				obj.weekday=6;
			}else{
				obj.weekday = obj.weekday-1;
			}
			return obj; 
		}
		var weekday={
			s:['M','T','W','T','F','S','S'],
			m:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
			l:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']		
		}
		var month={
			m:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']		
		}
		var s=parseDate('2014').weekday,
			e=parseDate('2014').endday, 
			p=parseDate('2014').prevend,
			tpl="<div class='pk-datepicker'>\
			<ul>";
			for(var n=0;n<12;n++){		
				tpl+="<li>"+month.m[n]+"</li>";
			}
			tpl+="</ul>\
			<table>\
			<tr>\
			<th>"+weekday.m[0]+"</th>\
			<th>"+weekday.m[1]+"</th>\
			<th>"+weekday.m[2]+"</th>\
			<th>"+weekday.m[3]+"</th>\
			<th>"+weekday.m[4]+"</th>\
			<th>"+weekday.m[5]+"</th>\
			<th>"+weekday.m[6]+"</th>\
			</tr>";
		for(var d=0;d<42;d++){		
			if(d%7 === 0){
				tpl+="<tr>";
			}
			if(d>=s && d<=e+s-1){
				tpl+="<td>"+(d-s+1)+"</td>";
			}else if(d<s){
				tpl+="<td class='pk-prev'>"+(p-(s-d-1))+"</td>"; 
			}else{
				tpl+="<td class='pk-next'>"+(d-s-e+1)+"</td>"; 
			}
			if(d%7 === 6){
				tpl+="</tr>";
			}
		}
		tpl+="</table></div>";
		var el=opt.element;
		pk.replaceEl(el, tpl);
    };
    return pk;
})(pk);
