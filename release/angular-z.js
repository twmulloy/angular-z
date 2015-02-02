angular.module('z.filters', []).filter('zClassify', [

  function () {
    return function (input) {
      return input.join('-');
    };
  }
]).filter('zName', [

  function () {
    return function (input) {
      return input.replace(/(^\'|\_)?(\.\w+)?(\'$)?/g, '').split('/').reverse()[0];
    };
  }
]).filter('zFindBy', [

  function () {
    return function (input, value, prop) {
      var i, len;
      if (prop == null) {
        prop = 'name';
      }
      len = input.length;
      i = 0;
      while (i < len) {
        if (input[i][prop] === value) {
          return input[i];
        }
        i++;
      }
      return null;
    };
  }
]).filter('zPaneFill', [

  function () {
    return function (input, paneName) {
      var i, len, paneFill;
      if (!input) {
        return;
      }
      len = input.length;
      i = 0;
      while (i < len) {
        paneFill = input[i].split(':');
        if (paneFill[0] === paneName) {
          return paneFill[1];
        }
        i++;
      }
      return null;
    };
  }
]);

angular.module('z.animations', []);

angular.module('z.services', []).provider('z', [

  function () {
    var currentStack;

    currentStack = {
      name: 'default',
      paneRootPath: '',
    };

    return {
      config: function (configs) {
        angular.extend(currentStack, configs);
        return currentStack;
      },
      setStack: function (stack) {
        return angular.extend(currentStack, stack);
      },
      $get: function () {
        return currentStack;
      }
    };
  }
]).factory('zPhases', [

  function () {
    var phases;
    phases = [];
    return function () {
      return {
        add: function (phase) {
          return phases.push(phase);
        },
        history: phases
      };
    };
  }
]);

angular.module('z.controllers', []);

angular.module('z.directives', []).directive('zStack', [
  '$rootScope', '$filter',
  function ($rootScope, $filter) {
    var zNameAttr, zNameClass;
    zNameAttr = 'z-stack-name';
    zNameClass = 'z-stack';
    return {
      restrict: 'A',
      controller: [
        'z',
        function (z) {
          this.stack = z;
          if ($rootScope.currentZPhase) {
            console.log("set current phase first", $rootScope.currentZPhase);
          }
        }
      ],
      link: function (scope, el, attrs, controller) {
        var zName;
        zName = controller.stack.name;
        el.addClass(zNameClass).attr(zNameAttr, zName);
        if (!el.attr('id')) {
          el.attr('id', $filter('zClassify')([zNameClass, zName]));
        }
        scope.zEl = el;
      }
    };
  }
]).directive('zLayer', [
  '$filter',
  function ($filter) {
    var zNameAttr, zNameClass;
    zNameAttr = 'z-layer-name';
    zNameClass = 'z-layer';
    return {
      restrict: 'A',
      require: '^zStack',
      scope: {
        template: '@ngInclude'
      },
      controller: angular.noop,
      link: function (scope, el, attrs) {
        var zName;
        zName = $filter('zName')(scope.template);
        el.addClass(zNameClass).attr(zNameAttr, zName);
        if (!el.attr('id')) {
          el.attr('id', $filter('zClassify')([zNameClass, zName]));
        }
        scope.zEl = el;
      }
    };
  }
]).directive('zPane', [
  '$rootScope', '$filter', '$http', '$templateCache', '$controller', '$compile',
  function ($rootScope, $filter, $http, $templateCache, $controller, $compile) {
    var zNameAttr, zNameClass;
    zNameAttr = 'z-pane-name';
    zNameClass = 'z-pane';
    return {
      restrict: 'A',
      require: '^zLayer',
      scope: {
        template: '@ngInclude',
        zPaneName: '@zPane'
      },
      controller: angular.noop,
      link: function (scope, el, attrs, controller) {
        var zName;
        if (attrs.zPane && attrs.zPane !== zNameClass) {
          zName = attrs.zPane;
        } else if (scope.template) {
          zName = $filter('zName')(scope.template);
        } else {
          return console.warn("no z-name");
        }
        el.addClass(zNameClass).attr(zNameAttr, zName);
        if (!el.attr('id')) {
          el.attr('id', $filter('zClassify')([zNameClass, zName]));
        }
        if (!scope.hasOwnProperty('template')) {
          scope.$on('loadPaneFill', function (event, pane) {
            $http.get(pane.rootPath + "/panes/_" + pane.fill + ".html", {
              cache: $templateCache
            }).then(function (resp) {
              var templateController, templateScope;
              templateScope = scope;
              templateController = $controller(pane.fill, {
                $scope: templateScope
              });
              el.html(resp.data);
              el.children().data('$ngControllerController', templateController);
              $compile(el.contents())(templateScope);
            });
          });
        }
        scope.zEl = el;
      }
    };
  }
]).directive('zPhase', [
  'z', 'zPhases', '$filter', '$document', '$animate', '$rootScope',
  function (z, zPhases, $filter, $document, $animate, $rootScope) {
    var fillPane, move, paneDimensions, phases, revealPane, sameStackMovement, setPhase, stackFromPhase, stackLayerPane;
    phases = new zPhases;
    stackLayerPane = function (phase) {
      var sLP;
      sLP = (phase ? phase.split('.') : []);
      if (sLP.length !== 3) {
        return console.warn("incorrectly formatted stack.layer.pane");
      }
      return {
        stack: sLP[0],
        layer: sLP[1],
        pane: sLP[2],
        paneFills: z.paneFills
      };
    };
    setPhase = function (scope, attrs, e) {
      var fromPhase, phasesLength, toPhase;
      phasesLength = phases.history.length;
      fromPhase = (phasesLength > 0 ? phases.history[phasesLength - 1] : null);
      toPhase = attrs.zPhase;
      if (attrs.zPhaseRevert && (fromPhase === toPhase)) {
        toPhase = attrs.zPhaseRevert;
      }
      return move(fromPhase, toPhase);
    };
    paneDimensions = function (parentLayer, pane) {
      var h, l, lH, lW, lX1, lY1, p, w, x1, y1;
      l = parentLayer.el[0];
      lH = l.offsetHeight;
      lW = l.offsetWidth;
      lX1 = l.offsetLeft;
      lY1 = l.offsetTop;
      p = pane.el[0];
      h = p.offsetHeight;
      w = p.offsetWidth;
      x1 = p.offsetLeft;
      y1 = p.offsetTop;
      return {
        h: h,
        w: w,
        x1: x1,
        y1: y1,
        x2: x1 + w,
        y2: y1 + h,
        mY: h / 2,
        mX: w / 2,
        fH: lH === h,
        fW: lW === w,
        parentLayer: {
          h: lH,
          w: lW,
          x1: lX1,
          y1: lY1,
          mY: lH / 2,
          mX: lW / 2
        }
      };
    };
    revealPane = function (paneD) {
      var fromLeft, fromTop;
      fromTop = paneD.y2;
      fromLeft = paneD.x2;
      if ((paneD.x1 + paneD.mX) > paneD.parentLayer.mX) {
        fromLeft = -(paneD.parentLayer.w - paneD.x1);
      }
      if ((paneD.y1 + paneD.mY) > paneD.parentLayer.mY) {
        fromTop = -(paneD.parentLayer.h - paneD.y1);
      }
      if (paneD.fH) {
        fromTop = 0;
      }
      if (paneD.fW) {
        fromLeft = 0;
      }
      return {
        top: fromTop,
        left: fromLeft
      };
    };
    sameStackMovement = function (fromStack, toStack) {
      var direction, fromLayer, layers, move, toLayer, toPane, toPaneD;
      layers = toStack.stack.layers;
      fromLayer = $filter('zFindBy')(layers, fromStack.slp.layer);
      toLayer = $filter('zFindBy')(layers, toStack.slp.layer);
      toPane = $filter('zFindBy')(toLayer.panes, toStack.slp.pane);
      toPaneD = paneDimensions(toLayer, toPane);
      move = revealPane(toPaneD);
      direction = toLayer.zIndex - fromLayer.zIndex;
      if (direction < 0) {
        layers = layers.reverse();
      }
      angular.forEach(layers, function (layer, i) {
        if (layer.el.hasClass('omit')) {
          return;
        }
        if (layer.zIndex <= toLayer.zIndex) {
          return layer.el.css('transform', "translate3d(0,0,0)");
        } else {
          return layer.el.css('transform', "translate3d(" + move.left + "px, " + move.top + "px, 0)");
        }
      });
      return move;
    };
    move = function (fromPhase, toPhase) {
      var fromStack, toStack;
      fromStack = stackFromPhase(fromPhase);
      toStack = stackFromPhase(toPhase);
      if (!fromStack) {
        return console.error("stack not registered");
      }
      if (fromPhase === toPhase) {
        return;
      }
      $rootScope.$apply(function (scope) {
        console.log("zPhase changed:", toPhase);
        return scope.currentZPhase = toPhase;
      });
      if (angular.equals(fromStack.stack, toStack.stack)) {
        sameStackMovement(fromStack, toStack);
      } else {
        console.log("different ballstacks");
      }
      return phases.add(toPhase);
    };
    fillPane = function (pane) {
      return pane.scope.$broadcast('loadPaneFill', pane);
    };
    stackFromPhase = function (phase) {
      var slp, stack, stackEl, stackLayerEls;
      stackEl = $document[0].querySelector("[z-stack]");
      stackEl = angular.element(stackEl);
      if (!phase) {
        phase = [z.name, z.defaultLayer, z.defaultPhase].join('.');
      }
      slp = stackLayerPane(phase);
      if (!slp) {
        return;
      }
      stack = {
        type: 'stack',
        name: slp.stack,
        el: stackEl,
        scope: stackEl.data('$scope'),
        layers: [],
        z: z,
      };
      stackLayerEls = stackEl.children('[z-layer]');
      angular.forEach(stackLayerEls, function (stackLayerEl, layerIndex) {
        var layerPaneEls;
        stackLayerEl = angular.element(stackLayerEl);
        this.layers[layerIndex] = {
          type: 'layer',
          name: stackLayerEl.attr('z-layer-name'),
          el: stackLayerEl,
          scope: stackLayerEl.data('$scope'),
          zIndex: layerIndex,
          panes: []
        };
        layerPaneEls = stackLayerEl.children('[z-pane]');
        return angular.forEach(layerPaneEls, function (layerPaneEl, paneIndex) {
          var paneName;
          layerPaneEl = angular.element(layerPaneEl);
          paneName = layerPaneEl.attr('z-pane-name');
          this.panes[paneIndex] = {
            type: 'pane',
            name: paneName,
            el: layerPaneEl,
            scope: layerPaneEl.data('$scope'),
            fill: $filter('zPaneFill')(slp.paneFills, paneName),
            rootPath: stack.z.paneRootPath,
          };
          if (this.panes[paneIndex].fill) {
            return fillPane(this.panes[paneIndex]);
          }
        }, this.layers[layerIndex]);
      }, stack);
      return {
        phase: phase,
        slp: slp,
        stack: stack
      };
    };
    return {
      restrict: 'A',
      require: '^zPane',
      controller: angular.noop,
      scope: {
        zPhase: '@'
      },
      link: function (scope, el, attrs) {
        el.bind('click', angular.bind(el, setPhase, scope, attrs));
      }
    };
  }
]);

angular.module('z', ['ngRoute', 'ngAnimate', 'z.animations', 'z.filters', 'z.services', 'z.controllers', 'z.directives']);