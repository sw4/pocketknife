pk.controller("exampleChartctrl", ['$scope', 'exampleChartfcty', '$timeout',
function ($scope, exampleChartfcty , $timeout) {
    $scope.columns=[
        {
            binding:"time",
            header:"Column1"
        },
        {
            binding:"value1",
            header:"Column2"
        },
        {
            binding:"value2",
            header:"Column3"
        },
        {
            binding:"value3",
            header:"Column4"
        }
    ];
    (function () {
        $scope.data = $scope.rawdata = exampleChartfcty.fetch();
    })();
}]);