var pk = pk || {};
(function(pk) {
    var nEl = pk.createEl("<ul class='pk-notify'></ul>");
    document.body.appendChild(nEl);
    return pk.notify = {
        push: function(opt) {
            var mEl = pk.createEl("<li>" + opt.content + "</li>"),
                delay = opt.delay || 8000;
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
            pk.removeClass(dEl, 'pk-show');
            setTimeout(function() {
                nEl.removeChild(dEl);
            }, 1000);
        }
    };
})(pk);
