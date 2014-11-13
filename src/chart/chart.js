var pk = pk || {};

(function(pk) {
    pk.chart = function(opt) {
        var tpl="<div class='pk-chart'></div>",
			el=pk.replaceEl(opt.element, tpl),
			l=pk.layout(el),
			svgEl=pk.createEl("<svg />");			

		pk.attribute(svgEl, {height:l.height, width:l.width});
		el.appendChild(svgEl);
		
		
    };
    return pk;
})(pk);
