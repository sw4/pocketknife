
portal.directive("baseGridsummary", ['$compile', '$http', function ($compile, $http) {
    return {
        restrict: "E",
        require: "^baseGrid",
        replace: true,
        transclude: true,
        link:  function(scope, element, attrs) {        
            $http.get(scope.summaryTemplate).success(function(html) {
                element.html(html);
            }).then(function (response) {
                element.replaceWith($compile(element.html())(scope));
            });            
        }
    }
}]);