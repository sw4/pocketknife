portal.directive("baseGrid", ["$rootScope", function ($rootScope) {
    return {
        restrict: "E",
        require: "^baseContainer",
        replace: true,
        transclude: true,
        templateUrl: "base/grid/grid-tpl.html",
        scope:false
    }
}]);