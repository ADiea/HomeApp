var _ThermoCtrl = ionicApp.controller('ThermoCtrl', function($scope, settings, socket, logData, commWeb, $interval, $timeout, $ionicPopup) 
{
	$scope.settings = settings.get('settings');
	$scope.logData = logData;

	$scope.arrayTempSlider=['Off', 'On', 'Auto'];
	$scope.myui = {min: 0, max:20, value:0, lastValue:0, halfValue:10};
	$scope.thermo = {minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curTempSymbol:'C'};
	
	$scope.houseTH = [
		{id:0, sensorID:0, title:"Dormitor", dirty:false, 
		minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:45.2, 
		timestamp:1445802480, heaterOn:false, acOn:false,  autoPilotOn:true, autoPilotEndProgTimeH:-1, autoPilotEndProgTimeM:-1,
		ui:{index:2}},
		
		{id:1, sensorID:0, title:"Living", dirty:false, 
		minTemp:16.0, maxTemp:27.0, curTemp:18.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:30.2, 
		timestamp:1445802480, heaterOn:false, acOn:true,  autoPilotOn:true, autoPilotEndProgTimeH:-1, autoPilotEndProgTimeM:-1,
		ui:{index:5}},
		
		{id:2, sensorID:0, title:"Baie", dirty:false, 
		minTemp:16.0, maxTemp:27.0, curTemp:19.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:73.2, 
		timestamp:1445802480, heaterOn:true, acOn:false,  autoPilotOn:true, autoPilotEndProgTimeH:22, autoPilotEndProgTimeM:30,
		ui:{index:7}},
	];
	
	
	$scope.houseHeat = [
		{id:0, sensorID:0, title:"Centrala_1", dirty:false, 
		lowGasLevThres:300, medGasLevThres:500, highGasLevThres:700, 
		lastGasReading:350, heaterOn:true, heaterFault:false, heaterFaultDescr:"",
		timestamp:1445802480},
		
		{id:1, sensorID:0, title:"Centrala_2", dirty:false, 
		lowGasLevThres:300, medGasLevThres:500, highGasLevThres:700, 
		lastGasReading:350, heaterOn:false, heaterFault:true, heaterFaultDescr:"GasLeak",
		timestamp:1445802480},
	];

	$scope.$on('$ionicView.beforeEnter', function() 
	{  
		$timeout(function(){
		$scope.settings = settings.get('settings');});
	});
	
	$scope.showHolidayConfirm = function() {
	   var confirmPopup = $ionicPopup.confirm({
		 title: 'Modul Vacanta activ',
		 template: 'Parasiti modul vacanta?'
	   });
	   confirmPopup.then(function(res) {
		 if(res) 
		 {
			$scope.settings.houseHoliday = false;
		 } 
	   });
	 };
	
	$scope.$on('$ionicView.afterEnter', function() 
	{  
		$scope.uiOpenedTH = -1;
		$scope.uiOpenedHeater = -1;
		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwReplyDevicesOfType, 
			//onMessage
			onMessage:function (data) 
			{
				$scope.addLog("Msg cwReplyTHs: " + data);
				
				var numTHs;
				
				var devType;
				
				var curID = 0;
				
				var res = commWeb.skipInt(data);
				
				if(!res.err)
				{
					devType = res.result;
					
					if(devType == commWeb.eDeviceTypes.devTypeTH)
					{
					
						res = commWeb.skipInt(res.str);
						if(res.err) return;
						
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
							
							res = commWeb.skipInt(res.str);
							if(res.err) return;
							
							objTH.autoPilotOn = res.result ? true : false;
							
							res = commWeb.skipInt(res.str);
							if(res.err) return;
							
							objTH.heaterOn = res.result ? true : false;
							
							res = commWeb.skipInt(res.str);
							if(res.err) return;
							
							objTH.acOn = res.result ? true : false;
							
							res = commWeb.skipFloat(res.str);
							if(res.err) return;
							objTH.minTemp = res.result;
							
							res = commWeb.skipFloat(res.str);
							if(res.err) return;
							objTH.maxTemp = res.result;
							
							res = commWeb.skipFloat(res.str);
							if(res.err) return;
							objTH.curSensorHumid = res.result;
													
							
							objTH.autoPilotEndProgTimeH = -1;
							objTH.autoPilotEndProgTimeM = -1;
								
							$scope.houseTH.push(objTH);
						}
					}
					else if(devType == commWeb.eDeviceTypes.devTypeHeater)
					{
					/*
					{id:0, sensorID:0, title:"Centrala", dirty:false, 
		lowGasLevThres:300, medGasLevThres:500, highGasLevThres:700, 
		lastGasReading:350, heaterOn:true, heaterFault:false, heaterFaultDescr:""
		timestamp:1445802480},
					*/
						var objHeater={};
						objHeater.id = curID++;

						res = commWeb.skipInt(res.str);
						if(res.err) return;

						objHeater.sensorID = res.result;

						res = commWeb.skipString(res.str);
						if(res.err) return;

						objHeater.title = res.result;

						objHeater.dirty = false;

						res = commWeb.skipInt(res.str);
						if(res.err) return;

						objHeater.heaterOn = res.result ? true : false;

						res = commWeb.skipInt(res.str);
						if(res.err) return;

						objHeater.heaterFault = res.result ? true : false;
						
						res = commWeb.skipInt(res.str);
						if(res.err) return;

						objHeater.lastGasReading = res.result;
						
						res = commWeb.skipInt(res.str);
						if(res.err) return;

						objHeater.lowGasLevThres = res.result;
						
						res = commWeb.skipInt(res.str);
						if(res.err) return;

						objHeater.medGasLevThres = res.result;
						
						res = commWeb.skipInt(res.str);
						if(res.err) return;

						objHeater.highGasLevThres = res.result;
						
						res = commWeb.skipInt(res.str);
						if(res.err) return;

						if( res.result & 1)
							objHeater.heaterFaultDescr = "NoFault";
						if( res.result & 2)
							objHeater.heaterFaultDescr = "GasLeak";
						if( res.result & 4)
							objHeater.heaterFaultDescr = "HwFault";
							
						objHeater.timestamp = (new Date()).getTime();

						
							
						$scope.houseHeat.push(objHeater);
					
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
		
		socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeTH+";");
		socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeHeater+";");
		
		$scope.thermoViewUpdate = $interval( function() 
		{
			$scope.sendParamsToServer();
			socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeTH+";");
			socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeHeater+";");
		}, 5000);
		
	});
	
	$scope.uiToggleShowTH = function uiToggleShowTH(id)
	{
		if($scope.uiOpenedTH == id)
			$scope.uiOpenedTH = -1;
		else
			$scope.uiOpenedTH = id;
	}
	
	$scope.uiToggleShowHeater = function uiToggleShowHeater(id)
	{
		if($scope.uiOpenedHeater == id)
			$scope.uiOpenedHeater = -1;
		else
			$scope.uiOpenedHeater = id;
	}
	
	$scope.sendParamsToServer = function sendParamsToServer()
	{
		var th;
		for(var i = 0; i< $scope.houseTH.length; i++)	
		{
			th = $scope.houseTH[i];
			if(th.dirty)
			{
				th.dirty = false;
				
				/*{id:0, sensorID:0, title:"Bedroom Temp", dirty:false, 
	minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curTempSymbol:'C', 
	timestamp:1445802480, heaterOn:false, acOn:false,  autoPilotOn:true, autoPilotEndProgTimeH:22, autoPilotEndProgTimeM:30},
	*/
				var message = commWeb.eCommWebMsgTYpes.cwSetTHParams + ";" + 
							th.sensorID + ";" + (Math.round( th.curTemp * 10 ) / 10).toFixed(1)  + ";" + 
							th.title + ";"; //+autoPilotOn
							
				socket.send(message);
				
			}
		}
	}
	
	$scope.$on('$ionicView.beforeLeave', function() 
	{ 
	  settings.persist('settings', $scope.settings);
	
	  $scope.sendParamsToServer();
	  if (angular.isDefined($scope.thermoViewUpdate)) 
	  {
		$interval.cancel($scope.thermoViewUpdate);
		$scope.thermoViewUpdate = undefined;
	  }
	  
	  if (angular.isDefined($scope.thermoTempChangeTimer)) 
	  {
		$interval.cancel($scope.thermoTempChangeTimer);
		$scope.thermoTempChangeTimer = undefined;
	  }
	  
	});
	
	$scope.$on('$destroy', function() 
	{
		$scope.sendParamsToServer();
	  if (angular.isDefined($scope.thermoViewUpdate)) 
	  {
		$interval.cancel($scope.thermoViewUpdate);
		$scope.thermoViewUpdate = undefined;
	  }
	});
	
	$scope.getThermoSetTemp = function getThermoSetTemp(id)
	{
		//return (Math.round( $scope.houseTH[id].curTemp * 10 ) / 10).toFixed(1) + '*' + $scope.thermo.curTempSymbol;

		var i_part = parseInt($scope.houseTH[id].curTemp);
		var f_part = parseInt(Math.round( $scope.houseTH[id].curTemp * 10 ) ) % 10;
		
		return i_part + '*' + f_part;
	}
	
	$scope.getThermoSetTemp_Int = function getThermoSetTemp(id)
	{
		return $scope.settings.houseHoliday ?
			parseInt($scope.settings.houseHolidayTemperature)
			: parseInt($scope.houseTH[id].curTemp);
	}
	
	$scope.getThermoSetTemp_Frac = function getThermoSetTemp(id)
	{
		return $scope.settings.houseHoliday ?
			parseInt(Math.round($scope.settings.houseHolidayTemperature * 10 )) % 10
			: parseInt(Math.round( $scope.houseTH[id].curTemp * 10 ))  % 10;
	}	
	
	$scope.getThermoSensorRH = function getThermoSensorRH(id)
	{
		return (Math.round( $scope.houseTH[id].curSensorHumid * 10 ) / 10).toFixed(1) + '%';
	}
	
	$scope.getThermoSensorTemp = function getThermoSetTemp(id, whichTemp)
	{
		var value;
		
		if(whichTemp == 0)
		{
			value = $scope.houseTH[id].curSensorTemp;
		}
		else if(whichTemp == 1)
		{
			value = $scope.houseTH[id].curSensorTemp1m;
		}
		else if(whichTemp == 2)
		{
			value = $scope.houseTH[id].curSensorTemp10m;
		}
		
		var i_part = parseInt(value);
		var f_part = parseInt(Math.round( value * 10 ) ) % 10;
		
		return i_part + '*' + f_part;
	}
	
	$scope.getThermoHeaterActivity = function getThermoHeaterActivity(id)
	{
		if($scope.houseTH[id].acOn)
			return "cool to"
		else if($scope.houseTH[id].heaterOn) 
			return "heat to";
		else return "set to";
	}
	
	$scope.getHealthyDescrRH = function getHealthyDescrRH(id)
	{
		if($scope.houseTH[id].curSensorHumid < 20)
			return "foarte uscat";
		if($scope.houseTH[id].curSensorHumid < 40)
			return "uscat";	
		if($scope.houseTH[id].curSensorHumid < 60)
			return "optim";
		if($scope.houseTH[id].curSensorHumid < 70)
			return "umezeala";	
		
		return "foarte umed";
	}

	$scope.showRHMoreInfo = function showRHMoreInfo(id)
	{
	
	}
	
	$scope.showTHSettings = function showTHSettings(id)
	{
	
	}

	$scope.showAutopilotSettings = function showAutopilotSettings(id)
	{
	
	}

	$scope.getThermoAutoPilotDescr = function getThermoAutoPilotDescr(id)
	{	
		var descr = "senzor dezactivat";
		
		if($scope.houseTH[id].autoPilotOn)
		{
			descr = 'mentine '; 
			if($scope.settings.houseHoliday)
			{
				descr += $scope.settings.houseHolidayTemperature + "*C (in vacanta)";
			}
			else
			{
				descr += $scope.getThermoSetTemp(id);
				if($scope.houseTH[id].autoPilotEndProgTimeH > 0)
				{
					descr += " pana la " + $scope.houseTH[id].autoPilotEndProgTimeH + ":" + $scope.houseTH[id].autoPilotEndProgTimeM;
				}
				else
				{
					//descr += "";
				}
			}
		}
		
		return descr;
	}
	
	$scope.sliderCallback = function sliderCallback(cbkSetTextValue, cbkSetColorValue, cbkSetColorTrack, cbkSetSliderValue)
	{
		$scope.cbkSetTextValue = cbkSetTextValue;
		$scope.cbkSetColorValue = cbkSetColorValue;
		$scope.cbkSetColorTrack = cbkSetColorTrack;
		$scope.cbkSetSliderValue = cbkSetSliderValue;
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
		{
			$scope.houseTH[id].curTemp += 0.5;
			$scope.houseTH[id].dirty = true;
		}
	
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
		{
			$scope.houseTH[id].curTemp -= 0.5;
			$scope.houseTH[id].dirty = true;
		}
		
		/*var val = $scope.myui.lastValue - 1;
		if(val < $scope.myui.min)
			val = $scope.myui.max;
		//$scope.onSlide(val);
		$scope.cbkSetSliderValue(val);
		*/
	}	

	$scope.holdTempSetBtn = function holdTempSetBtn(up, hold, id)
	{
		$scope.thermoTempChangeDirectionUp = up;
		$scope.thermoTempChangeId = id;
		
		//$scope.thermoTempChangeSpeed = 5;
		
		if (angular.isDefined($scope.thermoTempChangeTimer)) 
		{
			$interval.cancel($scope.thermoTempChangeTimer);
			$scope.thermoTempChangeTimer = undefined;
		}

		if(hold)
		{
			$scope.thermoTempChangeTimer = $interval( function() 
			{
				//$scope.thermoTempChangeSpeed--;
				if($scope.thermoTempChangeDirectionUp)
				{
					$scope.doTempUp($scope.thermoTempChangeId);
					/*if($scope.thermoTempChangeSpeed < 0)
						$scope.doTempUp($scope.thermoTempChangeId);*/
				}
				else
				{
					$scope.doTempDown($scope.thermoTempChangeId);
					/*if($scope.thermoTempChangeSpeed < 0)
						$scope.doTempDown($scope.thermoTempChangeId);*/
				}
			}, 250);
		}
	}
	
	
	$scope.textTimestamp = function textTimestamp(date)
	{
		var seconds = Math.floor(((new Date().getTime()/1000) - date)),
		interval = Math.floor(seconds / 31536000);

		if (interval > 1) return interval + "y ago";

		interval = Math.floor(seconds / 2592000);
		if (interval > 1) return interval + "m ago";

		interval = Math.floor(seconds / 86400);
		if (interval >= 1) return interval + "d ago";

		interval = Math.floor(seconds / 3600);
		if (interval >= 1) return interval + "h ago";

		interval = Math.floor(seconds / 60);
		if (interval > 1) return interval + "m ago";

		return Math.floor(seconds) < 3 ? "now" : Math.floor(seconds) + "s ago";
	}
	
	$scope.addLog = function addLog(msg)
	{
		var date = new Date();
		
		$scope.logData.unshift({log:date.getHours() + ":" + ('0'+date.getMinutes()).slice(-2) + ":" + ('0'+date.getSeconds()).slice(-2) + " " + msg});
	}	
	
	$scope.lerp = function lerp(value, start_point, end_point)
	{
		return start_point + (end_point - start_point)*value;
	}	
});