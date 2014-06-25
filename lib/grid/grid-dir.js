pk.directive("pkGrid", ["$rootScope", function ($rootScope) {
    return {
        restrict: "E",
        require: "^pkContainer",
        replace: true,
        transclude: true,
        template: "<div class='pk-cmp pk-noSelect pk-grid'>\
            <div class='pk-cmpBody' ng-controller='pkGridctrl'>\
                <header class='pk-cmpBodyHeader'>\
                    <span class='pk-filterInput'>\
                        <input type='text' class='pk-autogrow' data-ng-model='filter'/>\
                    </span>\
                    <ul pk-clickToggle class='pk-dropdown pk-subtle {{active && \"pk-show\" || \"\"}}' ng-show='data.length>0'>\
                        <li>Columns\
                            <ul>\
                                <li class='{{column.hide && \"pk-unchecked\" || \"pk-checked\"}}' ng-repeat='column in columns' ng-click='column.hide = !column.hide'>\
                                    {{column.header}}\
                                </li>\
                            </ul>\
                        </li>\
                    </ul>\
                    <pk-gridHeaders></pk-gridHeaders>\
                </header>\
                <section class='pk-cmpBodyContent'>\
                    <span ng-show='lastVisibleRecord == 0'>No results found...</span>\
                    <pk-gridCols></pk-gridCols>\
                </section>\
                <footer class='pk-cmpBodyFooter'>\
                    <div ng-show='data.length>0' class='pk-gridPaging'>Showing {{1+(currentPage-1)*pageSize}} to {{lastVisibleRecord}} of {{data.length}}, page\
                        <input type='text' pk-gridpaging min='1' max='{{pageCount}}' maxlength='3' ng-model='currentPage' style='width:{{(pageCount/10)+2*10 | number:0}}px;' />of {{pageCount}}\
                        <button class='pk-btnNextPage pk-toRight' ng-disabled='currentPage >= data.length/pageSize' ng-click='currentPage=currentPage+1'></button>\
                        <button class='pk-btnPrevPage pk-toRight' ng-disabled='currentPage == 1' ng-click='currentPage=currentPage-1'></button>\
                    </div>\
                </footer>\
            </div>\
        </div>",
        scope:false
    }
}]);