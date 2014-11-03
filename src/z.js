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
  .controller('zPane', ['$scope',
    function ($scope) {}
  ]);

/**
 * directives
 */
angular.module('z.directives', [])
  .directive('zStack', [

    function () {
      return {
        restrict: 'A',
        controller: 'zStack',
        compile: function () {
          return {
            pre: function (scope, el, attrs) {
              el.addClass('z-stack');
            },
            post: function (scope, el, attrs) {}
          };
        }
      };
    }
  ])
  .directive('zLayer', [

    function () {
      return {
        restrict: 'A',
        controller: 'zLayer',
        compile: function () {
          return {
            pre: function (scope, el, attrs) {
              el.addClass('z-layer');
            },
            post: function (scope, el, attrs) {}
          };
        }
      };
    }
  ])
  .directive('zPane', [

    function () {
      return {
        restrict: 'A',
        controller: 'zPane',
        compile: function () {
          return {
            pre: function (scope, el, attrs) {
              el.addClass('z-pane');
            },
            post: function (scope, el, attrs) {}
          };
        }
      };
    }
  ]);

/**
 * angular-z
 */
angular.module('z', ['z.controllers', 'z.directives']);