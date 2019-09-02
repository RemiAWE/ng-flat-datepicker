(function() {

    'use strict';

    /**
     * Test code for ng-datepicker demo
     */
    angular
        .module('testApp', ['ngJalaaliFlatDatepicker'])
        .controller('mainController', ['$scope', mainController]);

    function mainController ($scope) {

        $scope.datepickerConfig = {
            allowFuture: false,
            dateFormat: 'jYYYY/jMM/jDD',
            gregorianDateFormat: 'YYYY/DD/MM',
            minDate: moment.utc('2008', 'YYYY')
        };
    }

})();
