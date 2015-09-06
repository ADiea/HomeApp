angular.module('ionicApp.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout) 
{

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


})
.controller('SettingsCtrl', function($scope, settings) 
{
	$scope.settings = settings;// = {serverIP : "192.168.0.6"};
})
.controller('FMRadioCtrl', function($scope, settings) 
{
	$scope.settings = settings;// = {serverIP : "192.168.0.6"};
	
	$scope.radioTitle = "Bathroom Radio";
})
.controller('ThermoCtrl', function($scope, settings) 
{
	$scope.settings = settings;

	$scope.myui = {min: 0, max:20, value:0, lastValue:0, halfValue:10};
	$scope.thermo = {minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curTempSymbol:'C'};
	
	$scope.getThermoSetTemp = function getThermoSetTemp()
	{
		return (Math.round( $scope.thermo.curTemp * 10 ) / 10).toFixed(1) + '*' + $scope.thermo.curTempSymbol;
	}
	
	$scope.getThermoSensorTemp = function getThermoSetTemp()
	{
		return (Math.round( $scope.thermo.curSensorTemp * 10 ) / 10).toFixed(1) + '*' + $scope.thermo.curTempSymbol;
	}	
	
	$scope.sliderCallback = function sliderCallback(cbkSetTextValue, cbkSetColorValue, cbkSetColorTrack, cbkSetSliderValue)
	{
		$scope.cbkSetTextValue = cbkSetTextValue;
		$scope.cbkSetColorValue = cbkSetColorValue;
		$scope.cbkSetColorTrack = cbkSetColorTrack;
		$scope.cbkSetSliderValue = cbkSetSliderValue;
	}
	
	$scope.doTempUp = function doTempUp()
	{
		var val = $scope.myui.lastValue + 1;
		if(val > $scope.myui.max)
			val = $scope.myui.min;
		//$scope.onSlide(val);
		$scope.cbkSetSliderValue(val);
	}
	
	$scope.doTempDown = function doTempDown()
	{
		var val = $scope.myui.lastValue - 1;
		if(val < $scope.myui.min)
			val = $scope.myui.max;
		//$scope.onSlide(val);
		$scope.cbkSetSliderValue(val);
	}

	$scope.lerp = function lerp(value, start_point, end_point)
	{
		return start_point + (end_point - start_point)*value;
	}

	$scope.onSliderMouseUp = function onSliderMouseUp()
	{
		if($scope.lockSlide === 'down' || $scope.lockSlide === 'up')
		{
			$scope.cbkSetSliderValue($scope.myui.lastValue);
			$scope.cbkSetColorTrack('#387ef5');
		}
	}

	$scope.onTrySlide = function onTrySlide (value)
	{
		var dif = value - $scope.myui.lastValue;
		
		if(dif > $scope.myui.halfValue)
			dif = -1;
		else if(dif < -$scope.myui.halfValue)
			dif = 1;
		
		if($scope.lockSlide === 'down' && (dif < 0))
		{
			var minVal = $scope.myui.lastValue - 1;
			if(minVal < $scope.myui.minValue)
				nimVal = $scope.myui.maxValue;
			
			if(value < minVal)
				return false;
		}
		else if($scope.lockSlide === 'up' && (dif > 0))
		{
			var maxVal = $scope.myui.lastValue + 1;
			if(maxVal > $scope.myui.maxValue)
				naxVal = $scope.myui.minValue;
			
			if(value > maxVal)
				return false;
		}
		
		return true;
	}

	$scope.onSlide = function onSlide (value) 
	{
		var dif = value - $scope.myui.lastValue;
		
		if(dif != 0)
		{
			if(dif > $scope.myui.halfValue)
				dif = -1;
			else if(dif < -$scope.myui.halfValue)
				dif = 1;
			
			$scope.thermo.curTemp += dif * 0.1;
			
			if($scope.thermo.curTemp > $scope.thermo.maxTemp )
			{
				$scope.thermo.curTemp = $scope.thermo.maxTemp;
				$scope.cbkSetColorTrack('#ff0000');
				
				$scope.lockSlide = 'up';
			}
			else if($scope.thermo.curTemp < $scope.thermo.minTemp )
			{
				$scope.thermo.curTemp = $scope.thermo.minTemp;
				$scope.cbkSetColorTrack('#FF0000');
				
				$scope.lockSlide = 'down';
			}
			else
			{
				$scope.cbkSetColorTrack('#387ef5');
				$scope.lockSlide = 'none';
				
				$scope.myui.lastValue = value;
				$scope.myui.val  = value;
				
				if(value % 2)
				{
				try
				{
					navigator.notification.vibrate(100);
					}
					catch(e)
					{}
				}
			}
		}
		
		var iniR = 0, iniG = 128, iniB = 255,
			midR =255, midG = 255, midB = 255,
			finR = 255, finG = 128, finB = 0;

		var interp = ($scope.thermo.curTemp -  $scope.thermo.minTemp) / ( $scope.thermo.maxTemp -  $scope.thermo.minTemp);
		
		var lertR, lerpG, lerpB;
		
		if(interp < 0.5)
		{
			lerpR = $scope.lerp(interp*2, iniR, midR);
			lerpG = $scope.lerp(interp*2, iniG, midG);
			lerpB = $scope.lerp(interp*2, iniB, midB);
		}
		else
		{
			lerpR = $scope.lerp((interp-0.5)*2, midR, finR);
			lerpG = $scope.lerp((interp-0.5)*2, midG, finG);
			lerpB = $scope.lerp((interp-0.5)*2, midB, finB);	
		}
		
		var color = "rgb(" + lerpR.toFixed(0) + 
						',' + lerpG.toFixed(0) +
						',' + lerpB.toFixed(0) + ')';
		$scope.cbkSetColorValue(color);
		
		$scope.cbkSetTextValue($scope.getThermoSetTemp());

	}


	$scope.onSlideEnd = function onSlideEnd(value) {
		console.log('on slide end  ' + value);
	}
})
.controller('LightsCtrl', function($scope, $ionicModal, $timeout) 
{
	$scope.houseLights = [
		{id:0, title:"Hall Ceiling", light:{enable:true, minDim:30, maxDim:100, curDim:60, minSpeed:1, maxSpeed:15, curSpeed:5}},
		{id:1, title:"Bath Ceiling", light:{enable:true, minDim:50, maxDim:100, curDim:50, minSpeed:1, maxSpeed:15, curSpeed:5}},
		{id:2, title:"Kitchen Ambient", light:{enable:true, minDim:0, maxDim:100, curDim:70, minSpeed:1, maxSpeed:15, curSpeed:5}}
	];
	
	

	$ionicModal.fromTemplateUrl('views/light_single.html', {scope: $scope}).then(
		function(modal) 
		{
			$scope.modal = modal;
		});

	// Triggered in the login modal to close it
	$scope.closeLight = function() 
	{
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.openLight = function(lightId) 
	{
		$scope.modalLight = $scope.houseLights[lightId];
		$scope.modal.show();
	};

	$scope.setLight = function() 
	{
		//$scope.houseLights[$scope.modalLight.id].light = $scope.modalLight.light;
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
		$scope.modalLight.light.curDim  = sliderObj.from; 
	}
	$scope.rangeFinishCallback_dim = function(sliderObj)
	{ 
		$scope.modalLight.light.curDim  = sliderObj.from; 
	}
	$scope.rangeChangeCallback_speed = function(sliderObj)
	{ 
		$scope.modalLight.light.curSpeed  = sliderObj.from; 
	}
	$scope.rangeFinishCallback_speed = function(sliderObj)
	{ 
		$scope.modalLight.light.curSpeed  = sliderObj.from;  
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
.controller('TestsCtrl', function($scope, $stateParams) 
{
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
