var pk = pk || {};
/**
Utility class for converting color types and generating color schemes
@class pk.color
*/

(function(pk) {
    pk.color = {

        /**
        Convert a HEX color string to an RGB
        @method hex2rgb
        @param hex {String} HEX color string
        @return {Array} Returns array of red, clue and green components
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
        @method rgb2hex
        @param rgb {Array} Array of red, clue and green components
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
        @method rgb2hsv
        @param rgb {Array} Array of red, clue and green components
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
                    h = delta(g - b) / delta;
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
        @method hsv2rgb
        @param hsv {Array} Array of hue, saturation and value components
        @return {Array} Returns array of red, clue and green components
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
        @method hex2hsl
        @param hex {String} HEX color string
        @return {Array} Returns array of hue, saturation and lightness components
        */
        hex2hsl: function(hex) {
            return this.rgb2hsl(this.hex2rgb(hex));
        },
        /**
        Convert an HSL array to a HEX color string
        @method hsl2hex
        @param hsl {Array} Array of hue, saturation and lightness components
        @return {String} Returns HEX color string
        */
        hsl2hex: function(hsl) {
            return this.rgb2hex(this.hsl2rgb(pk.toArr(hsl)));
        },
		
        /**
        Convert an HSV array to HSL array
        @method hsv2hsl
        @param hsv {Array} Array of hue, saturation and value components
        @return {Array} Returns array of hue, saturation and lightness components
        */
        hsv2hsl: function(hsv) {
            return this.rgb2hsl(this.hsv2rgb(pk.toArr(hsv)));
        },
			
        /**
        Convert an HSL array to HSV array
        @method hsl2hsv
        @param hsl {Array} Array of hue, saturation and lightness components
        @return {Array} Returns array of hue, saturation and value components
        */
        hsl2hsv: function(hsl) {
            return this.rgb2hsv(this.hsl2rgb(pk.toArr(hsl)));
        },			
		
        /**
        Convert a HEX color string to a HSV array
        @method hex2hsv
        @param hex {String} HEX color string
        @return {Array} Returns array of hue, saturation and value components
        */
        hex2hsv: function(hex) {
            return this.rgb2hsv(this.hex2rgb(hex));
        },
        /**
        Convert an HSV array to a HEX color string
        @method hsv2hex
        @param hsv {Array} Array of hue, saturation and value components
        @return {String} Returns HEX color string
        */
        hsv2hex: function(hsv) {
            return this.rgb2hex(this.hsv2rgb(pk.toArr(hsv)));
        },
        /**
        Generate a series of randomized HEX color strings
        @method random
        @param count {Number} Number of random colors to generate
        @return {Array} Returns Array of HEX color strings
        */
        random: function(count) {
            var palette = [],
                i;
            count = typeof count !== 'number' ? 1 : count;
            for (i = 0; i < count; i += 1) {
                palette.push('#' + Math.floor(Math.random() * 16777215).toString(16));
            }
            return palette;
        },
        /**
        Generate (palette of) complementary color(s) from passed HEX color string
        @method complement
        @param hex {String} HEX color string
        @param [type] {String} Type of complementary palette to create, either `split` or `double`
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
        @method triadic
        @param hex {String} HEX color string
        @return {Array} Returns array of HEX color strings
        */
        triadic: function(hex) {
            return this.algorithmic({hex:hex});
        },
        /**
        Generate tetradic color palette
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
        Generate algorithmic color palette
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
            var count = opt.count && typeof opt.count !== 'number' ? 3 : opt.count;
				type = opt.type && typeof opt.type !== 'string' ? 'hue' : opt.type;
				scope = opt.scope && typeof opt.scope !== 'number' ? 360 : opt.scope;
				rotation = opt.rotation && typeof opt.rotation !== 'number' ? 0 : opt.rotation
				hex=opt.hex,
                hsv = this.hex2hsv(hex),
                h = hsv[0],
                s = hsv[1],
                v = hsv[2],
                origin, steps, palette = [],
                offset, i;
            // if scope is 360, the start and end point are the same color, so should be avoided, otherwise enlargen the steps
            steps = (type === "hue" && (scope === 360 || scope === 0)) ? scope / count : scope / (count - 1);
            // if scope is 360, start on the current color
            origin = (scope === 360) ? 0 : this.degrees(this.degrees(h, rotation), -1 * scope / 2);

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
