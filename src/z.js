'use strict';

/**
 * controllers
 */
angular.module('z.controllers', [])
  .controller('zStack', ['$scope',
    function ($scope) {
      console.log("z stack");
    }
  ])
  .controller('zLayer', ['$scope',
    function ($scope) {
      console.log("z layer");


    }
  ])
  .controller('zPane', ['$scope',
    function ($scope) {
      console.log("z pane");
    }
  ]);

/**
 * directives
 */
angular.module('z.directives', [])
  .directive('zStack', [

    function () {
      return {
        restrict: 'E',
        replace: true,
        controller: 'zStack',
        template: '<div/>',
      };
    }
  ])
  .directive('zLayer', [

    function () {
      return {
        restrict: 'E',
        replace: true,
        controller: 'zLayer',
        template: '<div/>',
        link: function (scope, element, attributes) {
          console.log(element);
        }
      };
    }
  ])
  .directive('zPane', [

    function () {
      return {
        restrict: 'E',
        replace: true,
        controller: 'zPane'
      };
    }
  ]);

/**
 * angular-z
 */
angular.module('z', ['z.controllers', 'z.directives']);