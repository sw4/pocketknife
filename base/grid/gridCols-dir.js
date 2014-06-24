portal.directive("baseGridcols", ["$rootScope",'$http', '$compile', function ($rootScope,$http, $compile) {
    return {
        restrict: "E",
        require: "^baseGrid",
        replace: true,
        templateUrl: "base/grid/gridCols-tpl.html",
        controller: ["$scope", function ($scope) {
            //    $scope.columns = [];
            //    this.addColumn = function (column) {
            //        $scope.columns.push(column);
            //    };
        }]
    }
}]);