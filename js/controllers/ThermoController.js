var _ThermoCtrl = ionicApp.controller('ThermoCtrl', function($scope, settings, socket, logData, commWeb, $interval) 
{
	$scope.settings = settings;
	$scope.logData = logData;

	$scope.myui = {min: 0, max:20, value:0, lastValue:0, halfValue:10};
	$scope.thermo = {minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curTempSymbol:'C'};
	
	$scope.houseTH = [
		{id:0, sensorID:0, title:"Bedroom Temp", dirty:false, 
		minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curTempSymbol:'C', 
		timestamp:1445802480, heaterOn:false, acOn:false,  autoPilotOn:true, autoPilotEndProgTimeH:22, autoPilotEndProgTimeM:30},
		/*{id:1, sensorID:0, title:"Bedroom Temp", dirty:false, minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curTempSymbol:'C'},
	*/
	];
	
	$scope.textTimestamp = function textTimestamp(date)
	{
		var seconds = Math.floor(((new Date().getTime()/1000) - date)),
		interval = Math.floor(seconds / 31536000);

		if (interval > 1) return interval + "y";

		interval = Math.floor(seconds / 2592000);
		if (interval > 1) return interval + "m";

		interval = Math.floor(seconds / 86400);
		if (interval >= 1) return interval + "d";

		interval = Math.floor(seconds / 3600);
		if (interval >= 1) return interval + "h";

		interval = Math.floor(seconds / 60);
		if (interval > 1) return interval + "m ";

		return Math.floor(seconds) + "s";
	}
	
	$scope.addLog = function addLog(msg)
	{
		var date = new Date();
		
		$scope.logData.unshift({log:date.getHours() + ":" + ('0'+date.getMinutes()).slice(-2) + ":" + ('0'+date.getSeconds()).slice(-2) + " " + msg});
	}
	
	$scope.$on('$ionicView.afterEnter', function() 
	{  
		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwReplyTHs, 
			//onMessage
			onMessage:function (data) 
			{
				$scope.addLog("Msg cwReplyTHs: " + data);
				
				var numTHs;
				
				var curID = 0;
				
				var res = commWeb.skipInt(data);
				
				if(!res.err)
				{
					numTHs = res.result;
					
					$scope.houseTH = [];
					
					while(numTHs--)
					{
						var objTH={};
						objTH.id = curID++;
						
						res = commWeb.skipInt(res.str);
						if(res.err) return;
						
						objTH.sensorID = res.result;
						
						res = commWeb.skipString(res.str);
						if(res.err) return;
						
						objTH.title = res.result;
						
						objTH.dirty = false;
						
						objTH.minTemp = 16;
						
						objTH.maxTemp = 27;
						
						res = commWeb.skipFloat(res.str);
						if(res.err) return;
						
						objTH.curTemp = res.result;
						
						res = commWeb.skipFloat(res.str);
						if(res.err) return;
						
						objTH.curSensorTemp = res.result;
						
						res = commWeb.skipInt(res.str);
						if(res.err) return;
						
						if(res.result == 1)
							objTH.curTempSymbol = 'C';
						else
							objTH.curTempSymbol = 'F';
							
						objTH.timestamp = (new Date()).getTime();
							
						$scope.houseTH.push(objTH);
					}
				}				
			},
		});
		
		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwNotifyTHStatus, 
			//onMessage
			onMessage:function (data) 
			{
				$scope.addLog("Msg cwNotifyTHStatus: " + data);
			},
		});		
	
		socket.connectSocket();
		
		socket.send(commWeb.eCommWebMsgTYpes.cwGetTHs+";");
	});
	
	$scope.timeoutId = $interval( function() 
	{
		socket.send(commWeb.eCommWebMsgTYpes.cwGetTHs+";");
	}, 5000);
	
	$scope.getThermoSetTemp = function getThermoSetTemp(id)
	{
		return (Math.round( $scope.houseTH[id].curTemp * 10 ) / 10).toFixed(1) + '*' + $scope.thermo.curTempSymbol;
	}
	
	$scope.getThermoSensorTemp = function getThermoSetTemp(id)
	{
		return (Math.round( $scope.houseTH[id].curSensorTemp * 10 ) / 10).toFixed(1) + '*' + $scope.thermo.curTempSymbol;
	}
	
	$scope.getThermoHeaterActivity = function getThermoHeaterActivity(id)
	{
		if($scope.houseTH[id].acOn)
			return "cooling to"
		else if($scope.houseTH[id].heaterOn) 
			return "heating to";
		else return "maintaining";
	}

	$scope.getThermoAutoPilotDescr = function getThermoAutoPilotDescr(id)
	{	
		var descr = "off (manual)";
		
		if($scope.houseTH[id].autoPilotOn)
		{
			descr = $scope.getThermoHeaterActivity(id) + ' ' + 
						$scope.getThermoSetTemp(id) + " until " + 
						$scope.houseTH[id].autoPilotEndProgTimeH + ":" + $scope.houseTH[id].autoPilotEndProgTimeM;
		}
		
		return descr;
	}
	
	$scope.getThermoAutoPilotDescrSimple = function getThermoAutoPilotDescrSimple(id)
	{	
		if($scope.houseTH[id].autoPilotOn)
			return "autopilot";
		else
			return "manual";
	}
	
	$scope.sliderCallback = function sliderCallback(cbkSetTextValue, cbkSetColorValue, cbkSetColorTrack, cbkSetSliderValue)
	{
		$scope.cbkSetTextValue = cbkSetTextValue;
		$scope.cbkSetColorValue = cbkSetColorValue;
		$scope.cbkSetColorTrack = cbkSetColorTrack;
		$scope.cbkSetSliderValue = cbkSetSliderValue;
	}
	
	$scope.canTempUp = function canTempUp(id)
	{
		if($scope.houseTH[id].curTemp < $scope.houseTH[id].maxTemp)
			return true;
		else
			return false;
	}
	
	$scope.canTempDown = function canTempDown(id)
	{
		if($scope.houseTH[id].curTemp > $scope.houseTH[id].minTemp)
			return true;
		else
			return false;
	}
	
	$scope.doTempUp = function doTempUp(id)
	{
	
		if($scope.houseTH[id].curTemp < $scope.houseTH[id].maxTemp)
			$scope.houseTH[id].curTemp += 0.1;
	
		/*var val = $scope.houseTH[id].curTemp + 0.1;
		if(val > $scope.houseTH[id].maxTemp)
			val = $scope.myui.min;
		//$scope.onSlide(val);
		$scope.cbkSetSliderValue(val);
		*/
	}
	
	$scope.doTempDown = function doTempDown(id)
	{
		if($scope.houseTH[id].curTemp > $scope.houseTH[id].minTemp)
			$scope.houseTH[id].curTemp -= 0.1;
		
		/*var val = $scope.myui.lastValue - 1;
		if(val < $scope.myui.min)
			val = $scope.myui.max;
		//$scope.onSlide(val);
		$scope.cbkSetSliderValue(val);
		*/
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
});