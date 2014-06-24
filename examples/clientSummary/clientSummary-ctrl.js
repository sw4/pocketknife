portal.controller("clientSummaryCtrl", ['$scope', 'clientSummaryFactory', '$timeout',
function ($scope, clientSummaryFactory , $timeout) {
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
    // $scope.rowClick=function(){
      //  console.log(arguments);
    // };
    (function () {
        $scope.data = $scope.rawdata = clientSummaryFactory.fetch();
    })();
}]);