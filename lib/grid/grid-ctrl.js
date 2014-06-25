pk.controller("pkGridctrl", [ '$scope', '$timeout',
function ( $scope, $timeout) {
    $scope.data=$scope.data || [];
    $scope.columns=$scope.columns || [];  

    function getLastVisibleRecord() {
        $scope.lastVisibleRecord = $scope.pageSize * $scope.currentPage > $scope.data.length ? $scope.data.length : $scope.pageSize * $scope.currentPage;
    }
    $scope.$watch('data', function (v) {
        if(!v){return false;}
        $scope.pageCount = Math.ceil($scope.data.length / $scope.pageSize);
        $scope.pageCount = $scope.pageCount == 0 ? 1 : $scope.pageCount;
        $scope.currentPage = $scope.currentPage > $scope.pageCount ? $scope.pageCount : $scope.currentPage;
        getLastVisibleRecord();
    });
    $scope.sort={
        by:$scope.columns[0] ? $scope.columns[0].binding : null,
        zA:false
    }
    $scope.$watch('currentPage', function (v) {
        getLastVisibleRecord();
    });
    $scope.gridViewTo = $scope.pageSize = 25;
    $scope.currentPage = 1;
    $scope.filter=null;
    $scope.$watch('filter', function (v) {
        if (!v) {
            $scope.data = $scope.rawdata;
            return false;
        }
        v = v.trim().replace(" ,", ",").replace(", ", ",").toLowerCase().split(",");
        $scope.data = $scope.rawdata.filter(function (r) {
            var m = 0;
            v.forEach(function (t) {
                for (var k in r) {
                    if (typeof r[k] == "string") {
                        if (~r[k].toLowerCase().indexOf(t)) {
                            m++;
                            return;
                        }
                    }
                }
            });
            return (m == v.length) ? true : false;
        });
        
    });
    $scope.selections = {};
    function select(r) {
        var selected = $scope.selections[r.id];
        if (!$scope.$parent.ctrlKey || $scope.summaryView) {
            $scope.selections = {};
        }
        $scope.selections[r.id] = !$scope.summaryView ? !selected : true;
        if($scope.selections[r.id]){$scope.latestSelection=r;}
    }
    $scope.click=function(record, event){
        select(record)
        $scope.rowClick && $scope.rowClick(record, event, $scope);
    }
}]);
