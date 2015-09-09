(function(){

    'use strict';

    /**
     * @desc Dates calculator factory
     */

     angular
         .module('ngDatepicker')
         .factory('datesCalculator', datesCalculator);

    function datesCalculator () {

        function getWeeks () {

        }

        return {
            getWeeks: getWeeks
        };
    }

})();
