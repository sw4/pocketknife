pk.directive("pkContainer", [function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template:"<section class='pk-ct'>\
            <header class='pk-ctHeader'>{{gridData}}\
                <h3 class='pk-title'>{{title}}</h3>\
                <h6 class='pk-tagline'>{{tagline}}</h6>\
                <button  class='pk-toRight pk-btn {{ctMinimized && \"pk-ctMin\" || \"pk-ctMax\"}}' ng-click='ctMinimized = !ctMinimized'></button>\
            </header>\
            <section class='pk-ctBody  {{ctMinimized && \"pk-ctMin\" || \"pk-ctMax\"}}'>\
                <div class='pk-cmpWrapper'>\
                    <div class='pk-cmpList' ng-transclude='true'></div>\
                </div>\
            </section>\
        </section>",
        scope:{
            title:"@",
            tagline:"@"
        }
    }
}]);

