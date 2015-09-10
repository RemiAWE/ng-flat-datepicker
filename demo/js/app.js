(function() {

    'use strict';

    /**
     * Test code for ng-datepicker demo
     */
    angular
        .module('testApp', ['ngDatepicker'])
        .controller('mainController', ['$scope', mainController]);

    function mainController ($scope) {

        $scope.date = '';

        // $scope.minDate = moment.utc('2015-09-04');
        // $scope.maxDate = moment.utc('2015-09-22');

        // console.log($scope.minDate);

        // $scope.$watch('date', function(val) {
        //     $scope.date = $filter('date')($scope.date, 'mediumDate');
        // });
    }

})();
