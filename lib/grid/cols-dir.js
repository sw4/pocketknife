pk.directive("pkGridcols", [function () {
    return {
        restrict: "E",
        require: "^pkGrid",
        replace: true,
        template: "<table class='pk-gridTable'>\
            <tr class='pk-gridRow {{selections[record.id] && \"pk-selected\" || \"\"}}' ng-repeat='record in data | pkGridpagingfltr:(currentPage-1)*pageSize | limitTo:pageSize | orderBy:sort.by:sort.zA' ng-click='click(record, $event)'>\
                <td ng-repeat='column in columns | filter:{hide:\"!true\"}' class='pk-gridCell'>{{record[column.binding]}}</td>\
            </tr>\
        </table>"
    }
}]);