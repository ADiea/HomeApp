var _ThermoCtrl = ionicApp.controller('ThermoCtrl', function($scope, settings, socket, logData, commWeb, $interval, $timeout, $ionicPopup, $ionicModal) 
{
	$scope.settings = settings.get('settings');
	$scope.logData = logData;

	$scope.arrayTempSlider=['Off', 'On', 'Auto'];
	$scope.myui = {min: 0, max:20, value:0, lastValue:0, halfValue:10};
	$scope.thermo = {minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curTempSymbol:'C'};
	
	$scope.houseTH = [
		{
			id:0, sensorID:0, title:"Dormitor", dirty:false, 
			minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:45.2, 
			timestamp:1445802480, heaterOn:false, acOn:false, autoPilotOn:true, autoPilotProgramIndex:0,
			schedule:
			[
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:9, endM:0}, {t:17.5, startH:9, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:9, endM:0}, {t:17.5, startH:9, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
			]
		},
		
		{
			id:1, sensorID:0, title:"Living", dirty:false, 
			minTemp:15.0, maxTemp:27.0, curTemp:18.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:30.2, 
			timestamp:1445802480, heaterOn:false, acOn:true,  autoPilotOn:true, autoPilotProgramIndex:0,
			schedule:
			[
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:9, endM:0}, {t:17.5, startH:9, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:9, endM:0}, {t:17.5, startH:9, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
			]			
		},
		
		{
			id:2, sensorID:0, title:"Baie", dirty:false, 
			minTemp:16.0, maxTemp:27.0, curTemp:19.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:73.2, 
			timestamp:1445802480, heaterOn:true, acOn:false,  autoPilotOn:true, autoPilotProgramIndex:0,
			schedule:
			[
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:9, endM:0}, {t:17.5, startH:9, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[{t:20.0, startH:0, startM:0, endH:9, endM:0}, {t:17.5, startH:9, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
			]			
		},
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


/*------MODAL AUTOPILOT*/
	$scope.modalAutoPilot = {
		modalSched:null,
		modalEdit:null,
		modalSchedCreated:false,
		modalEditCreated:false,
		ui:{
			intvIdx:0, 
			weekday:0, 
			curWeekDay:0,
			showOptionsIndex:-1,
			getIntervalTemp_i: function getIntervalTemp_i(i)
			{
				return parseInt(i.t);
			},
			getIntervalTemp_f: function getIntervalTemp_f(i)
			{
				return parseInt(Math.round( i.t * 10 ) ) % 10;
			},
			getMinuteStr: function getMinuteStr(min)
			{
				var num = min * 5 + "";
				if(num.length < 2) num = "0"+num;
				return num;	
			},
			getHourStr: function getHourStr(min)
			{
				var num = min + "";
				if(num.length < 2) num = "0"+num;
				return num;	
			},
			hourOptions:["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
						"12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
			minOptions:["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
			
			doTempUp : function doTempUp(intv, th)
			{
				if(intv.t < th.maxTemp)
				{
					intv.t += 0.5;
					//th.dirty = true;					
					try {navigator.notification.vibrate(10);}
					catch(e) {}
				}
			},
			doTempDown : function doTempDown(intv, th)
			{
				if(intv.t > th.minTemp)
				{
					intv.t -= 0.5;
					//th.dirty = true;					
					try {navigator.notification.vibrate(10);}
					catch(e) {}
				}
			},
			canTempUp : function canTempUp(intv, th)
			{
				if(intv.t < th.maxTemp)
				{
					return true;
				}
				return false;
			},
			canTempDown : function canTempDown(intv, th)
			{
				if(intv.t > th.minTemp)
				{
					return true;
				}
				return false;
			},			
		},
		th: {},
		thIndex:0,
		editInterval:{},
		editIntervalIndex:0,
	};

	$scope.closeProgram = function closeProgram() 
	{
		$scope.modalAutoPilot.modalSched.hide();
	};
	
	$scope.closeProgramAndSave = function closeProgramAndSave() 
	{
		$scope.houseTH[$scope.modalAutoPilot.thIndex] = JSON.parse(JSON.stringify($scope.modalAutoPilot.th));
		$scope.modalAutoPilot.modalSched.hide();
	};
		
	$scope.showAutopilotSettings = function showAutopilotSettings(id)
	{
		$scope.modalAutoPilot.thIndex = id;
		$scope.modalAutoPilot.th = JSON.parse(JSON.stringify($scope.houseTH[$scope.modalAutoPilot.thIndex]));

		$scope.modalAutoPilot.ui.intvIdx = 0;
		$scope.modalAutoPilot.ui.weekday = (new Date()).getDay() - 1;
		
		if($scope.modalAutoPilot.ui.weekday == -1)
			$scope.modalAutoPilot.ui.weekday = 6; //sunday
		
		$scope.modalAutoPilot.ui.curWeekDay = $scope.modalAutoPilot.ui.weekday;
		
		$scope.modalAutoPilot.ui.showOptionsIndex = -1;
		
		if(!$scope.modalAutoPilot.modalSchedCreated)
		{
			$scope.modalAutoPilot.modalSchedCreated = true;
			
			$ionicModal.fromTemplateUrl('views/program.html', {scope: $scope}).
			then(
				function(modal) 
				{
					$scope.modalAutoPilot.modalSched = modal;
					$scope.modalAutoPilot.modalSched.show();
			});
			
		}
		else
		{
			$timeout(function(){$scope.modalAutoPilot.modalSched.show();});
		}
	}

/*------MODAL */	
	
/*------MODAL AUTOPILOT INTERVAL*/
	
	$scope.closeAutopilotEdit = function closeAutopilotEdit() 
	{
		$scope.modalAutoPilot.modalEdit.hide();
	};
	
	$scope.compareTime = function(h1, m1, h2, m2)
	{
		if(h1 > h2)
			return 1;
		if(h1 < h2)
			return -1;
		if(m1 > m2)
			return 1;
		if(m1 < m2)
			return -1;
		return 0;
	}
	
	$scope.closeAutopilotEditAndSave = function closeAutopilotEditAndSave() 
	{
		var startI=0, endI=0, len=$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday].length, i=0;
		var oldArray = $scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday];
		var newInterval = $scope.modalAutoPilot.editInterval;
		var newArray = [];
		
		if($scope.compareTime(newInterval.endH, newInterval.endM, newInterval.startH, newInterval.startM) <= 0)
		{
			try {
		      window.plugins.toast.showShortCenter("Interval orar invalid!",function(a){},function(b){});
			}
			catch(e){}
			return;
		}
		
		for(; i< len; i++)
		{
			if($scope.compareTime(oldArray[i].endH, oldArray[i].endM, newInterval.startH, newInterval.startM) > 0)
			{
				startI = i;
				break;
			}
		}
		
		for(i=0; i < len; i++)
		{
			if($scope.compareTime(oldArray[i].endH, oldArray[i].endM, newInterval.endH, newInterval.endM) >= 0)
			{
				endI = i;
				break;
			}
		}		
		
		for(i=0; i<len; i++)
		{
			if(i < startI || i > endI)
			{
				newArray.push(JSON.parse(JSON.stringify(oldArray[i])));
			}
			
			if(i == startI)
			{
				if(oldArray[i].startH != newInterval.startH || oldArray[i].startM != newInterval.startM )
				{
					newArray.push({t:oldArray[i].t, startH:oldArray[i].startH, startM:oldArray[i].startM, endH:newInterval.startH, endM:newInterval.startM});
				}
				
				newArray.push(JSON.parse(JSON.stringify(newInterval)));
			}
			
			if(i==endI)
			{
				if(oldArray[i].endH != newInterval.endH || oldArray[i].endM != newInterval.endM)
				{
					newArray.push({t:oldArray[i].t, startH:newInterval.endH, startM:newInterval.endM, endH:oldArray[i].endH, endM:oldArray[i].endM});
				}				
			}
		}
		
		$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday] =  JSON.parse(JSON.stringify(newArray));
		
		$scope.modalAutoPilot.modalEdit.hide();
	};

	$scope.showAutopilotEditInterval = function showAutopilotEditInterval(id)
	{	
		if(id == -1)
		{
			var len = $scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday].length;
			var lastObj = {t:18.0, startH:0, startM:0, endH:8, endM:0};
			if(len > 0)
				lastObj = $scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][len-1];
				
			$scope.modalAutoPilot.editInterval = {t:lastObj.t, startH:lastObj.endH, startM:lastObj.endM, endH:lastObj.endH, endM:lastObj.endM};
		}
		else
		{
			$scope.modalAutoPilot.editInterval =  JSON.parse(JSON.stringify($scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][/*$scope.modalAutoPilot.editIntervalIndex*/id]));
		}

		if(!$scope.modalAutoPilot.modalEditCreated)
		{
			$scope.modalAutoPilot.modalEditCreated = true;
			
			$ionicModal.fromTemplateUrl('views/editProgram.html', {scope: $scope}).
			then(
				function(modal) 
				{
					$scope.modalAutoPilot.modalEdit = modal;
					$scope.modalAutoPilot.modalEdit.show();
			});
		}
		else
		{
			$timeout(function(){$scope.modalAutoPilot.modalEdit.show();});
		}	
	}
	
	$scope.removeAutoPilotInterval = function removeAutoPilotInterval(id)
	{
		var len = $scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday].length;
		if(id > 0)
		{
			$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][id - 1].endH = 
				$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][id].endH;
			
			$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][id - 1].endM = 
				$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][id].endM;
		}
		else if(id == 0 && id < len - 1)
		{
			$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][id + 1].startH = 
				$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][0].startH;
			
			$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][id + 1].startM = 
				$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][0].startM;
		}		
		
		$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday].splice(id, 1);
	}

