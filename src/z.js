'use strict';

/**
 * controllers
 */
angular.module('z.controllers', [])
  .controller('zStack', ['$scope',
    function ($scope) {}
  ])
  .controller('zLayer', ['$scope',
    function ($scope) {}
  ])
  .controller('zPane', ['$scope', '$element',
    function ($scope, $element) {

      this.$element = $element;
    }
  ]);


/**
 * directives
 */
angular.module('z.directives', [])
  .directive('zStack', [

    function () {
      return {
        restrict: 'A',
        controller: angular.noop,
        link: function (scope, el, attrs) {
          el.addClass('z-stack');
        }
      };
    }
  ])
  .directive('zLayer', [

    function () {
      return {
        restrict: 'A',
        require: '^zStack',
        controller: angular.noop,
        link: function (scope, el, attrs) {
          el.addClass('z-layer');
        }
      };
    }
  ])
  .directive('zPane', [

    function () {
      return {
        restrict: 'A',
        require: '^zLayer',
        controller: 'zPane',
        link: function (scope, el, attrs) {
          el.addClass('z-pane');
        }
      };
    }
  ])
  .directive('zPhase', [

    /**
     * z-phase is a simple state setter
     */

    function () {
      return {
        restrict: 'A',
        require: '^zPane',
        controller: angular.noop,
        link: function (scope, el, attrs, ctrl) {

          el.bind('click', function () {
            console.log(el);
            console.log(ctrl.$element);
          });


        }
      }
    }

  ]);

/**
 * angular-z
 */
angular.module('z', ['z.controllers', 'z.directives']);