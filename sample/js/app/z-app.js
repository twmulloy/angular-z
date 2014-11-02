'use strict';

angular.module('zApp.controllers', [])
  .controller('root', ['$scope',
    function ($scope) {
      console.log('root controller');
    }
  ]);

/**
 * angular-z sample application
 */
angular.module('zApp', [
  'ngRoute',
  'z',
  'zApp.controllers',
]).config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'html/stacks/root.html',
        controller: 'root'
      });
  }
]);