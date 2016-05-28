(function() {

    'use strict';

    /**
     * @desc Datepicker directive
     * @example <ng-datepicker></ng-datepicker>
     */

    angular
        .module('ngJalaaliFlatDatepicker', [])
        .directive('ngJalaaliFlatDatepicker', ngJalaaliFlatDatepickerDirective);

    function ngJalaaliFlatDatepickerDirective($templateCache, $compile, $document, datesCalculator) {
        var parseConfig = function(config) {
          var temp = angular.fromJson(config);
          if (typeof(temp.minDate) == 'undefined') {
            temp.minDate = moment.utc(temp.minDate);
          }
          if (typeof(temp.maxDate) == 'undefined') {
            temp.maxDate = moment.utc(temp.maxDate);
          }
          return temp;
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                config: '=?datepickerConfig',
                gPickedDate: '=?gregorianPickedDate',
                gFormattedPickedDate: '=?gregorianFormattedPickedDate'
            },
            link: function(scope, element, attrs, ngModel) {
                moment.loadPersian();
                var template     = angular.element($templateCache.get('datepicker.html'));
                var dateSelected = '';
                var today        = moment.utc();

                // Default options
                var defaultConfig = {
                    allowFuture: true,
                    dateFormat: null,
                    gregorianDateFormat: null,
                    dropDownYears: 10,
                    minDate: null,
                    maxDate: null
                };

                /*
                * returns start year based on configuration
                */
                var getStartYear = function() {
                  if (typeof(scope.config.minDate) == 'undefined') {
                    return scope.config.minDate.format('YYYY');
                  }
                  if (scope.config.allowFuture) {
                    return moment.utc().subtract('5', 'years').format('YYYY');
                  }
                  return moment.utc().subtract('10', 'years').format('YYYY');
                };


                // Apply and init options
                scope.config = angular.extend(defaultConfig, scope.config);
                if (angular.isDefined(scope.config.minDate)) moment.utc(scope.config.minDate).subtract(1, 'day');
                if (angular.isDefined(scope.config.maxDate)) moment.utc(scope.config.maxDate).add(1, 'day');
                if (!angular.isDefined(scope.config.gregorianDateFormat)) scope.config.gregorianDateFormat = scope.config.dateFormat.replace(/j/g, "");

                // Data
                scope.calendarCursor  = today;
                scope.currentWeeks    = [];
                scope.daysNameList    = datesCalculator.getDaysNames();
                scope.monthsList      = moment.localeData()._jMonths;
                scope.yearsList       = datesCalculator.getYearsList(getStartYear(), scope.config.dropDownYears);

                // Display
                scope.pickerDisplayed = false;

                scope.$watch(function(){ return ngModel.$modelValue; }, function(value){
                    if (value) {
                        dateSelected = scope.calendarCursor = moment.utc(value, scope.config.dateFormat);
                    }
                });

                scope.$watch('calendarCursor', function(val){
                  //scope.$apply(function() {
                    scope.currentWeeks = getWeeks(val);
                  //});

                });

                /**
                 * ClickOutside, handle all clicks outside the DatePicker when visible
                 */
                element.bind('click', function(e) {
                    scope.$apply(function(){
                        scope.pickerDisplayed = true;
                        $document.on('click', onDocumentClick);
                    });
                });

                function onDocumentClick(e) {
                    if (template !== e.target && !template[0].contains(e.target) && e.target !== element[0]) {
                        $document.off('click', onDocumentClick);
                        scope.$apply(function () {
                            scope.calendarCursor = dateSelected ? dateSelected : today;
                            scope.pickerDisplayed = scope.showMonthsList = scope.showYearsList = false;
                        });
                     }
                }

                init();

                /**
                 * Display the previous month in the datepicker
                 * @return {}
                 */
                scope.prevMonth = function() {
                    scope.calendarCursor = moment(scope.calendarCursor).subtract(1, 'jMonths');
                };

                /**
                 * Display the next month in the datepicker
                 * @return {}
                 */
                scope.nextMonth = function nextMonth() {
                    scope.calendarCursor = moment(scope.calendarCursor).add(1, 'jMonths');
                };

                /**
                 * Select a month and display it in the datepicker
                 * @param  {string} month The month selected in the select element
                 * @return {}
                 */
                scope.selectMonth = function selectMonth(month) {
                    scope.showMonthsList = false;
                    scope.calendarCursor = moment(scope.calendarCursor).jMonth(month);
                };

                /**
                 * Select a year and display it in the datepicker depending on the current month
                 * @param  {string} year The year selected in the select element
                 * @return {}
                 */
                scope.selectYear = function selectYear(year) {
                    scope.showYearsList = false;
                    scope.calendarCursor = moment(scope.calendarCursor).jYear(parseInt(year));
                };

                /**
                 * Select a day
                 * @param  {[type]} day [description]
                 * @return {[type]}     [description]
                 */
                scope.selectDay = function(day) {
                    if (day.isSelectable && !day.isFuture || (scope.config.allowFuture && day.isFuture)) {
                        resetSelectedDays();
                        day.isSelected = true;
                        ngModel.$setViewValue(moment.utc(day.date).format(scope.config.dateFormat));
                        ngModel.$render();
                        scope.gPickedDate = moment.utc(day.date);
                        scope.gFormattedPickedDate = moment.utc(day.date).format(scope.config.gregorianDateFormat);
                        scope.pickerDisplayed = false;
                    }
                };

                /**
                 * Init the directive
                 * @return {}
                 */
                function init() {

                    element.wrap('<div class="ng-jalaali-flat-datepicker-wrapper"></div>');

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
                    date = moment.utc(date);
                    var firstDayOfMonth = moment.utc(date).jDate(1);
                    var lastDayOfMonth  = moment.utc(date).jDate(moment.jDaysInMonth(moment(date).jYear, moment(date).jMonth()));

                    var startDay = moment.utc(firstDayOfMonth);
                    var endDay   = moment.utc(lastDayOfMonth);
                    // NB: We use weekday() to get a locale aware weekday
                    startDay = firstDayOfMonth.weekday() === 0 ? startDay : startDay.weekday(0);
                    endDay   = lastDayOfMonth.weekday()  === 6 ? endDay   : endDay.weekday(6);

                    var currentWeek = [];

                    for (var start = moment.utc(startDay.toDate()); start.isBefore(moment.utc(endDay).add(1, 'days')); start.add(1, 'days')) {
                        var afterMinDate  = !scope.config.minDate || start.isAfter(scope.config.minDate, 'day');
                        var beforeMaxDate = !scope.config.maxDate || start.isBefore(scope.config.maxDate, 'day');
                        var isFuture      = start.isAfter(today);
                        var beforeFuture  = scope.config.allowFuture || !isFuture;
                        var tempStart = moment.utc(start.toDate()); //there's a bug in isSame method below
                        var tempStart2 = moment.utc(start.toDate()); //there's a bug in isSame method below
                        var day = {
                            date: moment(start).toDate(),
                            jDate: moment(start).format('jDD'),
                            isToday: start.isSame(today, 'day'),
                            isInMonth: tempStart.isSame(firstDayOfMonth, 'jmonth'),
                            isSelected: tempStart2.isSame(dateSelected, 'day'),
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

})();
