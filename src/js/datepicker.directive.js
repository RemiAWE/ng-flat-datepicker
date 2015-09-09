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
                allowFuture: '&',
                maxDate: '&',
                minDate: '&'
            },
            link: function(scope, element, attrs, ngModel) {

                var today = moment.utc();
                var dateSelected = '';

                // Data
                scope.calendarCursor  = today;
                scope.currentWeeks    = [];
                scope.daysNameList    = [];
                scope.monthsList      = moment.months();
                scope.yearsList       = [];

                // Display
                scope.pickerDisplayed = false;

                // List all days name in the current locale
                for (var i = 0; i < 7 ; i++) {
                    scope.daysNameList  .push(moment().weekday(i).format('ddd'));
                }

                for (var i = 2005; i <= moment().year(); i++) {
                    scope.yearsList.push(i);
                }

                scope.$watch(function(){ return ngModel.$modelValue; }, function(value){
                    if(moment.isDate(value)){
                        dateSelected = scope.calendarCursor = moment.utc(value);
                    }
                });

                // Ng change enabled ?
                // ngModelCtrl.$viewChangeListeners.push(function() {
                //     scope.$eval(attrs.ngChange);
                // });

                element.bind('click', function() {
                    scope.$apply(function(){
                        scope.pickerDisplayed = true;
                        // $document.on('click', function (e) {
                        //     if (element !== e.target && !element[0].contains(e.target)) {
                        //         scope.$apply(function () {
                        //             scope.pickerDisplayed = false;
                        //         });
                        //      }
                        // });
                    });
                });

                scope.$watch('pickerDisplayed', function(val){
                    if(val){
                        var isHover = false;
                        element.bind('mouseenter mouseleave', function(){
                            isHover = !isHover;
                        });
                    }
                });

                init();

                /**
                 * Display the previous month in the datepicker
                 * @return {}
                 */
                scope.prevMonth = function() {
                    scope.calendarCursor = moment(scope.calendarCursor).subtract(1, 'months');
                    scope.currentWeeks = getWeeks(scope.calendarCursor);
                };

                /**
                 * Display the next month in the datepicker
                 * @return {}
                 */
                scope.nextMonth = function nextMonth() {
                    scope.calendarCursor = moment(scope.calendarCursor).add(1, 'months');
                    scope.currentWeeks = getWeeks(scope.calendarCursor);
                };

                /**
                 * Select a month and display it in the datepicker
                 * @param  {string} month The month selected in the select element
                 * @return {}
                 */
                scope.selectMonth = function selectMonth(month) {
                    scope.calendarCursor = moment(scope.calendarCursor).month(month);
                    scope.currentWeeks = getWeeks(scope.calendarCursor);
                };

                /**
                 * Select a year and display it in the datepicker depending on the current month
                 * @param  {string} year The year selected in the select element
                 * @return {}
                 */
                scope.selectYear = function selectYear(year) {
                    scope.calendarCursor = moment(scope.calendarCursor).year(year);
                    scope.currentWeeks = getWeeks(scope.calendarCursor);
                };

                /**
                 * Select a day
                 * @param  {[type]} day [description]
                 * @return {[type]}     [description]
                 */
                scope.selectDay = function(day) {
                    console.log('Hello', day);
                    ngModel.$setViewValue(day.date);
                    ngModel.$render();
                    scope.pickerDisplayed = false;
                };

                /**
                 * Init the directive
                 * @return {}
                 */
                function init() {
                    var template = angular.element($templateCache.get('datepicker.html'));
                    $compile(template)(scope);
                    element.after(template);

                    if (angular.isDefined(ngModel.$modelValue) && moment.isDate(ngModel.$modelValue)) {
                        scope.calendarCursor = ngModel.$modelValue;
                    }

                    scope.currentWeeks = getWeeks(scope.calendarCursor);
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

                        var day = {
                            date: moment(start).toDate(),
                            isToday: start.isSame(today, 'day'),
                            isInMonth: start.isSame(firstDayOfMonth, 'month'),
                            isSelected: start.isSame(dateSelected, 'day'),
                            isFuture: start.isAfter(today)
                        };

                        currentWeek.push(day);

                        if (start.weekday() === 6 || start === endDay) {
                            weeks.push(currentWeek);
                            currentWeek = [];
                        }
                    }

                    return weeks;
                }
            }
        };
    }

})();
