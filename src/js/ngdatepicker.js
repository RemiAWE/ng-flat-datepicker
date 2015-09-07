(function() {

    'use strict';

    /**
     * @desc Datepicker directive
     * @example <ng-datepicker></ng-datepicker>
     */

    angular
        .module('ngDatepicker', [])
        .directive('ngDatepicker', [ngDatepickerDirective]);

    function ngDatepickerDirective() {
        return {
            restrict: 'A',
            // templateUrl: 'template/datepicker.html',
            require: 'ngModel',
            scope: {
                allowFuture: '&',
                maxDate: '&',
                minDate: '&'
            },
            link: function(scope, element, attrs, ngModel) {

                var today = moment.utc();

                scope.monthSelected = scope.yearSelected = '';
                scope.currentWeeks = [];

                init();

                /**
                 * Init the directive
                 * @return {}
                 */
                function init() {

                    var dateCursor = today;

                    if (angular.isDefined(ngModel.$modelValue) && moment.isDate(ngModel.$modelValue)) {
                        dateCursor = ngModel.$modelValue;
                    }

                    scope.weeks = getWeeks(dateCursor);
                }

                /**
                 * List weeks
                 * @return {array} list of weeks objects
                 */
                function getWeeks(date) {

                    var weeks = [];
                    var date = moment.utc(date);
                    var dateSelected = moment.utc(ngModel.$modelValue);
                    var firstDayOfMonth = moment(date).date(1);
                    var lastDayOfMonth  = moment(date).date(date.daysInMonth());

                    var startDay = moment(firstDayOfMonth);
                    var endDay   = moment(lastDayOfMonth);
                    // NB: We use weekday() to get a locale aware weekday
                    startDay = firstDayOfMonth.weekday() === 0 ? startDay : startDay.weekday(0);
                    endDay   = lastDayOfMonth.weekday()  === 6 ? endDay   : endDay.weekday(6);

                    var currentWeek = [];

                    for (var start = moment(startDay); start.isBefore(endDay); start.add(1, 'days')) {

                        var day = {
                            date: moment(start).toDate(),
                            isToday: start.isSame(today, 'day'),
                            isInMonth: start.isSame(firstDayOfMonth, 'month'),
                            isSelected: start.isSame(dateSelected, 'day'),
                            isFuture: start.isAfter(today)
                        };

                        currentWeek.push(day);

                        if (start.weekday() === 6) {
                            weeks.push(currentWeek);
                            currentWeek = [];
                        }
                    }

                    console.log(weeks);
                }
            }
        };
    }

})();
