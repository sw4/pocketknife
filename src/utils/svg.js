var pk = pk || {};
/**
Utility class for SVG helpers


@class pk.svg
*/

(function(pk) {
    pk.svg = {
		polar2cartesian:function(centerX, centerY, radius, angleInDegrees) {
		  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
		  return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		  };
		},
		arcPath:function(x, y, radius, startAngle, endAngle){
			endAngle = endAngle == 360 || endAngle > 360 ? 359.9 : endAngle ;
			var start = this.polar2cartesian(x, y, radius, endAngle);
			var end = this.polar2cartesian(x, y, radius, startAngle);

			var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

			var d = [
				"M", start.x, start.y, 
				"A", radius, radius, 0, arcSweep, 0, end.x, end.y
			].join(" ");

			return d;       
		},
		arcPoint:function(degrees, r){		
			var a= degrees * Math.PI / 180,
			y=Math.cos(a) * r, 
			x=Math.sin(a) * r;
			return{
				x:x,
				y:y
			};			
		}
    };
    return pk;
})(pk);
