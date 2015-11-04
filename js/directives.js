ionicApp.directive('ionslider',function($timeout){
    return{
        restrict:'E',
        scope:{min:'=',
            max:'=',
            type:'@',
            prefix:'@',
            maxPostfix:'@',
            prettify:'@',
            grid:'@',
            gridMargin:'@',
            postfix:'@',
            step:'@',
            hideMinMax:'@',
            hideFromTo:'@',
            from:'=',
			to:'=',
            disable:'=',
            onChange:'=',
            onFinish:'=',
			values:'=',

        },
        template:'<div></div>',
        replace:true,
        link:function($scope,$element,attrs){
            (function init(){
                $element.ionRangeSlider({
                    min: $scope.min,
                    max: $scope.max,
                    type: $scope.type,
                    prefix: $scope.prefix,
                    maxPostfix: $scope.maxPostfix,
                    prettify: $scope.prettify,
                    grid: $scope.grid,
                    gridMargin: $scope.gridMargin,
                    postfix:$scope.postfix,
                    step:$scope.step,
                    hideMinMax:$scope.hideMinMax,
                    hideFromTo:$scope.hideFromTo,
                    from:$scope.from,
                    disable:$scope.disable,
                    onChange:$scope.onChange,
                    onFinish:$scope.onFinish,
					to:$scope.to,
					values:$scope.values
					
                });

            })();
			
			
            $scope.$watch('min', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({min: value}); });
            },true);
            $scope.$watch('max', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({max: value}); });
            });
            $scope.$watch('from', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({from: value}); });
            });
			$scope.$watch('to', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({to: value}); });
            });
            $scope.$watch('disable', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({disable: value}); });
            });
        }
    }
});

ionicApp.directive('selectWheel', function($ionicScrollDelegate, $ionicGesture, $window, $timeout) {
    return {
      restrict: 'E',
      scope: {
        itemHeight: '@',
        amplitude: '@',
        ngModel: '=',
        options: '=',
        index: '='
      },
      templateUrl: 'lib/slider.html',
      compile: function(element) {
        var id = 'handle-' + Math.random();
        element.find('ion-scroll').attr('delegate-handle', id);
        return function(scope, element) {
          var _fixed = true,
            _touched = false,
            scrollHandle = $ionicScrollDelegate.$getByHandle(id);
          scope.itemHeight = scope.itemHeight || 50;
          scope.amplitude = scope.amplitude || 5;
          scope.index = 2;

          var resize = function() {
            scrollHandle.scrollTo(0, scope.index * scope.itemHeight);
          };

          scope.onScroll = function(event, scrollTop) {
            scrollTop = Math.round(scrollTop);
            var height = scope.itemHeight,
              amplitude = scope.amplitude,
              remainder = scrollTop % height,
              distance, nearestPos,
              middle = Math.floor(height / 2),
              index,
              minDist = middle - amplitude;

            /*
             Find the distance between the item and the center:
             So if the height of the item is 50, it finds the nearest
             integer for scrollTop to reach a multiple of 50
             160 = 3 * 50 + 10 => For 160, the distance is 10
             145 = 3 * 50 - 5 => For 145, the distance is 5
             */
            if (remainder > middle) {
              distance = height - remainder;
              nearestPos = scrollTop + distance;
              index = Math.floor(scrollTop / height) + 1;
            } else {
              distance = remainder;
              nearestPos = scrollTop - distance;
              index = Math.floor(scrollTop / height);
            }
            if (!_touched && !_fixed) {
              scrollHandle.scrollTo(0, nearestPos);
              _fixed = true;
              scope.index = index;
              scope.$apply(function() {
                scope.ngModel = scope.options[index].value;
              });
            }
			else
			{
			 scope.index = index;
			 scope.$apply(function() {
                scope.ngModel = scope.options[index].value;
              });
			}
          };

          // Bind events
          angular.element($window).bind('resize', resize);

          var unWatchModel = scope.$watch('ngModel', function(newVal) {
            if (newVal && newVal.value) {
              for (var i = 0, len = scope.options.length; i < len; ++i) {
                if (scope.options[i].value == scope.ngModel) {
                  scope.index = i;
                }
              }
            }

          });
          $ionicGesture.on('touch', function() {
            _touched = true;
            _fixed = false;
          }, element, {});

          $ionicGesture.on('release', function() {
            _touched = false;
          }, element, {});

          scope.$on('destroy', function() {
            // Unbind events
            $ionicGesture.off('touch', element);
            $ionicGesture.off('release', element);
            angular.element($window).off('resize', resize);
            unWatchModel();
          });

          // Resize on start
          resize();
        };

      },
    };
  });