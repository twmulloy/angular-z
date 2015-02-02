'use strict';


angular.module('zApp.templates', []);
angular.module('zApp.animations', []);
angular.module('zApp.filters', []);
angular.module('zApp.services', []);
angular.module('zApp.controllers', []);
angular.module('zApp.directives', []);

angular.module('zApp.controllers')
  .controller('root', ['$scope',
    function ($scope) {
      console.log('root controller');
    }
  ])

angular.module('zApp.controllers')
  .controller('users', ['$scope',
    function ($scope) {
      console.log('users controller');

      $scope.list = [{
        id: 1,
        name: "User 1"
      }, {
        id: 2,
        name: "User 2"
      }, {
        id: 3,
        name: "User 3"
      }, {
        id: 4,
        name: "User 4"
      }, {
        id: 5,
        name: "User 5"
      }];
    }
  ])

angular.module('zApp.controllers')
  .controller('pages', ['$scope',
    function ($scope) {
      console.log('pages controller');
    }
  ]);

/**
 * angular-z sample application
 */
angular.module('zApp', [
  'ngRoute',
  'ngAnimate',
  'z',
  'zApp.controllers',
]).config(['$routeProvider', '$locationProvider', 'zProvider',

  function ($routeProvider, $locationProvider, zProvider) {

    zProvider.config({
      'paneRootPath': 'html'
    });

    $routeProvider.when('/', {
      controller: 'root',
      templateUrl: '/html/stacks/default.html',
      resolve: {
        z: function () {
          return zProvider.setStack({
            defaultLayer: 'content',
            defaultPhase: 'yield'
          });
        }
      }
    }).when('/users/:uuid?', {
      controller: 'users',
      templateUrl: '/html/stacks/default.html',
      resolve: {
        z: function () {
          return zProvider.setStack({
            defaultLayer: 'navigation',
            defaultPhase: 'list',
            paneFills: ['list:users']
          });
        }
      }
    }).when('/pages', {
      controller: 'pages',
      templateUrl: '/html/stacks/default.html',
      resolve: {
        z: function () {
          return zProvider.setStack({
            defaultLayer: 'navigation',
            defaultPhase: 'list',
            paneFills: ['list:pages']
          });
        }
      }
    });
    $locationProvider.html5Mode(true);
  }
]);