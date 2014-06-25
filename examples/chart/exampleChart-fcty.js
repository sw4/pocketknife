pk.factory('exampleChartfcty', ['$http', '$timeout',
function ($http, $timeout) {
    var factory = {
        fetch: function () {
            var data = [{
                "time": 1401446958259,
                    "value1": 4,
                    "value2": 4,
                    "value3": 0
            }, {
                "time": 1401446958560,
                    "value1": 6,
                    "value2": 10,
                    "value3": 0
            }, {
                "time": 1401446958860,
                    "value1": 8,
                    "value2": 13,
                    "value3": 1
            }, {
                "time": 1401446959160,
                    "value1": 3,
                    "value2": 18,
                    "value3": 1
            }, {
                "time": 1401446959460,
                    "value1": 9,
                    "value2": 10,
                    "value3": 1
            }, {
                "time": 1401446959761,
                    "value1": 0,
                    "value2": 7,
                    "value3": 0
            }, {
                "time": 1401446960061,
                    "value1": 7,
                    "value2": 17,
                    "value3": 1
            }, {
                "time": 1401446960361,
                    "value1": 3,
                    "value2": 10,
                    "value3": 0
            }, {
                "time": 1401446960662,
                    "value1": 0,
                    "value2": 16,
                    "value3": 0
            }, {
                "time": 1401446960962,
                    "value1": 9,
                    "value2": 9,
                    "value3": 0
            }, {
                "time": 1401446961262,
                    "value1": 5,
                    "value2": 4,
                    "value3": 0
            }, {
                "time": 1401446961562,
                    "value1": 3,
                    "value2": 10,
                    "value3": 0
            }, {
                "time": 1401446961862,
                    "value1": 0,
                    "value2": 17,
                    "value3": 1
            }, {
                "time": 1401446962162,
                    "value1": 8,
                    "value2": 8,
                    "value3": 1
            }, {
                "time": 1401446962462,
                    "value1": 2,
                    "value2": 19,
                    "value3": 1
            }, {
                "time": 1401446962762,
                    "value1": 0,
                    "value2": 0,
                    "value3": 1
            }];

            if (data.length && !data[0].id) {
                var id = 1;
                data.forEach(function (r) {
                    r.id = id;
                    id++;
                });
            };
            return data;
        }
    };
    return factory;
}]);