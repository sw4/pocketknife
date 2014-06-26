pk.directive("pkChart", [function () {
    var chartId="chart"+Math.floor(Math.random() * 9999) + 1;
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template:"<div class='pk-cmp pk-noSelect pk-chart'>\
                <div class='pk-cmpBody'>\
                    <div class='pk-chartArea' id='"+chartId+"'></div>\
                    </div>\
            </div>",
        scope:false,
        link:function(scope, element, attrs){  
            scope.chart.element= "#"+chartId;
            scope.chart.type= attrs.type;
            scope.chart.data= scope.data;
            scope.vis = cd3(scope.chart);
            d3.select(window).on('resize', scope.vis.resize); 
        }
    }
}]);

