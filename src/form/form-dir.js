
portal.directive("baseForm", ["$rootScope", function ($rootScope) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: "base/form/form-tpl.html",        
        controller: ["$scope", function ($scope) {
            //    $scope.columns = [];
            //    this.addColumn = function (column) {
            //        $scope.columns.push(column);
            //    };
        }],
        link: function (scope, element, attrs) {
        }
    }
}]);