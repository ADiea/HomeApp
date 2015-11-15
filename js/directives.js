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
        index: '=',
		minWidth: '=',
		type: '@',
		refresh: '=',
		usefulLength: '='
      },
      templateUrl: 'lib/slider.html',
      compile: function(element) {
        var id = 'handle-' + Math.random();
        element.find('ion-scroll').attr('delegate-handle', id);
        return function(scope, element) {
          var _fixed = true,
            scrollHandle = $ionicScrollDelegate.$getByHandle(id);
			scope.touched = false;
          scope.itemHeight = scope.itemHeight || 50;
          scope.amplitude = scope.amplitude || 5;
		  
		  scope.options = scope.options || [];
		  
		  scope.index = scope.ngModel || -1;
		  
		  scope.minWidth = scope.minWidth ||35;
		  
		  scope.type = scope.type || 1;
		  
		  scope.usefulLength = scope.usefulLength || -1;

          var resize = function() {
            scrollHandle.scrollTo(0, (scope.index+1) * scope.itemHeight-scope.itemHeight/2);
          };
		  
		  scope.refresh = function refresh()
							{
								scope.index = scope.ngModel || 0;
								resize();
							};

          scope.onScroll = function(event, scrollTop) 
		  {
            scrollTop = Math.round(scrollTop);
            var height = scope.itemHeight,
              amplitude = scope.amplitude,
              remainder = (scrollTop  -height/2) % height ,
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
              index = Math.floor((scrollTop- scope.itemHeight/2)/ height) + 1;
            } else {
              distance = remainder;
              nearestPos = scrollTop - distance;
              index = Math.floor((scrollTop - scope.itemHeight/2)/ height);
            }
			
			var usedLength = scope.usefulLength > 0 ? scope.usefulLength : scope.options.length;
			
			if(index < 0)
			{
				index = 0;
				nearestPos = +scope.itemHeight/2;

			}
			else if(index >= usedLength && usedLength > 0)
			{
				index = usedLength-1;
				nearestPos = scope.itemHeight*(index)+ scope.itemHeight/2;

			}
			 
			if(scope.index != index)
			{
				
				
				scope.$apply(function() {
					scope.index = index;
				  });

				try
				{
					navigator.notification.vibrate(10);
				}
				catch(e)
				{}
			}
			 
			if (!scope.touched && !_fixed) 
			{
				if(nearestPos != scrollTop)
					scrollHandle.scrollTo(0, nearestPos);
				_fixed = true;
				scope.$apply(function() {
					scope.ngModel = scope.index;
				  });
			}
          };

          // Bind events
          angular.element($window).bind('resize', resize);

          var unWatchModel = scope.$watch('ngModel', function(newVal) {
            if (typeof newVal != 'undefined' && newVal != scope.index/*&& newVal.value*/) 
			{

			   scope.index = newVal;
			   //resize();
            }

          });
		  
		  var unWatchOptions = scope.$watch('options', function(newVal) {
            if (newVal) {

				//scope.options = newVal;
				
				var usedLength = scope.usefulLength > 0 ? scope.usefulLength : scope.options.length;
				
				if(usedLength > 0)
				{				
					if(scope.index >= usedLength)
					{
						scope.index = usedLength-1;
					}
					
					resize();
				}
			}

          });
		  
		  var unWatchUsedLength = scope.$watch('usefulLength', function(newVal) {
            if (newVal) {

				//scope.usefulLength = newVal;
				
				if(newVal > 0)
				{				
					if(scope.index >= newVal)
					{
						scope.index = newVal-1;
					}
					
					resize();
				}
			}

          });
		  
		  
          $ionicGesture.on('touch', function() {
            scope.touched = true;
            _fixed = false;
          }, element, {});

          $ionicGesture.on('release', function() {
            scope.touched = false;
          }, element, {});

          scope.$on('destroy', function() {
            // Unbind events
            $ionicGesture.off('touch', element);
            $ionicGesture.off('release', element);
            angular.element($window).off('resize', resize);
            unWatchModel();
			unWatchOptions();
			unWatchUsedLength();
          });

          // Resize on start
          resize();
        };

      },
    };
  });