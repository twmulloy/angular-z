'use strict';

/**
 * controllers
 */
angular.module('z.controllers', []);

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
          scope.zStackEl = el;
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
          scope.zLayerEl = el;
        }
      };
    }
  ])
  .directive('zPane', [

    function () {
      return {
        restrict: 'A',
        require: '^zLayer',
        controller: angular.noop,
        link: function (scope, el, attrs) {
          el.addClass('z-pane');
          scope.zPaneEl = el;
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
        link: function (scope, el, attrs) {

          el.bind('click', function () {
            console.log(scope.$parent.$parent.zStackEl.children());
          });

        }
      };
    }

  ]);

/**
 * angular-z
 */
angular.module('z', ['z.controllers', 'z.directives']);