angular.module('ionicApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

 
  

})

.controller('SettingsCtrl', function($scope, settings) {

$scope.settings = settings;// = {serverIP : "192.168.0.6"};

})

.controller('ThermoCtrl', function($scope, settings) {

$scope.settings = settings;

//$scope.value = 1;
//$scope.min = 0;
//$scope.max = 9;


$scope.myui = {min: 0, max:60, value:0, lastValue:0};
$scope.thermo = {minTemp:16.0, maxTemp:27.0, curTemp:21.0};

$scope.sliderCallback = function sliderCallback(cbkSetValue, cbkSetColor)
{
	$scope.cbkSetValue = cbkSetValue;
	$scope.cbkSetColor = cbkSetColor;
}

$scope.onSlide = function onSlide (value) 
{
	var dif = value - $scope.myui.lastValue;
	
	if(dif != 0)
	{
	
	if(dif > ($scope.myui.max - $scope.myui.min) / 2)
		dif = -1;
	else if(dif < -($scope.myui.max - $scope.myui.min) / 2)
		dif = 1;
	
	$scope.thermo.curTemp += dif * 0.1;
	
	if($scope.thermo.curTemp > $scope.thermo.maxTemp )
	{
		$scope.thermo.curTemp = $scope.thermo.maxTemp;
		$scope.cbkSetColor('', '#ff0000');
	}
	else if($scope.thermo.curTemp < $scope.thermo.minTemp )
	{
		$scope.thermo.curTemp = $scope.thermo.minTemp;
		$scope.cbkSetColor('', '#FF0000');
	}
	else
	{
		$scope.cbkSetColor('', '#dddddd');
	}
	
/*	
	function transition(value, maximum, start_point, end_point){
    return start_point + (end_point - start_point)*value/maximum;}
	
	var color = "rgb(" + transition(interp, 1, 0, 255) + ',0 ,' + transition(interp, 1, 255, 0) + ')';
*/
	
	$scope.cbkSetValue((Math.round( $scope.thermo.curTemp * 10 ) / 10).toFixed(1) + '*');
	
	var interp = ($scope.thermo.curTemp - $scope.thermo.minTemp) / ($scope.thermo.maxTemp - $scope.thermo.minTemp);
	
	
/*	
	if(dif > 0)
	{
		if(dif > ($scope.ui.max - $scope.ui.min) / 2)
		{
			dif = -1;
		}
	}
	else
	{
		if(dif < ($scope.ui.max - $scope.ui.min) / 2)
		{
			dif = 1;
		}
	}
*/	


		$scope.myui.lastValue = value;
		
		$scope.myui.val  = value;
		$scope.$apply();
		console.log('on slide  delta ' + dif);
	}
}


$scope.onSlideEnd = function onSlideEnd(value) {
	console.log('on slide end  ' + value);
}

})

.controller('LightsCtrl', function($scope, $ionicModal, $timeout) {


$scope.houseLights = [
	{id:0, title:"Hall Ceil", light:{enable:true, minDim:30, maxDim:100, curDim:0, minSpeed:1, maxSpeed:15, curSpeed:5}},
	{id:1, title:"Bath Ceil", light:{enable:true, minDim:50, maxDim:100, curDim:0, minSpeed:1, maxSpeed:15, curSpeed:5}},
	{id:2, title:"Kitchen Ambient", light:{enable:true, minDim:0, maxDim:100, curDim:0, minSpeed:1, maxSpeed:15, curSpeed:5}}
];

//$scope.modalLight = houseLights[0];

  $ionicModal.fromTemplateUrl('views/light_single.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLight = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openLight = function(light) {
	$scope.modalLight = light;
    $scope.modal.show();
  };
  
  $scope.setLight = function() {
	
	$scope.houseLights[$scope.modalLight.id] = $scope.modalLight;

	$scope.closeLight();
  };

/*
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
*/	


$scope.rangeChangeCallback_dim = function(sliderObj)
{ 
//$scope.data.dimMax  = sliderObj.from; 
//console.log('update:'+$scope.data.dimMax);

}
$scope.rangeFinishCallback_dim = function(sliderObj)
{ 
//$scope.data.dimMax = sliderObj.from; 
//$scope.$apply();

}

$scope.rangeChangeCallback_speed = function(sliderObj)
{ 
//$scope.data.dimMax  = sliderObj.from; 
//console.log('update:'+$scope.data.dimMax);

}
$scope.rangeFinishCallback_speed = function(sliderObj)
{ 
//$scope.data.dimMax = sliderObj.from; 
//$scope.$apply();

}


/*accordion*/
/*
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
*/

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
        serverIP: "192.168.0.101"
      }
    ,
    getSettings: function() {
      return this.settings
    }
  }
});
