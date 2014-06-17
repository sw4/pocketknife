var myApp = angular.module('myApp', []);

myApp.controller('pageController', ['$scope', function ($scope) {

    $scope.ctrlPressed = false;
    $scope.keydown = function (event) {
        if (event.keyCode == 27 || event.key == "Esc") {
            // escape
        } else if (event.keyCode == 32 || event.key == "Spacebar") {
            // space
        } else if (event.keyCode == 17 || event.key == "Control") {
            // ctrl
            $scope.ctrlPressed = true;
        } else if (event.keyCode == 13 || event.key == "Enter") {
            // enter
        }
    }
    $scope.keyup = function (event) {
        if (event.keyCode == 17 || event.key == "Control") {
            // ctrl
            $scope.ctrlPressed = false;
        }
    }
}]);

myApp.directive('keydown', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            scope.$apply(function () {
                scope.$eval(attrs.ngEnter);
            });
        });
    };
});
myApp.directive('keyup', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            scope.$apply(function () {
                scope.$eval(attrs.ngEnter);
            });
        });
    };
});

myApp.filter('gridPaging', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

myApp.directive('gridPaging', function () {
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

myApp.controller("myController", ['$scope', 'myFactory', '$timeout',

function ($scope, myFactory, $timeout) {


    function getGridViewTo() {
        $scope.gridViewTo = $scope.pageSize * $scope.currentPage > $scope.gridData.length ? $scope.gridData.length : $scope.pageSize * $scope.currentPage;
    }
    $scope.gridData = null;
    $scope.$watch('gridData', function (v) {
        $scope.pageCount = Math.ceil($scope.gridData.length / $scope.pageSize);
        $scope.pageCount = $scope.pageCount == 0 ? 1 : $scope.pageCount;
        $scope.currentPage = $scope.currentPage > $scope.pageCount ? $scope.pageCount : $scope.currentPage;
        getGridViewTo();
    });
    $scope.$watch('currentPage', function (v) {
        getGridViewTo();
    });
    $scope.$watch('gridFilter', function (v) {
        if (!v) {
            $scope.gridData = $scope.data;
            return false;
        }
        v = v.trim().replace(" ,", ",").replace(", ", ",").toLowerCase().split(",");
        $scope.gridData = $scope.data.filter(function (r) {
            var m = 0;
            v.forEach(function (t) {
                for (var k in r) {
                    if (typeof r[k] == "string") {
                        if (~r[k].toLowerCase().indexOf(t)) {
                            m++;
                            return;
                        }
                    }
                }
            });
            return (m == v.length) ? true : false;
        })
        //        var filteredData = $filter('filter')($scope.persons, $scope.query);
    });

    $scope.gridViewTo = $scope.pageSize = 25;
    $scope.currentPage = 1;
    $scope.selections = {};
    $scope.select = function (r) {
        var selected = $scope.selections[r.id];
        if (!$scope.$parent.ctrlPressed) {
            $scope.selections = {};
        }
        $scope.selections[r.id] = !selected;
    }
    $scope.minimized = false;
    (function () {
        $scope.gridData = $scope.data = myFactory.fetch();
    })();
}]);







myApp.factory('myFactory', ['$http', '$timeout',

function ($http, $timeout) {
    var factory = {
        fetch: function () {
            var data = [{
                "c1": "Deanna",
                    "c2": "P.O. Box 477, 3872 Cum Avenue",
                    "c3": "-0.026627278403878",
                    "c4": "19943"
            }, {
                "c1": "Ifeoma",
                    "c2": "P.O. Box 258, 3244 Pellentesque St.",
                    "c3": "-0.24065975943735",
                    "c4": "04989"
            }, {
                "c1": "Jermaine",
                    "c2": "P.O. Box 538, 9424 At St.",
                    "c3": "-0.25647778087794",
                    "c4": "41051"
            }, {
                "c1": "Driscoll",
                    "c2": "Ap #397-9921 Feugiat St.",
                    "c3": "0.14012462936056",
                    "c4": "78608"
            }, {
                "c1": "Brooke",
                    "c2": "851-2228 Tellus, Street",
                    "c3": "0.091696710670144",
                    "c4": "30960"
            }, {
                "c1": "Alisa",
                    "c2": "348-4837 Leo. Rd.",
                    "c3": "0.016846250202735",
                    "c4": "01579"
            }, {
                "c1": "Wallace",
                    "c2": "Ap #696-9558 Ipsum. Av.",
                    "c3": "0.09031505653082",
                    "c4": "93132"
            }, {
                "c1": "Winifred",
                    "c2": "9975 Consequat St.",
                    "c3": "-0.048349931262347",
                    "c4": "37175"
            }, {
                "c1": "Armand",
                    "c2": "P.O. Box 161, 5064 Est. Rd.",
                    "c3": "0.36237918565815",
                    "c4": "28162"
            }, {
                "c1": "Rhoda",
                    "c2": "122-4557 Venenatis Rd.",
                    "c3": "0.24475698494803",
                    "c4": "35223"
            }, {
                "c1": "Teegan",
                    "c2": "Ap #648-3658 Dolor, Street",
                    "c3": "-0.13003776549214",
                    "c4": "61151"
            }, {
                "c1": "McKenzie",
                    "c2": "200-3230 Ligula. Avenue",
                    "c3": "0.098598974462423",
                    "c4": "85639"
            }, {
                "c1": "Sylvester",
                    "c2": "4877 Tempor Ave",
                    "c3": "0.0040776757757092",
                    "c4": "32040"
            }, {
                "c1": "Stephen",
                    "c2": "122-961 Ornare St.",
                    "c3": "-0.32645914286235",
                    "c4": "26574"
            }, {
                "c1": "Grady",
                    "c2": "7157 Luctus Road",
                    "c3": "-0.67364302085278",
                    "c4": "90521"
            }, {
                "c1": "Angela",
                    "c2": "Ap #902-5735 Egestas Avenue",
                    "c3": "0.055286575191329",
                    "c4": "98003"
            }, {
                "c1": "Samson",
                    "c2": "Ap #526-2416 A Rd.",
                    "c3": "0.085088732012515",
                    "c4": "30543"
            }, {
                "c1": "Yvette",
                    "c2": "432-8345 Interdum Ave",
                    "c3": "-0.058173924260042",
                    "c4": "42387"
            }, {
                "c1": "Serina",
                    "c2": "Ap #697-2285 Eget, Avenue",
                    "c3": "-0.07581943280377",
                    "c4": "20586"
            }, {
                "c1": "Reese",
                    "c2": "P.O. Box 433, 6237 Convallis St.",
                    "c3": "-0.21740768667821",
                    "c4": "27950"
            }, {
                "c1": "Kitra",
                    "c2": "648-888 Dolor Rd.",
                    "c3": "0.0097938373759576",
                    "c4": "98168"
            }, {
                "c1": "Olympia",
                    "c2": "266-6221 Cum St.",
                    "c3": "0.065837883021354",
                    "c4": "47696"
            }, {
                "c1": "Idona",
                    "c2": "Ap #339-8594 Ullamcorper Rd.",
                    "c3": "-0.18884080342951",
                    "c4": "00393"
            }, {
                "c1": "Wallace",
                    "c2": "603-1752 Elementum, Av.",
                    "c3": "-0.21771417809567",
                    "c4": "55875"
            }, {
                "c1": "Rhiannon",
                    "c2": "1989 Malesuada Rd.",
                    "c3": "0.10235722625995",
                    "c4": "70459"
            }, {
                "c1": "Deirdre",
                    "c2": "Ap #683-4859 Accumsan St.",
                    "c3": "0.28817297661679",
                    "c4": "94915"
            }, {
                "c1": "Kibo",
                    "c2": "Ap #746-7605 Ut Rd.",
                    "c3": "-0.45270987501608",
                    "c4": "43879"
            }, {
                "c1": "Amaya",
                    "c2": "Ap #328-4676 Egestas Rd.",
                    "c3": "-0.31274737340951",
                    "c4": "40656"
            }, {
                "c1": "Clark",
                    "c2": "Ap #854-5128 At Road",
                    "c3": "0.10436947197827",
                    "c4": "68387"
            }, {
                "c1": "Austin",
                    "c2": "P.O. Box 274, 4782 Senectus Av.",
                    "c3": "-0.51537620128524",
                    "c4": "84962"
            }, {
                "c1": "Quon",
                    "c2": "Ap #920-7157 Sed St.",
                    "c3": "0.16701777876146",
                    "c4": "75490"
            }, {
                "c1": "Dante",
                    "c2": "776-1924 Cras Rd.",
                    "c3": "-0.050527226729644",
                    "c4": "49054"
            }, {
                "c1": "Lucian",
                    "c2": "9983 Dui St.",
                    "c3": "0.48504331387952",
                    "c4": "60158"
            }, {
                "c1": "Oscar",
                    "c2": "7964 Rhoncus. St.",
                    "c3": "-0.15408687504035",
                    "c4": "12875"
            }, {
                "c1": "Jane",
                    "c2": "1681 Arcu Ave",
                    "c3": "-0.24604611692502",
                    "c4": "58534"
            }, {
                "c1": "Hasad",
                    "c2": "1366 Gravida. St.",
                    "c3": "-0.06186325944857",
                    "c4": "58788"
            }, {
                "c1": "Destiny",
                    "c2": "541-8491 Scelerisque Ave",
                    "c3": "0.35371826552643",
                    "c4": "24332"
            }, {
                "c1": "Illiana",
                    "c2": "Ap #510-4685 Eu Ave",
                    "c3": "-0.19773153007262",
                    "c4": "06741"
            }, {
                "c1": "Colorado",
                    "c2": "403-3043 Ipsum St.",
                    "c3": "-0.44119877118072",
                    "c4": "44670"
            }, {
                "c1": "Pascale",
                    "c2": "Ap #355-2878 Dolor Road",
                    "c3": "0.16330708860259",
                    "c4": "62136"
            }, {
                "c1": "Constance",
                    "c2": "Ap #965-8976 Diam. Avenue",
                    "c3": "-0.14968232376609",
                    "c4": "80422"
            }, {
                "c1": "Sheila",
                    "c2": "Ap #321-5679 Lobortis Road",
                    "c3": "0.17079918316955",
                    "c4": "84508"
            }, {
                "c1": "Sheila",
                    "c2": "824-1086 Bibendum Rd.",
                    "c3": "0.086519933585856",
                    "c4": "35879"
            }, {
                "c1": "Jena",
                    "c2": "P.O. Box 115, 2058 Et Rd.",
                    "c3": "-0.33701899512304",
                    "c4": "34228"
            }, {
                "c1": "Tarik",
                    "c2": "Ap #654-1492 Lobortis Rd.",
                    "c3": "0.20466574920734",
                    "c4": "76499"
            }, {
                "c1": "Thomas",
                    "c2": "7736 Aliquet. Rd.",
                    "c3": "-0.085304169257177",
                    "c4": "80287"
            }, {
                "c1": "Ursula",
                    "c2": "Ap #398-4087 Cursus Street",
                    "c3": "-0.18351134773729",
                    "c4": "00103"
            }, {
                "c1": "Olivia",
                    "c2": "819-2023 Mauris. Road",
                    "c3": "-0.36325882314051",
                    "c4": "42867"
            }, {
                "c1": "Xantha",
                    "c2": "3623 A, Rd.",
                    "c3": "0.21061147955245",
                    "c4": "65380"
            }, {
                "c1": "Abdul",
                    "c2": "400-7042 Dui, Rd.",
                    "c3": "-0.072206738342388",
                    "c4": "40986"
            }, {
                "c1": "Lynn",
                    "c2": "P.O. Box 337, 5724 Non Rd.",
                    "c3": "-0.0064883171430446",
                    "c4": "59816"
            }, {
                "c1": "Alexa",
                    "c2": "1281 Bibendum Ave",
                    "c3": "0.1511978794361",
                    "c4": "38632"
            }, {
                "c1": "Jorden",
                    "c2": "8780 Dictum Avenue",
                    "c3": "-0.19279677254279",
                    "c4": "59310"
            }, {
                "c1": "Ila",
                    "c2": "Ap #638-433 Enim. Rd.",
                    "c3": "-0.14479856546035",
                    "c4": "43679"
            }, {
                "c1": "Kathleen",
                    "c2": "Ap #306-1512 Metus Rd.",
                    "c3": "0.21564929788136",
                    "c4": "39577"
            }, {
                "c1": "Hoyt",
                    "c2": "9007 Donec Ave",
                    "c3": "-0.18839962184904",
                    "c4": "99627"
            }, {
                "c1": "Deborah",
                    "c2": "279-2880 Ligula St.",
                    "c3": "-0.2470988194263",
                    "c4": "44195"
            }, {
                "c1": "Allistair",
                    "c2": "P.O. Box 217, 4859 Cras Rd.",
                    "c3": "0.71365174283292",
                    "c4": "09656"
            }, {
                "c1": "Audra",
                    "c2": "P.O. Box 619, 5128 Odio. Avenue",
                    "c3": "-0.21389620662442",
                    "c4": "42152"
            }, {
                "c1": "Odette",
                    "c2": "P.O. Box 566, 8471 Curabitur St.",
                    "c3": "0.3743897494083",
                    "c4": "49943"
            }, {
                "c1": "Cooper",
                    "c2": "P.O. Box 478, 8620 Magnis Road",
                    "c3": "-0.062565544272863",
                    "c4": "79413"
            }, {
                "c1": "Wanda",
                    "c2": "246-6327 Mattis. St.",
                    "c3": "0.039583254554092",
                    "c4": "34747"
            }, {
                "c1": "Nerea",
                    "c2": "442-603 Accumsan Street",
                    "c3": "0.10638934249051",
                    "c4": "92827"
            }, {
                "c1": "Chiquita",
                    "c2": "P.O. Box 963, 8776 Fringilla, Ave",
                    "c3": "-0.39122806774201",
                    "c4": "25751"
            }, {
                "c1": "Juliet",
                    "c2": "Ap #121-8688 Praesent St.",
                    "c3": "0.19584845232082",
                    "c4": "37426"
            }, {
                "c1": "Oprah",
                    "c2": "Ap #266-772 Dictum St.",
                    "c3": "0.26186587789769",
                    "c4": "82891"
            }, {
                "c1": "Deacon",
                    "c2": "P.O. Box 741, 2973 Nullam Rd.",
                    "c3": "-0.11402129262151",
                    "c4": "13170"
            }, {
                "c1": "Imani",
                    "c2": "207 Adipiscing, Rd.",
                    "c3": "-0.045090964708253",
                    "c4": "59569"
            }, {
                "c1": "Macaulay",
                    "c2": "P.O. Box 473, 1323 In, Rd.",
                    "c3": "0.14103426888984",
                    "c4": "56496"
            }, {
                "c1": "Alika",
                    "c2": "806-5678 Metus. Rd.",
                    "c3": "0.014478575264852",
                    "c4": "50897"
            }, {
                "c1": "Lester",
                    "c2": "Ap #541-3752 Fermentum Road",
                    "c3": "0.093499493631805",
                    "c4": "66948"
            }, {
                "c1": "Orla",
                    "c2": "Ap #634-8044 Nisl. Rd.",
                    "c3": "-0.063027303766798",
                    "c4": "18150"
            }, {
                "c1": "Karleigh",
                    "c2": "P.O. Box 393, 5279 Et Rd.",
                    "c3": "0.27339124779556",
                    "c4": "58060"
            }, {
                "c1": "Nyssa",
                    "c2": "P.O. Box 609, 3375 Sagittis. Avenue",
                    "c3": "-0.22453634503372",
                    "c4": "65111"
            }, {
                "c1": "Molly",
                    "c2": "P.O. Box 232, 4089 Non St.",
                    "c3": "-0.14808094900854",
                    "c4": "74686"
            }, {
                "c1": "Rogan",
                    "c2": "5313 Metus. Road",
                    "c3": "0.84306053112144",
                    "c4": "65273"
            }, {
                "c1": "Doris",
                    "c2": "170-2507 Turpis. St.",
                    "c3": "0.19692586343186",
                    "c4": "17766"
            }, {
                "c1": "Aline",
                    "c2": "806-4675 Urna. Ave",
                    "c3": "-0.04307604430313",
                    "c4": "79144"
            }, {
                "c1": "Chandler",
                    "c2": "Ap #498-186 Augue, Rd.",
                    "c3": "0.021485982368729",
                    "c4": "56267"
            }, {
                "c1": "Herman",
                    "c2": "5253 Cubilia Road",
                    "c3": "-0.084174957269822",
                    "c4": "02386"
            }, {
                "c1": "Amethyst",
                    "c2": "Ap #706-9643 Orci, Road",
                    "c3": "0.27358000492821",
                    "c4": "10704"
            }, {
                "c1": "Blaze",
                    "c2": "9659 Ante Avenue",
                    "c3": "0.13041907659786",
                    "c4": "74227"
            }, {
                "c1": "Kareem",
                    "c2": "414-6552 Egestas. St.",
                    "c3": "-0.25525768735336",
                    "c4": "11587"
            }, {
                "c1": "Quinlan",
                    "c2": "P.O. Box 919, 7306 Dui, Rd.",
                    "c3": "-0.14420684235039",
                    "c4": "38671"
            }, {
                "c1": "Denton",
                    "c2": "3102 Pede Avenue",
                    "c3": "0.17271025397382",
                    "c4": "89605"
            }, {
                "c1": "Jaime",
                    "c2": "Ap #596-2642 In Rd.",
                    "c3": "0.23782932535564",
                    "c4": "07915"
            }, {
                "c1": "Azalia",
                    "c2": "P.O. Box 683, 1276 Congue, Av.",
                    "c3": "0.15088662935574",
                    "c4": "55879"
            }, {
                "c1": "Ronan",
                    "c2": "642 Sodales Avenue",
                    "c3": "0.37097785826234",
                    "c4": "06252"
            }, {
                "c1": "Ferris",
                    "c2": "P.O. Box 845, 9789 Vulputate, Ave",
                    "c3": "-0.24915142792728",
                    "c4": "16458"
            }, {
                "c1": "Bert",
                    "c2": "489-8848 Adipiscing, Road",
                    "c3": "0.033978935671264",
                    "c4": "20935"
            }, {
                "c1": "Yasir",
                    "c2": "160-9027 Lobortis Av.",
                    "c3": "-0.24171482476129",
                    "c4": "87107"
            }, {
                "c1": "Willow",
                    "c2": "9775 Dictum Avenue",
                    "c3": "0.29660548109179",
                    "c4": "06986"
            }, {
                "c1": "Elton",
                    "c2": "Ap #321-6248 Non St.",
                    "c3": "-0.12971378619994",
                    "c4": "69106"
            }, {
                "c1": "Lila",
                    "c2": "3256 Rhoncus. Ave",
                    "c3": "-0.0063922125772057",
                    "c4": "97438"
            }, {
                "c1": "Quinn",
                    "c2": "P.O. Box 925, 1373 Sed, Street",
                    "c3": "-0.22566451582387",
                    "c4": "86527"
            }, {
                "c1": "Timon",
                    "c2": "5346 Erat Rd.",
                    "c3": "-0.22025913123909",
                    "c4": "96431"
            }, {
                "c1": "Ira",
                    "c2": "P.O. Box 511, 5671 Aenean St.",
                    "c3": "0.076357668891015",
                    "c4": "16858"
            }, {
                "c1": "Laura",
                    "c2": "621-1708 Nascetur Street",
                    "c3": "-0.51374099758301",
                    "c4": "39789"
            }, {
                "c1": "Tanisha",
                    "c2": "4447 Lorem Street",
                    "c3": "-0.042064093900881",
                    "c4": "15375"
            }, {
                "c1": "Abel",
                    "c2": "Ap #542-9883 Cras St.",
                    "c3": "-0.28737287306428",
                    "c4": "15558"
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