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
	
	$scope.radioOn = true;
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
				
				try
				{
					navigator.notification.vibrate(20);
				}
				catch(e)
				{}

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
.controller('LightsCtrl', function($scope, $ionicModal, $interval) 
{
	$scope.houseLights = [
		{id:0, title:"Hall Ceiling", light:{enable:true, dirty:false,
											params:[{id:0, toggled:false, name:"Inty", title:"Intensity", min:30, max:90, cur:60, step:1},
													{id:1, toggled:false, name:"Speed", title:"FadeSpeed", min:1, max:15, cur:5, step:1},
													{id:2, toggled:false, name:"OnTime", title:"OnTime", min:4, max:956, cur:4, step:4},
													{id:3, toggled:false, name:"MinInty", title:"MinIntensity", min:10, max:50, cur:30, step:1}]}},
															
		{id:1, title:"Bath Ceiling", light:{enable:true, dirty:false,
											params:[{id:0, toggled:false, name:"Inty", title:"Intensity", min:10, max:100, cur:20, step:1},
													{id:1, toggled:false, name:"Speed", title:"FadeSpeed", min:1, max:15, cur:5, step:1},
													{id:2, toggled:false, name:"OnTime", title:"OnTime", min:4, max:956, cur:4, step:4},
													{id:3, toggled:false, name:"MinInty", title:"MinIntensity", min:10, max:50, cur:30, step:1}]}},
															
		{id:2, title:"Kitchen Ambient", light:{enable:true, dirty:false,
											params:[{id:0, toggled:false, name:"Inty", title:"Intensity", min:0, max:5, cur:2, step:1},
													{id:1, toggled:false, name:"Speed", title:"FadeSpeed", min:1, max:15, cur:5, step:1},
													{id:2, toggled:false, name:"OnTime", title:"OnTime", min:4, max:956, cur:4, step:4},
													{id:3, toggled:false, name:"MinInty", title:"MinIntensity", min:10, max:50, cur:30, step:1}]}},
	];
	
	$scope.serverAnswer = "notStarted";
	
	$scope.sendToServer = function sendToServer()
	{
			//$scope.houseLights[$scope.modalLight.id].light = $scope.modalLight.light;
		$scope.serverAnswer = "Sent!";
		//$scope.closeLight();
	}

	$ionicModal.fromTemplateUrl('views/light_single.html', {scope: $scope}).then(
		function(modal) 
		{
			$scope.modal = modal;
		});

	// Triggered in the login modal to close it
	$scope.closeLight = function closeLight() 
	{
		$scope.modal.hide();
		
		/*
		$timeout.cancel($scope.timeoutId);
		$scope.timeoutId = null;*/
	};

	$scope.serverSequence = 0;

	// Open the login modal
	$scope.openLight = function openLight(lightId) 
	{
		$scope.modalLight = $scope.houseLights[lightId];
		$scope.modal.show();
		
	/*	$scope.timeoutId = $interval( function() 
		{
			$scope.serverSequence++;
			if($scope.modalLight.dirty)
			{
				$scope.modalLight.dirty = false;
				$scope.serverAnswer = $scope.serverSequence + "_Sending...";

			}
			else
			{
				$scope.serverAnswer = $scope.serverSequence+"_WaitForInput";
			}
		}, 1000);*/
	};

	$scope.timeoutId = null;


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


	$scope.rangeChangeCallback = function rangeChangeCallback(sliderObj)
	{ 
		$scope.modalLight.light.params[parseInt(sliderObj.input[0].id)].cur  = sliderObj.from;
		$scope.modalLight.dirty = true;
	}

	$scope.rangeChangeCallbackFinish = function rangeChangeCallback(sliderObj)
	{ 
		$scope.rangeChangeCallback(sliderObj);
		$scope.$apply();
	}
	
	$scope.doUp = function doUp(id)
	{
		var delta = Math.round(($scope.modalLight.light.params[id].max - $scope.modalLight.light.params[id].min)/10);

		$scope.modalLight.light.params[id].cur  += delta;
		
		if($scope.modalLight.light.params[id].cur > $scope.modalLight.light.params[id].max)
			$scope.modalLight.light.params[id].cur = $scope.modalLight.light.params[id].max;
	}
	
	$scope.doDown = function doDown(id)
	{
		var delta = Math.round(($scope.modalLight.light.params[id].max - $scope.modalLight.light.params[id].min)/10);

		$scope.modalLight.light.params[id].cur -= delta;
		if($scope.modalLight.light.params[id].cur < $scope.modalLight.light.params[id].min)
			$scope.modalLight.light.params[id].cur = $scope.modalLight.light.params[id].min;
	}



	/*accordion*/
	  $scope.toggleSettings = function toggleSettings(id) {
		if ($scope.isSettingsShown(id)) 
		  $scope.modalLight.light.params[id].toggle = false;
		else 
		  $scope.modalLight.light.params[id].toggle = true;
	  };
	  
	  $scope.isSettingsShown = function isSettingsShown(id) 
	  {
		if($scope.modalLight.light.params[id].toggle)
			return $scope.modalLight.light.params[id].toggle;
		return false;
	  };
	  


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
