/*globals expect inject angular moment*/

describe('datepicker', function() {
var $compile;
  var $rootScope;
  var $scope;
  var datepickerHtml;
  
    var input;
    var datepickerElement;
    var datepicker;
    var datepickerContainer;
  
  beforeEach(module('ngFlatDatepicker'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    datepickerHtml = '<div id="testContainer"><input ng-model="date" ng-flat-datepicker datepicker-config="datepickerConfig"> </input></div>'
  }));
  
  it("compiles it's directive", function() {
    //given
    $scope.datepickerConfig = {};
    datepickerHtml = '<div id="testContainer"><input ng-model="date" ng-flat-datepicker datepicker-config="datepickerConfig"> </input></div>';
    //when
    var node = $compile(datepickerHtml)($scope);
    $rootScope.$digest();
    //then
    expect(node.children().hasClass('ng-flat-datepicker-wrapper')).toBe(true);
  });

  it("compiles it's directive with a date set", function() {
    //given
    $rootScope.date = '02.05.1900';
    $rootScope.datepickerConfig = {
      dateFormat: 'DD.MM.YYYY'
    }
    
    //when
    compileDatepickerAndPrepareTest();
    
    //then
    expect(datepickerContainer.children().hasClass('ng-flat-datepicker-wrapper')).toBe(true);
  });
  it("opens on input click", function() {
    //given
    compileDatepickerAndPrepareTest();
    expect(datepicker.hasClass('ng-hide')).toBe(true);
    expect(datepicker.scope().pickerDisplayed).toBe(false);

    //when
    input.triggerHandler('click');

    //then
    expect(datepicker.scope().pickerDisplayed).toBe(true);
    expect(datepicker.hasClass('ng-hide')).toBe(false);
    expect(datepicker.scope().currentWeeks.length > 0).toBe(true);
  });
  it("updates the datepicker on model update", function() {
    //given
    $scope.date = '02.05.2000';
    $scope.datepickerConfig = {
      dateFormat: 'DD.MM.YYYY'
    };
    compileDatepickerAndPrepareTest();
    
    //when
    $scope.date = '03.07.2000';
    $rootScope.$digest();
    input.triggerHandler('click');
    $rootScope.$digest();
    
    expect(datepicker.scope().calendarCursor.format('LLL')).toBe(moment.utc(new Date('2000-07-03')).format('LLL'));
    var selectedDateNode = angular.element(datepickerElement.getElementsByClassName('isSelected'));
    expect(selectedDateNode.html()).toBe('03');
  });
  
  it("updates the model on date select", function() {
   //given
    $scope.date = '2000-05-02';
    $scope.datepickerConfig = {
      dateFormat: 'YYYY-MM-DD'
    };
    compileDatepickerAndPrepareTest();
    
    //when
    input.triggerHandler('click');
    var dayNode = angular.element(datepickerElement.getElementsByClassName('day-item')[20]);
    var dayNodeDay = dayNode.html();
    dayNode.triggerHandler('click');
    $rootScope.$digest();
    
    //then
    expect($scope.date).toBe('2000-05-'+dayNodeDay);
  });
  
  function compileDatepickerAndPrepareTest(){
    datepickerContainer = $compile(datepickerHtml)($scope);
    $rootScope.$digest();
    
    input = datepickerContainer.find('input');
    datepickerElement = datepickerContainer[0].getElementsByClassName('ng-flat-datepicker')[0];
    datepicker = angular.element(datepickerElement);
  }
});