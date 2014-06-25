pk.directive("pkGridheaders", ["$rootScope",'$http', '$compile', function ($rootScope,$http, $compile) {
    return {
        restrict: "E",
        require: "^pkGrid",
        replace: true,      
        scope:false,
        template: "<table class='pk-gridHeader' ng-show='data.length>0'>\
            <tr class='pk-gridRow'>\
                <th ng-repeat='column in columns | filter:{hide:\"!true\"}' class='pk-gridHead {{(sort.by==column.binding && sort.zA && \"pk-sort-asc\") || (sort.by==column.binding && !sort.zA && \"pk-sort-desc\")  || \"\"}}' ng-click='sort.by = column.binding; sort.zA=!sort.zA'>{{column.header}}</th>\
            </tr>\
        </table>"
    }
}]);