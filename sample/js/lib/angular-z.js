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
  .directive('zPane', ['$filter',

    function ($filter) {
      return {
        restrict: 'A',
        require: '^zLayer',
        scope: {
          template: '@ngInclude'
        },
        controller: angular.noop,
        link: function (scope, el, attrs) {

          var zPaneName = $filter('zName')(scope.template);
          var zPaneNameAttr = $filter('zClassify')(['z', 'pane', 'name']);

          el.addClass('z-pane').attr(zPaneNameAttr, zPaneName);
          scope.zPaneEl = el;
        }
      };
    }
  ])
  .directive('zPhase', ['$filter',

    /**
     * z-phase is a simple state setter
     */
    function ($filter) {

      return {
        restrict: 'A',
        require: '^zPane',
        controller: angular.noop,
        scope: {
          zPhase: '@'
        },
        link: function (scope, el, attrs) {

          /**
           * zPhase change request
           */
          var zPhase = scope.zPhase;

          /**
           * zPhase setter
           */
          function setPhase() {
            var zLayer = scope.$parent;
            var zStack = zLayer.$parent;

            var zLayerEl = zLayer.zLayerEl;
            var zStackEl = zStack.zStackEl;

            var zPhaseCurrentAttr = $filter('zClassify')(['z', 'phase', 'pane', 'current']);
            var zPhaseCurrent = zStackEl.attr(zPhaseCurrentAttr);

            if (zPhaseCurrent !== zPhase) {
              zStackEl
                .removeClass($filter('zClassify')(['z', 'phase', 'pane', zPhaseCurrent]))
                .attr(zPhaseCurrentAttr, zPhase)
                .addClass($filter('zClassify')(['z', 'phase', 'pane', zPhase]));
            }
          }

          /**
           * zPhase change request binding
           */
          el.bind('click', setPhase);

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