/*------MODAL */	

/* MODAL settings   */
$scope.modalSettings = {
		modalSettings:null,
		modalSettingsCreated:false,
		
		tempMin:1,
		tempMax:30,
		
		ui:{
			getSettingsTemp_i: function getSettingsTemp_i(minTemp)
			{
				var temp = minTemp ? ($scope.modalSettings.tempMin) : ($scope.modalSettings.tempMax);
				return parseInt(temp);
			},
			getSettingsTemp_f: function getIntervalTemp_f(minTemp)
			{
				var temp = minTemp ? ($scope.modalSettings.tempMin) : ($scope.modalSettings.tempMax);
				return parseInt(Math.round( temp * 10 ) ) % 10;
			},

			doTempUp : function doTempUp(minTemp)
			{
				var done = false;
				if(minTemp)
				{
					if($scope.modalSettings.tempMin < $scope.modalSettings.tempMax - 0.5)
					{
						$scope.modalSettings.tempMin += 0.5;
					}
				}
				else
				{
					if($scope.modalSettings.tempMax < 30)
					{
						$scope.modalSettings.tempMax += 0.5;
					}				
				}
				
				if(done)
				{
					try {navigator.notification.vibrate(10);}
					catch(e) {}
				}
			},
			doTempDown : function doTempDown(minTemp)
			{
				var done = false;
				if(minTemp)
				{
					if($scope.modalSettings.tempMin > 0)
					{
						$scope.modalSettings.tempMin -= 0.5;
					}
				}
				else
				{
					if($scope.modalSettings.tempMax > $scope.modalSettings.tempMin + 0.5)
					{
						$scope.modalSettings.tempMax -= 0.5;
					}				
				}
				
				if(done)
				{
					try {navigator.notification.vibrate(10);}
					catch(e) {}
				}
			},
			canTempUp : function canTempUp(minTemp)
			{
				if(minTemp)
				{
					if($scope.modalSettings.tempMin < $scope.modalSettings.tempMax - 0.5)
					{
						return true;
					}
				}
				else
				{
					if($scope.modalSettings.tempMax < 30)
					{
						return true;
					}
				}
					
				return false;
			},
			canTempDown : function canTempDown(minTemp)
			{
				if(minTemp)
				{
					if($scope.modalSettings.tempMin > 0)
					{
						return true;
					}
				}
				else
				{
					if($scope.modalSettings.tempMax > $scope.modalSettings.tempMin + 0.5)
					{
						return true;
					}
				}
					
				return false;
			},			
		},
	};

	$scope.showTHSettings = function showTHSettings(id)
	{
		$scope.modalSettings.tempMin = $scope.houseTH[$scope.uiOpenedTH].minTemp;
		$scope.modalSettings.tempMax = $scope.houseTH[$scope.uiOpenedTH].maxTemp;
	
		if(!$scope.modalSettings.modalSettingsCreated)
		{
			$scope.modalSettings.modalSettingsCreated = true;
			
			$ionicModal.fromTemplateUrl('views/editThermoSettings.html', {scope: $scope}).
			then(
				function(modal) 
				{
					$scope.modalSettings.modalSettings = modal;
					$scope.modalSettings.modalSettings.show();
			});	
		}
		else
		{
			$timeout(function(){$scope.modalSettings.modalSettings.show();});
		}
	}

	$scope.closeTHSettings = function closeTHSettings(hideModal)
	{
		if(hideModal)
		{
			$scope.modalSettings.modalSettings.hide();
		}
	}
	
	$scope.closeTHSettingsAndSave = function closeTHSettingsAndSave()
	{
		$scope.houseTH[$scope.uiOpenedTH].minTemp = $scope.modalSettings.tempMin;
		$scope.houseTH[$scope.uiOpenedTH].maxTemp = $scope.modalSettings.tempMax;
		
		$scope.houseTH[$scope.uiOpenedTH].dirty = true;
	
		$scope.modalSettings.modalSettings.hide();
	}

