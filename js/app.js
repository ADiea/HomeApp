// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ionicApp', ['ionic', 'ionicApp.controllers', 'angular.circular-slider'/*, 'ionRangeSlider'*/])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
   $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }

    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
  },101);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.tests', {
      url: '/house/tests',
      views: {
        'menuContent': {
          templateUrl: 'views/tests.html',
		  controller: 'TestsCtrl'
        }
      }
    })
  .state('app.settings', {
      url: '/house/settings',
      views: {
        'menuContent': {
          templateUrl: 'views/settings.html',
          controller: 'SettingsCtrl',
		  resolve: {
			  settings: function(SettingsService) {
				return SettingsService.getSettings()
				}
			}
        }
      }
    })
   .state('app.lights', {
      url: '/house/lights',
      views: {
        'menuContent': {
          templateUrl: 'views/lights.html',
          controller: 'LightsCtrl',
		  resolve: {
			  settings: function(SettingsService) {
				return SettingsService.getSettings()
				}
			}
        }
      }
    })
	.state('app.thermo', {
      url: '/house/thermo',
      views: {
        'menuContent': {
          templateUrl: 'views/thermo.html',
          controller: 'ThermoCtrl',
		  resolve: {
			  settings: function(SettingsService) {
				return SettingsService.getSettings()
				}
			}
        }
      }
	})
	 .state('app.house', {
      url: '/house',
      views: {
        'menuContent': {
          templateUrl: 'views/house.html',
          controller: 'AppCtrl',
		  resolve: {
			  settings: function(SettingsService) {
				return SettingsService.getSettings()
				}
			}
        }
      }
    })
	.state('app.fmradio', {
      url: '/house/fmradio',
      views: {
        'menuContent': {
          templateUrl: 'views/fmradio.html',
          controller: 'FMRadioCtrl',
		  resolve: {
			  settings: function(SettingsService) {
				return SettingsService.getSettings()
				}
			}
        }
      }
    });	

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/house');
})
.directive('ionslider',function($timeout){
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
            disable:'=',
            onChange:'=',
            onFinish:'='

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
                    onFinish:$scope.onFinish
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
            $scope.$watch('disable', function(value) {
                $timeout(function(){ $element.data("ionRangeSlider").update({disable: value}); });
            });
        }
    }
});
//.directive('circularSlider', circularSlider);
;
