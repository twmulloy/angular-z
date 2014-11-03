'use strict';

angular.module('zApp.controllers', [])
  .controller('root', ['$scope',
    function ($scope) {
      console.log('root controller');
    }
  ])
  .controller('checkout', ['$scope',
    function ($scope) {
      console.log('checkout controller');
    }
  ]);

/**
 * angular-z sample application
 */
angular.module('zApp', [
  'ngRoute',
  'z',
  'zApp.controllers',
]).config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'html/stacks/root.html',
        controller: 'root'
      })
      .when('/checkout', {
        templateUrl: 'html/stacks/checkout.html',
        controller: 'checkout'
      });

    $locationProvider.html5Mode(true);
  }
]);