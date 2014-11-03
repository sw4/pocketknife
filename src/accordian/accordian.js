var pk = pk || {};
/**
Create a new accordian component
@class pk.accordian
@constructor
@param options {Object}
@param options.element {Object} DOM element to convert to component
@param [options.animate=true] {Boolean} Animate expand/collapse actions
@param [options.multiple=true] {Boolean} Allow multiple sections to be expanded simultaneously
@returns Object {Object} Consisting of original DOM element (item `0`)
@chainable
*/

(function(pk) {
    pk.accordian = function(opt) {
        var el = opt.element,
            anim = opt.animate === false ? false : opt.animate || true,
            multiple = opt.multiple === false ? false : opt.multiple || true;

        function animHeight(tEl) {
            tEl.style.height = 'auto';
            var h = pk.layout(tEl).height;
            tEl.style.height = '0';
            setTimeout(function() {
                tEl.style.height = h + 'px';
            }, 10);
        }

        function doLayout(tEl) {
            for (var a = 0; a < el.children.length; a++) {
                // loop through each....

                var content = el.children[a].children[1];
                // if multiple set to false and node passed, hide all other nodes
                if (tEl && el.children[a] !== tEl && multiple === false) {
                    pk.removeClass(el.children[a], 'pk-show');
                }
                if (pk.hasClass(el.children[a], 'pk-show')) {
                    // show...if not already shown
                    if (parseInt(content.style.height, 0) === 0 || !content.style.height) {
                        if (anim) {
                            animHeight(content);
                        } else {
                            content.style.height = 'auto';
                        }
                    }
                } else {
                    // hide
                    content.style.height = '0';
                }
            }
        }
        pk.bindEvent('click', el, function(e) {
            if (!pk.hasClass(e.target, 'pk-content-header')) {
                return;
            }
            pk.toggleClass(e.target.parentNode, 'pk-show');
            doLayout(e.target.parentNode);
        });
        doLayout();
        return {
            0: el
        };
    };
    return pk;
})(pk);
