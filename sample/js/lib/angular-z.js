'use strict';

/**
 * filters
 */
angular.module('z.filters', [])
  .filter('zClassify', [

    function () {
      return function (input) {
        return input.join('-');
      };
    }
  ])
  .filter('zName', [

    function () {
      return function (input) {

        if (!input) {
          return;
        }

        return input.replace(/(^\')?(\.\w+)?(\'$)?/g, '').split('/').reverse()[0];
      };
    }
  ]);

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

      var zNameClass = 'z-stack';

      return {
        restrict: 'A',
        controller: angular.noop,
        link: function (scope, el, attrs) {
          el.addClass(zNameClass);
          scope.zEl = el;
        }
      };
    }
  ])
  .directive('zLayer', ['$filter',

    function ($filter) {

      var zNameAttr = 'z-layer-name';
      var zNameClass = 'z-layer';

      return {
        restrict: 'A',
        require: '^zStack',
        scope: {
          template: '@ngInclude'
        },
        controller: angular.noop,
        link: function (scope, el, attrs) {
          var zName = $filter('zName')(scope.template);
          el.addClass(zNameClass).attr(zNameAttr, zName);
          scope.zEl = el;
        }
      };
    }
  ])
  .directive('zPane', ['$filter',

    function ($filter) {

      var zNameAttr = 'z-pane-name';
      var zNameClass = 'z-pane';

      return {
        restrict: 'A',
        require: '^zLayer',
        scope: {
          template: '@ngInclude'
        },
        controller: angular.noop,
        link: function (scope, el, attrs) {
          var zName = $filter('zName')(scope.template);
          el.addClass(zNameClass).attr(zNameAttr, zName);
          scope.zEl = el;
        }
      };
    }
  ])
  .directive('zPhase', ['$filter',

    function ($filter) {

      var currentPhaseAttr = 'z-current-phase';

      function getScopes(scope) {
        return {
          "pane": scope,
          "layer": scope.$parent,
          "stack": scope.$parent.$parent
        };
      }

      /**
       * get scoped elements
       */
      function getEls(scope) {
        var scopes = getScopes(scope);

        console.log("scopes", scopes);
        return {
          "pane": "",
          "layer": scopes.layer.zEl,
          "stack": scopes.stack.zEl
        };
      }

      /**
       * current phase checker
       */
      function currentPhase(scope) {
        var els = getEls(scope);
        return els.stack.attr(currentPhaseAttr);
      }

      /**
       * phase setter
       */
      function setPhase(scope) {

        var scopes = getScopes(scope);
        var els = getEls(scope);
        var fromPhase, toPhase;

        fromPhase = angular.bind(this, currentPhase, scope)();
        toPhase = scope.zPhase;

        if (!toPhase) {
          console.warn("no phase defined");
          return;
        }

        /**
         * Pane, Layer, Stack phases (dot notation)
         */
        var toPLS = toPhase.split('.').reverse();

        if (toPLS.length < 1) {
          console.log("no pane defined for `z-phase` attribute");
          return;
        }

        els.stack.attr(currentPhaseAttr, toPLS.join('.'));
      }

      return {
        restrict: 'A',
        require: '^zPane',
        controller: angular.noop,
        scope: {
          zPhase: '@'
        },
        link: function (scope, el, attrs) {

          /**
           * zPhase change request binding
           */
          el.bind('click', angular.bind(el, setPhase, scope, attrs));
        }
      };
    }

  ]);

/**
 * angular-z
 */
angular.module('z', [
  'z.controllers',
  'z.directives',
  'z.filters',
]);