portal.directive('clickToggle', ['$document', function ($document) {
    return {        
        link: function postLink(scope, element, attrs) {   
            onClick = function (event) {
                var isChild = $(element[0]).has(event.target).length > 0;
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                if (!isInside) {                
                    scope.$apply(scope.active=false);
                }else{
                    scope.$apply(scope.active=true);
                }
            }
            scope.$watch(attrs.clickToggle, function(newValue, oldValue) {
                if (newValue == false) {
                    $document.unbind('click', onClick);                    
                }else  {
                    $document.bind('click', onClick);
                }
            });
        }
    };
}]);