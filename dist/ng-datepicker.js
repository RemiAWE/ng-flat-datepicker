(function() {

    'use strict';

    /**
     * @desc Datepicker directive
     * @example <ng-datepicker></ng-datepicker>
     */

    angular
        .module('ngDatepicker', [])
        .directive('ngDatepicker', ngDatepickerDirective);

    function ngDatepickerDirective($templateCache, $compile, $document, datesCalculator) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                dateFormat: '=?',
                allowFuture: '=?',
                minDate: '=?',
                maxDate: '=?'
            },
            link: function(scope, element, attrs, ngModel) {

                var template     = angular.element($templateCache.get('datepicker.html'));
                var dateSelected = '';
                var today        = moment.utc();

                // Default options
                scope.allowFuture = angular.isDefined(scope.allowFuture) ? scope.allowFuture : true;
                scope.dateFormat  = angular.isDefined(scope.dateFormat)  ? scope.dateFormat  : false;
                scope.minDate     = angular.isDefined(scope.minDate)     ? moment.utc(scope.minDate).subtract(1, 'day') : false;
                scope.maxDate     = angular.isDefined(scope.maxDate)     ? moment.utc(scope.maxDate).add(1, 'day') : false;

                // Data
                scope.calendarCursor  = today;
                scope.currentWeeks    = [];
                scope.daysNameList    = datesCalculator.getDaysNames();
                scope.monthsList      = moment.months();
                scope.yearsList       = datesCalculator.getYearsList();

                // Display
                scope.pickerDisplayed = false;

                scope.$watch(function(){ return ngModel.$modelValue; }, function(value){
                    if (value) {
                        dateSelected = scope.calendarCursor = moment.utc(value, scope.dateFormat);
                    }
                });

                scope.$watch('calendarCursor', function(val){
                    scope.getMonths =
                    scope.currentWeeks = getWeeks(val);
                });

                // Ng change enabled ?
                // ngModelCtrl.$viewChangeListeners.push(function() {
                //     scope.$eval(attrs.ngChange);
                // });

                /**
                 * ClickOutside, handle all clicks outside the DatePicker when visible
                 */
                element.bind('click', function(e) {
                    e.stopPropagation();
                    scope.$apply(function(){
                        scope.pickerDisplayed = true;
                        $document.bind('click', function (e) {
                            if (template !== e.target && !template[0].contains(e.target)) {
                                $document.unbind('click');
                                scope.$apply(function () {
                                    scope.calendarCursor = dateSelected ? dateSelected : today;
                                    scope.pickerDisplayed = scope.showMonthsList = scope.showYearsList = false;
                                });
                             }
                        });
                    });
                });

                init();

                /**
                 * Display the previous month in the datepicker
                 * @return {}
                 */
                scope.prevMonth = function() {
                    scope.calendarCursor = moment(scope.calendarCursor).subtract(1, 'months');
                };

                /**
                 * Display the next month in the datepicker
                 * @return {}
                 */
                scope.nextMonth = function nextMonth() {
                    scope.calendarCursor = moment(scope.calendarCursor).add(1, 'months');
                };

                /**
                 * Select a month and display it in the datepicker
                 * @param  {string} month The month selected in the select element
                 * @return {}
                 */
                scope.selectMonth = function selectMonth(month) {
                    scope.showMonthsList = false;
                    scope.calendarCursor = moment(scope.calendarCursor).month(month);
                };

                /**
                 * Select a year and display it in the datepicker depending on the current month
                 * @param  {string} year The year selected in the select element
                 * @return {}
                 */
                scope.selectYear = function selectYear(year) {
                    scope.showYearsList = false;
                    scope.calendarCursor = moment(scope.calendarCursor).year(year);
                };

                /**
                 * Select a day
                 * @param  {[type]} day [description]
                 * @return {[type]}     [description]
                 */
                scope.selectDay = function(day) {
                    if (!day.isFuture || (scope.allowFuture && day.isFuture)) {
                        resetSelectedDays();
                        day.isSelected = true;
                        ngModel.$setViewValue(moment.utc(day.date).format(scope.dateFormat));
                        ngModel.$render();
                        scope.pickerDisplayed = false;
                    }
                };

                /**
                 * Init the directive
                 * @return {}
                 */
                function init() {

                    element.wrap('<div class="ng-datepicker-wrapper"></div>');
                    
                    $compile(template)(scope);
                    element.after(template);

                    if (angular.isDefined(ngModel.$modelValue) && moment.isDate(ngModel.$modelValue)) {
                        scope.calendarCursor = ngModel.$modelValue;
                    }
                }

                /**
                 * Get all weeks needed to display a month on the Datepicker
                 * @return {array} list of weeks objects
                 */
                function getWeeks (date) {

                    var weeks = [];
                    var date = moment.utc(date);
                    var firstDayOfMonth = moment(date).date(1);
                    var lastDayOfMonth  = moment(date).date(date.daysInMonth());

                    var startDay = moment(firstDayOfMonth);
                    var endDay   = moment(lastDayOfMonth);
                    // NB: We use weekday() to get a locale aware weekday
                    startDay = firstDayOfMonth.weekday() === 0 ? startDay : startDay.weekday(0);
                    endDay   = lastDayOfMonth.weekday()  === 6 ? endDay   : endDay.weekday(6);

                    var currentWeek = [];

                    for (var start = moment(startDay); start.isBefore(moment(endDay).add(1, 'days')); start.add(1, 'days')) {

                        var afterMinDate  = !scope.minDate || start.isAfter(scope.minDate, 'day');
                        var beforeMaxDate = !scope.maxDate || start.isBefore(scope.maxDate, 'day');
                        var isFuture      = start.isAfter(today);
                        var beforeFuture  = scope.allowFuture || !isFuture;

                        var day = {
                            date: moment(start).toDate(),
                            isToday: start.isSame(today, 'day'),
                            isInMonth: start.isSame(firstDayOfMonth, 'month'),
                            isSelected: start.isSame(dateSelected, 'day'),
                            isSelectable: afterMinDate && beforeMaxDate && beforeFuture
                        };

                        currentWeek.push(day);

                        if (start.weekday() === 6 || start === endDay) {
                            weeks.push(currentWeek);
                            currentWeek = [];
                        }
                    }

                    return weeks;
                }

                /**
                 * Reset all selected days
                 */
                function resetSelectedDays () {
                    scope.currentWeeks.forEach(function(week, wIndex){
                        week.forEach(function(day, dIndex){
                            scope.currentWeeks[wIndex][dIndex].isSelected = false;
                        });
                    });
                }
            }
        };
    }
    ngDatepickerDirective.$inject = ["$templateCache", "$compile", "$document", "datesCalculator"];

})();

