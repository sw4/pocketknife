pk.directive("pkModal", [function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template:"<div class='pk-modal'>\
            <div class='pk-modalWrapper'>\
            <section class='pk-modalBody'>\
            </section>\
            </div>\
        </div>",
        scope:true
    }
}]);

