
portal.directive("baseContainer", ["$rootScope", function ($rootScope) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: "base/container/container-tpl.html",
        scope:false,
        controller: function ($scope, $element, $attrs) {
            $scope.title=$scope.title || "Title";
            $scope.tagline=$scope.tagline || "Tagline";
        }
    }
}]);

