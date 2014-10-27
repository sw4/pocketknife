var pk = pk || {};
(function(pk) {
    pk.accordian = function(opt) {
        var el = opt.element,
            anim = opt.animate === false ? false : opt.animate || true,
            multiple = opt.multiple === false ? false : opt.multiple || true;
var pk = pk || {};
(function(pk) {
    pk.accordian = function(opt) {
        var el = opt.element,
            anim = opt.animate === false ? false : opt.animate || true,
            multiple = opt.multiple === false ? false : opt.multiple || true;

        function animHeight(tEl) {
            tEl.style.height = 'auto';
            console.log(tEl);
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
                    if (content.style.height === '0px' || !content.style.height) {
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
            } else if (!pk.hasClass(e.target, 'pk-noselect')) {
                pk.addClass(e.target, 'pk-noselect');
            }
            pk.toggleClass(e.target.parentNode, 'pk-show');
            doLayout(e.target.parentNode);
        });
        doLayout();
    };
    return pk;
})(pk);

        function animHeight(tEl) {
            tEl.style.height = 'auto';
            console.log(tEl);
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
                    if (content.style.height === '0px' || !content.style.height) {
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
            pk.toggleClass(e.target.parentNode, 'pk-show');
            doLayout(e.target.parentNode);
        });
        doLayout();
    };
    return pk;
})(pk);
