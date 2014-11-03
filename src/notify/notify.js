var pk = pk || {};
/**
Class used for notification management
@class pk.notify
@constructor
*/

/**
Create a new notification
@method push
@param options {Object}
@param [options.content] {String} Notification content (`HTML` allowed)
@param [options.delay=8000] {Number} Time in `ms` for notificaiton to display for
@return Object {Object} Returns notification element (item `0`)
*/

/**
Remove a notification
@method close
@param element {Object} Notification element to remove
*/
(function(pk) {
    var nEl = pk.createEl("<ul class='pk-notify'></ul>");
    document.body.appendChild(nEl);
    pk.notify = {
        push: function(opt) {
            var mEl = pk.createEl("<li tabindex='" + pk.getRand(1, 999) + "'>" + opt.content + "</li>"),
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
            return {
                0: mEl
            };
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
