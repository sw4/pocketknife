var pk = pk || {};
/**
Utility class for converting color types and generating color schemes. 

<div class='info-well'>
For color conversion methods, where the expected parameter is an array e.g `[0,0,0]`, the method can also be passed a comma separated value string, e.g. `'0,0,0'`, from which an array will automatically be extrapolated.
</div>

@class pk.color
*/

(function(pk) {
    pk.color = {

        /**
        Convert a HEX color string to an RGB

            var color=pk.color.hex2rgb('#FF0000');
            // color = [255,0,0]

        @method hex2rgb 
		@param hex {String} HEX color string 
        @return {Array} Returns array of red, blue and green components
        */
        hex2rgb: function(hex) {
		
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                result, r, g, b;
				
			
            hex = hex.replace(shorthandRegex, function(r, g, b) {
                return r + r + g + g + b + b;
            });
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            r = parseInt(result[1], 16);
            g = parseInt(result[2], 16);
            b = parseInt(result[3], 16);
            return [r, g, b];
        },
        /**
        Convert an RGB array to a HEX color string

            var color=pk.color.rgb2hex([255,0,0]);
            // color = '#FF0000'

        @method rgb2hex
        @param rgb {Array} Array of red, blue and green components
        @return {String} Returns HEX color string
        */
        rgb2hex: function(rgb) {
			rgb=pk.toArr(rgb);
            var hex = '',
                h, i, c;
            for (i = 0; i < rgb.length; i += 1) {
                c = rgb[i];
                h = c.toString(16);
                h = (h.length === 1) ? "0" + h : h;
                hex += h;
            }
            return '#' + hex;
        },
        /**
        Convert an RGB array to a HSV array

            var color=pk.color.rgb2hsv([255,0,0]);
            // color = [0,100,100]

        @method rgb2hsv
        @param rgb {Array} Array of red, blue and green components
        @return {Array} Returns array of hue, saturation and value components
        */
        rgb2hsv: function(rgb) {		
			rgb=pk.toArr(rgb);
            var
                r = rgb[0],
                g = rgb[1],
                b = rgb[2],
                min = Math.min(r, g, b),
                max = Math.max(r, g, b),
                delta = max - min,
                h, s, v = max;
            v = Math.floor(max / 255 * 100);

            if (max !== 0) {
                s = Math.floor(delta / max * 100);
            } else {
                return [0, 0, 0];
            }
            if (delta === 0) {
                h = 0;
            } else {			
				if (r === max) {
					h = (g - b) / delta;
				} else if (g === max) {
					h = 2 + (b - r) / delta;
				} else {
					h = 4 + (r - g) / delta;
				}
            }
            h = Math.floor(h * 60);
            if (h < 0) {
                h += 360;
            }
            return [h, s, v];
        },
        /**
        Convert an HSV array to a RGB array

            var color=pk.color.hsv2rgb([0,100,100]);
            // color = [255,0,0]

        @method hsv2rgb
        @param hsv {Array} Array of hue, saturation and value components
        @return {Array} Returns array of red, blue and green components
        */
        hsv2rgb: function(hsv) {
			hsv=pk.toArr(hsv);
            var
                r, g, b, i, f, p, q, t, h = hsv[0],
                s = hsv[1],
                v = hsv[2];
            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            v = Math.max(0, Math.min(100, v));
            s /= 100;
            v /= 100;
            h = h === 360 ? 0 : h;
            if (s === 0) {
                r = g = b = v;
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }
            h /= 60;
            i = Math.floor(h);
            f = h - i;
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));
            switch (i) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = p;
                    b = q;
                    break;
            }
            r = Math.round(r * 255);
            g = Math.round(g * 255);
            b = Math.round(b * 255);
            return [r, g, b];
        },
        /**
        Convert an RGB array to a HSL array

            var color=pk.color.rgb2hsl([255,0,0]);
            // color = [0,100,50]

        @method rgb2hsl
        @param RGB {Array} Array of red, green and blue components
        @return {Array} Returns array of hue, saturation and lightness components
        */		
        rgb2hsl: function(rgb) {
			rgb=pk.toArr(rgb);
            var r = rgb[0],
                g = rgb[1],
                b = rgb[2];
            r /= 255;
            g /= 255;
            b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;
            if (max === min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return [h, s, l];
        },
        /**
        Convert an HSL array to a RGB array

            var color=pk.color.hsl2rgb([0,100,50]);
            // color = [255,0,0]

        @method hsl2rgb
        @param HSL {Array} Array of hue, saturation and lightness components
        @return {Array} Returns array of red, green and blue components
        */				
        hsl2rgb: function(hsl) {
			hsl=pk.toArr(hsl);
            var h = hsl[0],
                s = hsl[1],
                l = hsl[2],
                r, g, b;

            function hue2rgb(p, q, t) {
                if (t < 0) {
                    t += 1;
                }
                if (t > 1) {
                    t -= 1;
                }
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t;
                }
                if (t < 1 / 2) {
                    return q;
                }
                if (t < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t) * 6;
                }
                return p;
            }
            if (s === 0) {
                r = g = b = l; // achromatic
            } else {

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return [r * 255, g * 255, b * 255];
        },
        /**
        Convert a HEX color string to a HSL array

            var color=pk.color.hex2hsl('#FF0000');
            // color = [0,100,50]

        @method hex2hsl
        @param hex {String} HEX color string
        @return {Array} Returns array of hue, saturation and lightness components
        */
        hex2hsl: function(hex) {
            return this.rgb2hsl(this.hex2rgb(hex));
        },
        /**
        Convert an HSL array to a HEX color string

            var color=pk.color.hsl2hex([0,100,50]);
            // color = '#FF0000'

        @method hsl2hex
        @param hsl {Array} Array of hue, saturation and lightness components
        @return {String} Returns HEX color string
        */
        hsl2hex: function(hsl) {
            return this.rgb2hex(this.hsl2rgb(pk.toArr(hsl)));
        },
		
        /**
        Convert an HSV array to HSL array

            var color=pk.color.hsv2hsl([0,100,100]);
            // color = [0,100,50]

        @method hsv2hsl
        @param hsv {Array} Array of hue, saturation and value components
        @return {Array} Returns array of hue, saturation and lightness components
        */
        hsv2hsl: function(hsv) {
            return this.rgb2hsl(this.hsv2rgb(pk.toArr(hsv)));
        },
			
        /**
        Convert an HSL array to HSV array

            var color=pk.color.hsl2hsv([0,100,50]);
            // color = [0,100,100]

        @method hsl2hsv
        @param hsl {Array} Array of hue, saturation and lightness components
        @return {Array} Returns array of hue, saturation and value components
        */
        hsl2hsv: function(hsl) {
            return this.rgb2hsv(this.hsl2rgb(pk.toArr(hsl)));
        },			
		
        /**
        Convert a HEX color string to a HSV array

            var color=pk.color.hex2hsv('#FF0000');
            // color = [0,100,100]

        @method hex2hsv
        @param hex {String} HEX color string
        @return {Array} Returns array of hue, saturation and value components
        */
        hex2hsv: function(hex) {
            return this.rgb2hsv(this.hex2rgb(hex));
        },
        /**
        Convert an HSV array to a HEX color string

            var color=pk.color.hsv2hex([0,100,100]);
            // color = '#FF0000'

        @method hsv2hex
        @param hsv {Array} Array of hue, saturation and value components
        @return {String} Returns HEX color string
        */
        hsv2hex: function(hsv) {
            return this.rgb2hex(this.hsv2rgb(pk.toArr(hsv)));
        },
        /**
        Generate a series of color biased (high saturation/lightness) randomized HEX color strings

            var palette=pk.color.random(5);
            // palette = ["#efa6a8", "#91abb", "#ebac2c", "#2b561", "#7b4b51"]

        @method random
        @param count {Number} Number of random colors to generate
		@param [hex1] {String} HEX color string to set band to generate random color(s)
		@param [hex2] {String} HEX color string to set band to generate random color(s)
        @return {Array} Returns Array of HEX color strings
        */
        random: function(count, hex1, hex2) {
            var palette = [],
                i, h, s, v;
            count = typeof count !== 'number' ? 1 : count; 
			
			if(hex1 && hex2){
			 var hsv1=this.hex2hsv(hex1),
				 hsv2=this.hex2hsv(hex2);
				 h=pk.getRand(Math.min.apply(Math, [hsv1[0], hsv2[0]]), Math.max.apply(Math, [hsv1[0], hsv2[0]]));
				 s=pk.getRand(Math.min.apply(Math, [hsv1[1], hsv2[1]]), Math.max.apply(Math, [hsv1[1], hsv2[1]]));
				 v=pk.getRand(Math.min.apply(Math, [hsv1[2], hsv2[2]]), Math.max.apply(Math, [hsv1[2], hsv2[2]]));
			}else{
				h=pk.getRand(0,360);
				s=100;
				v=pk.getRand(75,100);
			}
			
            for (i = 0; i < count; i += 1) {
            //    palette.push('#' + Math.floor(Math.random() * 16777215).toString(16));
				palette.push(this.hsv2hex([h,s,v]));
            }
            return palette;
        }, 
        /**
        Generate (palette of) complementary color(s) from passed HEX color string
		
            var palette=pk.color.complement('#FF0000', 'split');
            // palette = ["#80ff00", "#00ffff", "#8000ff"]
			
            var palette=pk.color.complement('#FF0000', 'double');
            // palette = ["#80ff00", "#00ff40", "#00ffff", "#0040ff", "#8000ff"] 			
		
        @method complement
        @param hex {String} HEX color string
        @param [type] {String} Type of complementary palette to create, defaults to single complementary color, can be `split` or `double`
        @return {Array} Returns array of HEX color strings
        */
        complement: function(hex, type) {
            var count = 1,
                rotation = 180,
                scope = 0;
            switch (type) {
                case "split":
                    count = 3;
                    rotation = 180;
                    scope = 180;
                    break;
                case "double":
                    count = 5;
                    rotation = 180;
                    scope = 180;
                    break;
            }			
            return this.algorithmic({
				hex:hex,
				count:count,
				scope:scope,
				rotation:180
			});
        },
        /**
        Generate triadic color palette
		
            var palette=pk.color.triadic('#FF0000');
            // palette = ["#ff0000", "#00ff00", "#0000ff"] 
				
		
        @method triadic
        @param hex {String} HEX color string
        @return {Array} Returns array of HEX color strings
        */
        triadic: function(hex) {
            return this.algorithmic({hex:hex});
        },
        /**
        Generate tetradic color palette
		
            var palette=pk.color.triadic('#FF0000');
            // palette = ["#ff0000", "#80ff00", "#00ffff", "#8000ff"] 
			
        @method tetradic
        @param hex {String} HEX color string
        @return {Array} Returns array of HEX color strings
        */
        tetradic: function(hex) {
            return this.algorithmic({
				hex:hex,
				count:4
			});
        },
        /**
        Generate pentadic color palette
		
            var palette=pk.color.triadic('#FF0000');
            // palette = ["#ff0000", "#ccff00", "#00ff66", "#0066ff", "#cc00ff"] 
			
        @method pentadic
        @param hex {String} HEX color string
        @return {Array} Returns array of HEX color strings
        */
        pentadic: function(hex) {
            return this.algorithmic({
				hex:hex,
				count:5
			});
        },
        degrees: function(degrees, offset) {
            degrees += offset;
            if (degrees > 360) { 
                degrees -= 360;
            } else if (degrees < 0) {
                degrees += 360;
            }
            return degrees;
        },
        /**
        Generate a color from a percentage point between two colors
		
            var color=pk.color.percentage(0.5);
            // color = "#f2e600";
			
        @method percentage
        @param perc {Number} Percentage between first and second colors to generate color point from expressed as value between zero and one
		@param [hex1=#ff0000] {String} Starting color HEX value defaults to `#ff0000` red so 0% is red
		@param [hex2=#27ae62] {String} Starting color HEX value defaults to `#1ae500` green so 100% is green
        @return {String} Returns resulting HEX color
        */		
		percentage:function(perc, hex1, hex2){
			hex1=hex1 || '#ff0000';
			hex2=hex2 || '#27ae62';	
			var hsv1=pk.color.hex2hsv(hex1),
				hsv2=pk.color.hex2hsv(hex2);				
			return pk.color.hsv2hex([Math.round(hsv1[0]+perc*(hsv2[0]-hsv1[0])),Math.round(hsv1[1]+perc*(hsv2[1]-hsv1[1])),Math.round(hsv1[2]+perc*(hsv2[2]-hsv1[2]))]);
		},		
		/**
        Scale either hue, saturation or value of a color by a percentage amount
		
            var scale=pk.scale.percentage(0.5);
            // color = "#f2e600";
			
        @method scale
		@param hex {String} HEX color string
        @param perc {Number} Percentage to adjust color by
		@param [type=hue] {String} String, scale to adjust, either `hue`, `saturation` or `value`
		@param [abs] {Boolean} Define percentage as absolute value from base to max, defaults to relative value between current and max
        @return {String} Returns resulting HEX color
        */		
		scale:function(hex, perc, type, abs){ 
			type=type||'hue';			
			
			var hsv=this.hex2hsv(hex),
				adj=type==='hue' ? hsv[0] : type==='saturation' ? hsv[1] : hsv[2];
			perc = Math.abs(perc) > 1 ? perc/100 : perc;
			perc = abs===true ? perc*100 : adj+((type==='hue' ? 360 : 100)-adj)*perc;		
			return this.hsv2hex([type==="hue" ? adj : hsv[0], type==="saturation" ? perc : hsv[1], type==="value" ? perc : hsv[2]]);  
		},	
		/**
        Lighten a color by a percentage amount
		
            var color=pk.color.lighten('#840000', 70);
            // color = "#da0000";
			
        @method lighten
		@param hex {String} HEX color string
        @param perc {Number} Percentage to lighten color by
		@param [abs=lightness] {Boolean} Define percentage lightness as absolute value, defaults to relative
        @return {String} Returns resulting HEX color
        */		
		lighten:function(hex, perc, abs){ 
			perc = perc > 0 ? perc : -1*perc;
			return this.scale(hex, perc, 'value', abs); 
		},
		/**
        Darken a color by a percentage amount
		
            var color=pk.color.darken('#840000', 70);
            // color = "#da0000";
			
        @method darken
		@param hex {String} HEX color string
        @param perc {Number} Percentage to darken color by
		@param [abs=lightness] {Boolean} Define percentage lightness as absolute value, defaults to relative
        @return {String} Returns resulting HEX color
        */		
		darken:function(hex, perc, abs){  
			perc = perc < 0 ? perc : -1*perc;
			return this.scale(hex, perc, 'value', abs); 
		},	
		/**
        Saturate a color by a percentage amount
		
            var color=pk.color.saturate('#840000', 70);
            // color = "#820000";
			
        @method saturate
		@param hex {String} HEX color string
        @param perc {Number} Percentage to saturate color by
		@param [abs=lightness] {Boolean} Define percentage saturation as absolute value, defaults to relative
        @return {String} Returns resulting HEX color
        */		
		saturate:function(hex, perc, abs){ 
			perc = perc > 0 ? perc : -1*perc;
			return this.scale(hex, perc, 'saturation', abs); 
		},	
		/**
        Desaturate a color by a percentage amount
		
            var color=pk.color.desaturate('#840000', 70);
            // color = "#820000";
			
        @method saturate
		@param hex {String} HEX color string
        @param perc {Number} Percentage to saturate color by
		@param [abs=lightness] {Boolean} Define percentage desaturation as absolute value, defaults to relative
        @return {String} Returns resulting HEX color
        */		
		desaturate:function(hex, perc, abs){ 
			perc = perc > 0 ? perc : -1*perc;
			return this.scale(hex, perc, 'saturation', abs); 
		},		
        /**
        Generate algorithmic color palette
		
            var palette=pk.color.algorithmic ({hex:'#FF0000'});
            // palette = ["#ff0000", "#00ff00", "#0000ff"] 		
		
            var palette=pk.color.algorithmic ({hex:'#FF0000', count: 5});
            // palette = ["#ff0000", "#ccff00", "#00ff66", "#0066ff", "#cc00ff"]  			
		
            var palette=pk.color.algorithmic ({hex:'#FF0000', scope: 100, count:4});
            // palette = ["#ff00d4", "#ff0047", "#ff4700", "#ffd500"]

            var palette=pk.color.algorithmic ({hex:'#FF0000', type:'saturation', scope:50});
            // palette = ["#ffffff", "#ffbfbf", "#ff8080"]
			
        @method algorithmic
		@param options {Object} Algorithmic color transformation options
        @param options.hex {String} HEX color string
        @param [options.count=3] {Number} Number of colors to produce
        @param [options.type=hue] {String} Component to calculate on, either `hue`, `saturation` or `value`
        @param [options.scope=360] {Number} Number of degrees of rotation to consider
        @param [options.rotation=0] {Number} Number of degrees of rotation to calculate from
        @return {Array} Returns array of HEX color strings
        */
        // pick a point on the wheel, the number of degrees either side to cover and the split
        algorithmic: function(opt) {
			if(!opt.hex){return;}
			var hex=opt.hex,
				count = typeof opt.count === 'undefined' ? 3: opt.count,
				type = typeof opt.type === 'undefined' ? 'hue' : opt.type,
				scope = typeof opt.scope === 'undefined' ? 360 : opt.scope,
				rotation = typeof opt.rotation === 'undefined' ? 0 : opt.rotation,
                hsv = this.hex2hsv(hex),
                h = hsv[0],
                s = hsv[1],
                v = hsv[2],
                origin, steps, palette = [],
                offset, i;
            // if scope is 360, the start and end point are the same color, so should be avoided, otherwise enlargen the steps
            steps = (type === "hue" && (scope === 360 || scope === 0)) ? scope / count : scope / (count - 1);
            // if scope is 360, start on the current color
            origin = (scope === 360) ? h : this.degrees(this.degrees(h, rotation), -1 * scope / 2);
            for (i = 0; i < count; i += 1) {
                offset = steps * i;
                switch (type) {
                    case "hue":
                        palette.push(this.hsv2hex([this.degrees(origin, offset, 360) === 360 ? 0 : this.degrees(origin, offset, 360), s, v]));
                        break;
                    case "saturation":
                        palette.push(this.hsv2hex([h, offset, v]));
                        break;
                    case "value":
                    case "lightness":
                    case "brightness":
                        palette.push(this.hsv2hex([h, s, offset]));
                        break;
                }
            }
            return palette; 
        }
    };
    return pk;
})(pk);
