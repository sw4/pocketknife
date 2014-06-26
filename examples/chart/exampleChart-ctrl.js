pk.controller("exampleChartctrl", ['$scope', 'exampleChartfcty', '$timeout',
function ($scope, exampleChartfcty , $timeout) {
    $scope.chart={
        margin: {
            top: 5,
            right: 40,
            bottom: 60,
            left: 40
        },
        xAxis: {
            scale: "ordinal",
            values: "time",
            ticks: {
                rotate: 90,
                x: 30,
                y: -5
            },
            format: function (d) {
                var format = d3.time.format("%I:%M:%S");
                return format(new Date(d));
            }
        },
        yAxis: {
            values: "value1",
            domain: [0, 20]
        },
        series: [{
            values: "value1",
            color:"#D15E5E"
        }, {
            values: "value2",
            color:"#85A0D1"
        }]                
    };
    (function () {
        $scope.data = $scope.rawdata = exampleChartfcty.fetch();
    })();
}]);