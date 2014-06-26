pk.directive("pkChart", [function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template:"<div class='pk-cmp pk-noSelect pk-chart'>\
                <div class='pk-cmpBody'>\
                    <div id='chart'></div>\
                    </div>\
            </div>",
        scope:false,
        link:function(scope, element){        
            var chart=cd3({
                element: '#chart',
                type: "column",
                data: scope.data,
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
                    values: "value1"
                }, {
                    values: "value2"
                }]                
            });
        
        }
    }
}]);

