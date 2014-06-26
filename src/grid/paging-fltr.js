pk.filter('pkGridpagingfltr', function () {
    return function (input, start) {
        if(!input){return false;}
        start = +start;
        return input.slice(start);
    }
});