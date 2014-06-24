portal.controller('portalController', ['$scope', function ($scope) {
    $scope.ctrlPressed = false;
    $scope.keydown = function (event) {
        if (event.keyCode == 17 || event.key == "Control") {
            // ctrl
            $scope.ctrlPressed = true;
        }
    }
    $scope.keyup = function (event) {
        if (event.keyCode == 17 || event.key == "Control") {
            // ctrl
            $scope.ctrlPressed = false;
        }
    }
}]);