(function(){

    'use strict';

    /**
     * @desc Dates calculator factory
     */

     angular
         .module('ngDatepicker')
         .factory('datesCalculator', datesCalculator);

    function datesCalculator () {

        /**
         * List all years for the select
         * @return {[type]} [description]
         */
        function getYearsList() {
            var yearsList = [];
            for (var i = 2005; i <= moment().year(); i++) {
                yearsList.push(i);
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
                daysNameList.push(moment().weekday(i).format('ddd'));
            }
            return daysNameList;
        }

        return {
            getYearsList: getYearsList,
            getDaysNames: getDaysNames
        };
    }

})();

angular.module("ngDatepicker").run(["$templateCache", function($templateCache) {$templateCache.put("datepicker.html","<div class=\"ng-datepicker\" ng-show=\"pickerDisplayed\">\n    <div class=\"ng-datepicker-table-header-bckgrnd\"></div>\n    <table>\n        <caption>\n            <div class=\"ng-datepicker-header-wrapper\">\n                <span class=\"ng-datepicker-arrow ng-datepicker-arrow-left\" ng-click=\"prevMonth()\">\n                    <svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"50\" y=\"50\" viewBox=\"0 0 100 100\" xml:space=\"preserve\">\n                        <polygon points=\"64.8,36.2 35.2,6.5 22.3,19.4 51.9,49.1 22.3,78.8 35.2,91.7 77.7,49.1\" />\n                    </svg>\n                </span>\n                <div class=\"ng-datepicker-header-year\">\n                    <div class=\"ng-datepicker-custom-select-box\" outside-click=\"showMonthsList = false\">\n                        <span class=\"ng-datepicker-custom-select-title ng-datepicker-month-name\" ng-click=\"showMonthsList = !showMonthsList; showYearsList = false\" ng-class=\"{selected: showMonthsList }\">{{ calendarCursor.format(\'MMMM\') }}</span>\n                        <div class=\"ng-datepicker-custom-select\" ng-show=\"showMonthsList\">\n                            <span ng-repeat=\"monthName in monthsList\" ng-click=\"selectMonth(monthName); showMonthsList = false\">{{ monthName }}</span>\n                        </div>\n                    </div>\n                    <div class=\"ng-datepicker-custom-select-box\" outside-click=\"showYearsList = false\">\n                        <span class=\"ng-datepicker-custom-select-title\" ng-click=\"showYearsList = !showYearsList; showMonthsList = false\" ng-class=\"{selected: showYearsList }\">{{ calendarCursor.format(\'YYYY\') }}</span>\n                        <div class=\"ng-datepicker-custom-select\" ng-show=\"showYearsList\">\n                            <span ng-repeat=\"yearNumber in yearsList\" ng-click=\"selectYear(yearNumber)\">{{ yearNumber }}</span>\n                        </div>\n                    </div>\n                </div>\n                <span class=\"ng-datepicker-arrow ng-datepicker-arrow-right\" ng-click=\"nextMonth()\">\n                    <svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"50\" y=\"50\" viewBox=\"0 0 100 100\" xml:space=\"preserve\">\n                        <polygon points=\"64.8,36.2 35.2,6.5 22.3,19.4 51.9,49.1 22.3,78.8 35.2,91.7 77.7,49.1\" />\n                    </svg>\n                </span>\n            </div>\n        </caption>\n        <tbody>\n            <tr class=\"days-head\">\n                <td class=\"day-head\" ng-repeat=\"dayName in daysNameList\">{{ dayName }}</td>\n            </tr>\n            <tr class=\"days\" ng-repeat=\"week in currentWeeks\">\n                <td ng-repeat=\"day in week\" ng-click=\"selectDay(day)\" ng-class=\"[\'day-item\', { \'isToday\': day.isToday, \'isInMonth\': day.isInMonth, \'isDisabled\': !day.isSelectable, \'isSelected\': day.isSelected }]\">{{ day.date | date:\'dd\' }}</td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n");}]);