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

        $scope.$watch('date', function(val) {
            $scope.date = $filter('date')($scope.date, 'mediumDate');
        });
        console.log('Test APp');
    }

})();