/* --- /MODAL settings*/

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
		
		return i_part + ',' + f_part+"*C";
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

	$scope.getThermoAutoPilotDescr = function getThermoAutoPilotDescr(id)
	{	
		var descr = "senzor dezactivat";
		var dayOfWeek = (new Date()).getDay() - 1;
		
		if(dayOfWeek == -1)
			dayOfWeek = 6; //sunday
			
		var hour = $scope.houseTH[$scope.uiOpenedTH].schedule[dayOfWeek][$scope.houseTH[$scope.uiOpenedTH].autoPilotProgramIndex].endH;
		var min = $scope.houseTH[$scope.uiOpenedTH].schedule[dayOfWeek][$scope.houseTH[$scope.uiOpenedTH].autoPilotProgramIndex].endM * 5;
		
		if($scope.houseTH[id].autoPilotOn)
		{
			descr = "mentine "; 
			if($scope.settings.houseHoliday)
			{
				descr = "in vacanta (" + $scope.settings.houseHolidayTemperature + "*C)";
			}
			else
			{
				descr += $scope.getThermoSetTemp(id);
				
					descr += " pana la " + hour + ":" + min;
				
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
			
			try {navigator.notification.vibrate(10);}
			catch(e) {}
		}
	}
	
	$scope.doTempDown = function doTempDown(id)
	{
		if($scope.houseTH[id].curTemp > $scope.houseTH[id].minTemp)
		{
			$scope.houseTH[id].curTemp -= 0.5;
			$scope.houseTH[id].dirty = true;
			
			try {navigator.notification.vibrate(10);}
			catch(e) {}
		}
	}	

	$scope.holdTempSetBtn = function holdTempSetBtn(up, hold, id)
	{
		$scope.thermoTempChangeDirectionUp = up;
		$scope.thermoTempChangeId = id;
		
		if (angular.isDefined($scope.thermoTempChangeTimer)) 
		{
			$interval.cancel($scope.thermoTempChangeTimer);
			$scope.thermoTempChangeTimer = undefined;
		}

		if(hold)
		{
			$scope.thermoTempChangeTimer = $interval( function() 
			{
				if($scope.thermoTempChangeDirectionUp)
				{
					$scope.doTempUp($scope.thermoTempChangeId);
				}
				else
				{
					$scope.doTempDown($scope.thermoTempChangeId);
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