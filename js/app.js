(function() {

    'use strict';

    /**
     * Test code for ng-datepicker demo
     */
    angular
        .module('testApp', ['ngFlatDatepicker'])
        .controller('mainController', ['$scope', mainController]);

    function mainController ($scope) {

        // $scope.minDate = moment.utc('2015-09-04');
        // $scope.maxDate = moment.utc('2015-09-22');
    }

})();
