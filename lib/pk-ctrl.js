pk.controller('pkCtrl', ['$scope', function ($scope) {
    $scope.ctrlKey = false;
    $scope.keydown = function (event) {
        if (event.keyCode == 17 || event.key == "Control") {
            $scope.ctrlKey = true;
        }
    }
    $scope.keyup = function (event) {
        if (event.keyCode == 17 || event.key == "Control") {
            $scope.ctrlKey = false;
        }
    }
}]);