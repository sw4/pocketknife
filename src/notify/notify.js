var pk = pk || {};
(function(pk) {
    var nEl = pk.createEl("<ul class='pk-notify'></ul>");
    document.body.appendChild(nEl);
    return pk.notify = {
        push: function(opt) {
            var mEl = pk.createEl("<li tabindex='" + pk.getRand(1, 999) + "'>" + opt.content + "</li>"),
                delay = opt.delay || 2000;
            nEl.appendChild(mEl);
            setTimeout(function() {
                pk.addClass(mEl, 'pk-show');
            }, 10);
            var scope = this;
            setTimeout(function() {
                scope.dismiss(mEl);
            }, delay);

            pk.bindEvent('click', mEl, function() {
                scope.dismiss(mEl);
            });
        },
        dismiss: function(dEl) {
            if (!pk.hasClass(dEl, 'pk-show')) {
                return;
            }
            pk.removeClass(dEl, 'pk-show');
            setTimeout(function() {
                if (dEl) {
                    nEl.removeChild(dEl);
                }
            }, 1000);
        }
    };
})(pk);
