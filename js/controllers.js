angular.module('ionicApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('views/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  

})

.controller('SettingsCtrl', function($scope, settings) {

$scope.settings = settings;// = {serverIP : "192.168.0.6"};

})
.controller('BlankCtrl', function($scope) {

})

.controller('LightCtrl', function($scope, $timeout, $ionicSideMenuDelegate) {

 $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
    });
  $scope.$on('$ionicView.leave', function(){
      $ionicSideMenuDelegate.canDragContent(true);
    });

$scope.data = {dimMax : 0};


    var timeoutId = null;
    
    $scope.$watch('data.dimMax', function() 
	{
        if(timeoutId !== null) {

            return;
        }

        timeoutId = $timeout( function() {
            
            console.log('Value:'+$scope.data.dimMax);
            
            $timeout.cancel(timeoutId);
            timeoutId = null;
            
            // Now load data from server 
        }, 300);  
    });



$scope.rangeChangeCallback = function(sliderObj)
{ $scope.data.dimMax  = sliderObj.from; 
//console.log('update:'+$scope.data.dimMax);
//$ionicSideMenuDelegate.canDragContent(false);
}
$scope.rangeFinishCallback = function(sliderObj)
{ 
$scope.data.dimMax = sliderObj.from; 
$scope.$apply();
//$ionicSideMenuDelegate.canDragContent(true);
}


$scope.model = {min:5, max:100, currentValue:50, disabled:false};

  $scope.toggleSettings = function() {
    if ($scope.isSettingsShown()) 
	{
      $scope.shownSettings = false;
    }
	else 
	{
      $scope.shownSettings = true;
    }
  };
  
  $scope.isSettingsShown = function() 
  {
	if($scope.shownSettings)
		return $scope.shownSettings;
	return false;
  };


})
.controller('TestsCtrl', function($scope, $stateParams) {

  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];

	$scope.moreInfo = "n/a";
// Fetch Device info from Device Plugin
	$scope.alertDeviceInfo = function() {
		$scope.moreInfo = ('Device Platform: ' + device.platform + '\n'
				+ 'Device Version: ' + device.version + '\n' + 'Device Model: '
				+ device.model + '\n' + 'Device UUID: ' + device.uuid + '\n');

		//navigator.notification.alert(deviceInfo);
	};

	// Fetch location info from GeoLocation Plugin
	$scope.alertGeoLocation = function() {
		var onSuccess = function(position) {
			$scope.moreInfo = 'Latitude: '
					+ position.coords.latitude + '\n' + 'Longitude: '
					+ position.coords.longitude + '\n' + 'Altitude: '
					+ position.coords.altitude + '\n' + 'Accuracy: '
					+ position.coords.accuracy + '\n' + 'Altitude Accuracy: '
					+ position.coords.altitudeAccuracy + '\n' + 'Heading: '
					+ position.coords.heading + '\n' + 'Timestamp: '
					+ position.timestamp + '\n';
		};
		var onFailure = function(err, msg) {
			$scope.moreInfo = 'Error: '
					+ err + '\n' + 'Err code: '
					+ err.code + '\n' + 'Msg: '
					+ msg + '\n' + 'Accuracy: '
					+ position.coords.accuracy + '\n';
		};
		$scope.moreInfo = "Location: (loading)";
		navigator.geolocation.getCurrentPosition(onSuccess, onFailure, { timeout: 15000, enableHighAccuracy: false });

	};

	// Makes a beep sound
	$scope.beepNotify = function() {
		navigator.notification.beep(1);
	};

	// Vibrates the phone
	$scope.vibrateNotify = function() {
		navigator.notification.vibrate(1000);
	};

})
.service('SettingsService', function($q) {
  return {
    settings:
      {
        serverIP: "192.168.0.3"
      }
    ,
    getSettings: function() {
      return this.settings
    }
  }
});
