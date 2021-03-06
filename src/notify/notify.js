var pk = pk || {};
/**
Class used for notification management

HTML

    <button onclick="showNotification();">Show Notification</button>

Javascript:

	function showNotification(){
		pk.notify.push({
			content:'Default message'
		});
	}

@class pk.notify
@static
*/

/**
Create a new notification
@method add
@param options {Object}
@param [options.content] {String} Notification content (`HTML` allowed)
@param [options.delay=8000] {Number} Time in `ms` for notificaiton to display for
@return Object {Object} Returns notification element (item `0`)
*/

/**
Remove a notification
@method remove
@param element {Object} Notification element to remove
*/
(function(pk) {
    var nEl = pk.createEl("<ul class='pk-notify'></ul>");
    document.body.appendChild(nEl);
    pk.notify = {
        add: function(opt) {
            var mEl = pk.createEl("<li tabindex='" + pk.getRand(1, 999) + "'>" + opt.content + "</li>"),
                delay = opt.delay || 8000;
            nEl.appendChild(mEl);
            setTimeout(function() {
                pk.addClass(mEl, 'pk-show');
            }, 10);
            var scope = this;
            setTimeout(function() {
                scope.remove(mEl);
            }, delay);

            pk.bindEvent('click', mEl, function() {
                scope.remove(mEl);
            });
            return {
                0: mEl
            };
        },
        remove: function(dEl) {
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
