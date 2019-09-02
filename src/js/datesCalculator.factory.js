(function(){

    'use strict';

    /**
     * @desc Dates calculator factory
     */

     angular
         .module('ngJalaaliFlatDatepicker')
         .factory('datesCalculator', datesCalculator);

    function datesCalculator () {

        /**
         * List all years for the select
         * @param {Integer} start year eg. 2005
         * @param {Integer} total number of years to be appear in the drop down
         * @return {Array<integer>} years list
         */
        function getYearsList(startYear, dropDownYears) {
            var yearsList = [];
            for (var i = startYear; i <= parseInt(startYear) + parseInt(dropDownYears); i++) {
                yearsList.push(moment.utc(i.toString(), 'YYYY').format('jYYYY'));
            }
            return yearsList;
        }

        /**
         * List all days name in the current locale
         * @return {[type]} [description]
         */
        function getDaysNames () {
            var daysNameList = [];
            for (var i = 0; i < 7 ; i++) {
                daysNameList.push(moment().weekday(i).format('dd'));
            }
            return daysNameList;
        }

        return {
            getYearsList: getYearsList,
            getDaysNames: getDaysNames
        };
    }

})();
