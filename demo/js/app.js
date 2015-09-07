(function() {

    'use strict';

    /**
     * Test code for ng-datepicker demo
     */
    angular
        .module('testApp', ['ngDatepicker'])
        .controller('mainController', ['$scope', mainController]);

    function mainController ($scope) {
        console.log('Test APp');
    }

})();
