'use strict';

/**
 * register modules
 */
angular.module('z.controllers', []);
angular.module('z.directives', []);
angular.module('z.filters', []);

/**
 * controllers
 */
angular.module('z.controllers').controller('zC', ['$scope',
  function ($scope) {

  }
]);

/**
 * directives
 */
angular.module('z.directives').directive('z', [

  function () {
    return {
      restrict: 'E',
      controller: 'zC'
    };
  }
]);

/**
 * angular-z
 */
angular.module('z', ['z.controllers', 'z.directives', 'z.filters']);