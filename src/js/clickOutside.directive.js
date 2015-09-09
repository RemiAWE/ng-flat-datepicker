(function() {

    'use strict';

    /**
     * @desc ClickOutside directive: Resolve expression when a click outside an element is fired
     * @example <div clickOutside="fn()"></div>
     */

    angular
        .module('ngDatepicker')
        .directive('outsideClick', clickOutside);

    function clickOutside () {
        return {
            link: function(scope, element, attrs) {

                
                // var closest = function(el, fn) {
                //     return el && (fn(el) ? el : closest(el.parentNode, fn));
                // };
                //
                // $document.bind('click', function(event) {
                //     var elem;
                //     elem = closest(event.target, function(el) {
                //         return el.isSameNode($element[0]);
                //     });
                //     if (!elem) { $scope.$apply($attributes.outsideClick); }
                // });
            }
        };
    }

})();
