// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var ionicApp = angular.module('ionicApp', ['ionic', 'angular.circular-slider'])

.run(function($rootScope, $ionicPlatform, $ionicHistory, SettingsService) {
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
      //$ionicPlatform.exitApp();
	  navigator.app.exitApp();
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
  
  var sets = SettingsService.get('settings');
  if(null == sets)
  {
	sets = {
			settingsVersion:1,
			serverURL : "ws://192.168.0.103",
			houseHoliday:false,
			houseHolidayEnd:1447910991,
			houseHolidayTemperature:18.0,
			houseHolidayMinTemperature:16.0,
			houseHolidayMaxTemperature:27.0
			};
	SettingsService.persist('settings', sets);
  }
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
				return SettingsService;
				}
			}
        }
      }
    })
  .state('app.log', {
      url: '/house/log',
      views: {
        'menuContent': {
          templateUrl: 'views/log.html',
          controller: 'LogCtrl',
		  resolve: {
			  logData: function(LogDataService) {
				return LogDataService.getLogData()
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
				return SettingsService;
				},
				logData: function(LogDataService) {
				return LogDataService.getLogData()
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
				return SettingsService;
				},
				logData: function(LogDataService) {
				return LogDataService.getLogData();
				},
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
				return SettingsService;
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
				return SettingsService;
				}
			}
        }
      }
    });	

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/house');
});

;
