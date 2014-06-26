pk.directive("pkContainer", [function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template:"<section class='pk-ct'>\
            <header class='pk-ctHeader'>\
                <h3 class='pk-title'>{{title}}</h3>\
                <h6 class='pk-tagline'>{{tagline}}</h6>\
                <button ng-if='minimizable' class='pk-toRight pk-btn {{$parent.minimized && \"pk-ctMin\" || \"pk-ctMax\"}}' ng-click='$parent.minimized = !$parent.minimized'></button>\
            </header>\
            <section class='pk-ctBody  {{minimized && \"pk-ctMin\" || \"pk-ctMax\"}}'>\
                <div class='pk-cmpWrapper'>\
                    <div class='pk-cmpList' ng-transclude='true'></div>\
                </div>\
            </section>\
        </section>",
        scope:{
            title:"@",
            tagline:"@",
            minimizable:"@",
            minimized:"@"
        }
    }
}]);

