pk.directive('pkGridpaging', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9]/g, '');
                transformedInput = transformedInput > 0 ? transformedInput : "1";
                transformedInput = transformedInput <= attr.max ? transformedInput : attr.max;
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return parseInt(transformedInput); // or return Number(transformedInput)
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});