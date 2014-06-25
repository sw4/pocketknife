pk.controller("exampleGridctrl", ['$scope', 'exampleGridfcty', '$timeout',
function ($scope, exampleGridfcty , $timeout) {
    $scope.columns=[
        {
            binding:"c1",
            header:"Column1"
        },
        {
            binding:"c2",
            header:"Column2"
        },
        {
            binding:"c3",
            header:"Column3"
        },
        {
            binding:"c4",
            header:"Column4"
        }
    ];
    (function () {
        $scope.data = $scope.rawdata = exampleGridfcty.fetch();
    })();
}]);