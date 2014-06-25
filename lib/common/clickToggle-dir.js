pk.directive('pkClicktoggle', ['$document', function ($document) {
    return {
        scope:true,
        link: function postLink(scope, element, attrs) {           
            onClick = function (event) {
                var parent=$(event.target).parents('[pk-clicktoggle]');
                $('[pk-clicktoggle]').removeClass('pk-show');
                if (parent.length > 0) {  
                    parent.addClass('pk-show');
                }
            }
            var id = attrs.id || attrs.clickToggle || 'pkClicktoggle'+(Math.floor(Math.random() * (999 - 0 + 1)) + 0);
            attrs.clickToggle=id;
            scope.$watch(attrs.clickToggle, function(v) {
                if (v == false) {
                    $document.unbind('click', onClick);                    
                }else  {
                    $document.bind('click', onClick);
                }
            });
        }
    };
}]);