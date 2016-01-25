var _ThermoCtrl = ionicApp.controller('ThermoCtrl', function($scope, SettingsService, LogDataService, 
																socket, commWeb, $interval, $timeout, 
																$ionicPopup, $ionicModal, Lang, Util, $state) 
{
	$scope.lang = Lang;
	$scope.util = Util;
	
	$scope.ui =  {};
	
	/*
		var iniR = 0, iniG = 128, iniB = 255,
		midR =255, midG = 255, midB = 255,
		inR = 255, finG = 128, finB = 0;
	*/

	/*------MODAL AUTOPILOT*/
	$scope.modalAutoPilot = {
		modalSched:null,
		modalEdit:null,
		modalSchedCreated:false,
		modalEditCreated:false,
		ui:{
			sensorLocationOptions:[{"id":"0","name":"Local"}, {"id":"1","name":"Senzor"}],
			intvIdx:0, 
			weekday:0, 
			curWeekDay:0,
			showOptionsIndex:-1,

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
		},
		th: {},
		thIndex:0,
		editInterval:{},
		editIntervalIndex:0,
	};

	$scope.closeProgram = function closeProgram() 
	{
		$scope.modalAutoPilot.modalSched.hide();	
		$scope.houseTH[$scope.modalAutoPilot.thIndex].isEditing = false;
		$scope.houseTH[$scope.modalAutoPilot.thIndex].isLocked = false;
	};
	
	$scope.closeProgramAndSave = function closeProgramAndSave() 
	{
		$scope.houseTH[$scope.modalAutoPilot.thIndex].schedule = JSON.parse(JSON.stringify($scope.modalAutoPilot.th.schedule));

		$scope.houseTH[$scope.modalAutoPilot.thIndex].isEditing = true;
		$scope.houseTH[$scope.modalAutoPilot.thIndex].isLocked = false;
		$scope.modalAutoPilot.modalSched.hide();
	};
		
	$scope.showAutopilotSettings = function showAutopilotSettings(id)
	{
		if($scope.settings.houseHoliday)
		{
			$state.go('app.holiday');
		}
		else
		{
			$scope.modalAutoPilot.thIndex = id;
			$scope.modalAutoPilot.th = JSON.parse(JSON.stringify($scope.houseTH[id]));

			$scope.modalAutoPilot.ui.intvIdx = 0;
			
			$scope.modalAutoPilot.ui.curWeekDay = $scope.modalAutoPilot.th.autoPilotProgramDay;
			
			$scope.modalAutoPilot.ui.weekday = $scope.modalAutoPilot.ui.curWeekDay;
			
			if($scope.modalAutoPilot.ui.weekday == -1)
				$scope.modalAutoPilot.ui.weekday = 0;
			
			$scope.modalAutoPilot.ui.showOptionsIndex = -1;
			
			$scope.houseTH[id].isEditing = true;
			$scope.houseTH[id].isLocked = true;
			
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
		var newInterval = $scope.modalAutoPilot.editInterval;
		newInterval.t = $scope.modalAutoPilot.editInterval.curTemp;
		
		if($scope.compareTime(newInterval.endH, newInterval.endM, newInterval.startH, newInterval.startM) <= 0)
		{
			try {
		      window.plugins.toast.showShortCenter("Interval orar invalid!",function(a){},function(b){});
			}
			catch(e){}
			return;
		}

		var startI=-1, endI=0, len=$scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday].length, i=0;
		var oldArray = $scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday];
		var newArray = [];

		for(i=0; i < len; i++)
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
		
		if(-1 === startI)
		{
			newArray.push(JSON.parse(JSON.stringify(newInterval)));
		}
		else for(i=0; i<len; i++)
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
			
			if(i == endI)
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
			var lastObj = {t:18.0, startH:0, startM:0, endH:23, endM:11};
			if(len > 0)
				lastObj = $scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][len-1];
				
			$scope.modalAutoPilot.editInterval = {curTemp:lastObj.t, minTemp:$scope.modalAutoPilot.th, maxTemp:$scope.modalAutoPilot.th.maxTemp, 
													isEditing:false, isLocked:false, startH:lastObj.startH, startM:lastObj.startM, endH:lastObj.endH, endM:lastObj.endM};
		}
		else
		{
			$scope.modalAutoPilot.editInterval =  JSON.parse(JSON.stringify($scope.modalAutoPilot.th.schedule[$scope.modalAutoPilot.ui.weekday][/*$scope.modalAutoPilot.editIntervalIndex*/id]));
			
			$scope.modalAutoPilot.editInterval.curTemp = $scope.modalAutoPilot.editInterval.t;
			$scope.modalAutoPilot.editInterval.minTemp = $scope.modalAutoPilot.th.minTemp;
			$scope.modalAutoPilot.editInterval.maxTemp = $scope.modalAutoPilot.th.maxTemp;
			$scope.modalAutoPilot.editInterval.isEditing = false;
			$scope.modalAutoPilot.editInterval.isLocked = false;
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
		tempMin:{ curTemp:1, minTemp:0, isEditing:false, isLocked:false, 
				maxTemp:function(){return $scope.modalSettings.tempMax.curTemp - 0.5;},			
		},
		tempMax:{ curTemp:30,maxTemp:30, isEditing:false, isLocked:false, 
				minTemp:function(){return $scope.modalSettings.tempMin.curTemp + 0.5;},
		},
	};

	$scope.showTHSettings = function showTHSettings(id)
	{
		$scope.modalSettings.tempMin.curTemp = $scope.houseTH[id].minTemp;
		$scope.modalSettings.tempMax.curTemp = $scope.houseTH[id].maxTemp;
		
		$scope.houseTH[id].isEditing = true;
		$scope.houseTH[id].isLocked = true;
	
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
		$scope.houseTH[$scope.uiOpenedTH].isEditing = false;
		$scope.houseTH[$scope.uiOpenedTH].isLocked = false;
		
		if(hideModal)
		{
			$scope.modalSettings.modalSettings.hide();
		}
	}
	
	$scope.closeTHSettingsAndSave = function closeTHSettingsAndSave()
	{
		$scope.houseTH[$scope.uiOpenedTH].minTemp = $scope.modalSettings.tempMin.curTemp;
		$scope.houseTH[$scope.uiOpenedTH].maxTemp = $scope.modalSettings.tempMax.curTemp;
		
		$scope.houseTH[$scope.uiOpenedTH].isEditing = true;
		$scope.houseTH[$scope.uiOpenedTH].isLocked = false;

		$scope.sendParamsToServer();

		$scope.modalSettings.modalSettings.hide();
	}

/* --- MODAL settings*/

	$scope.defaultDemoDevices = function defaultDemoDevices()
	{
		$scope.houseTH = [
			{
				id:0, sensorID:-1, title:"DemoDormitor", isValid:true, sensorLocation:0, 
				minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:45.2, 
				timestamp:1552337694, heaterOn:false, acOn:false, autoPilotOn:true, autoPilotProgramIndex:0, autoPilotProgramDay:-1, 
				waitForAck:-1, isEditing:false, isLocked:false, isError:false,
				schedule:[
					[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
					[], [], [], [], [], []
				]
			},
			
			{
				id:1, sensorID:-2, title:"DemoLiving", isValid:true, sensorLocation:"1", 
				minTemp:15.0, maxTemp:27.0, curTemp:18.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:30.2, 
				timestamp:1445802480, heaterOn:false, acOn:true,  autoPilotOn:true, autoPilotProgramIndex:0, autoPilotProgramDay:-1, 
				waitForAck:-1, isEditing:false, isLocked:false, isError:false,
				schedule: [[], [], [], [], [], [], []]
			},
		];
		
		$scope.houseHeat = [
			{id:0, sensorID:-1, title:"Centrala", isValid:true, 
			lowGasLevThres:300, medGasLevThres:500, highGasLevThres:700, 
			lastGasReading:350, heaterOn:true, heaterFault:false, heaterFaultDescr:"",
			waitForAck:-1, isEditing:false, isLocked:false, isError:false, heaterOnMinutes:59, 
			timestamp:1445802480},
			
			{id:1, sensorID:-2, title:"Centrala2", isValid:true, 
			lowGasLevThres:300, medGasLevThres:500, highGasLevThres:700, 
			lastGasReading:350, heaterOn:false, heaterFault:true, heaterFaultDescr:"GasLeak",
			waitForAck:-1, isEditing:false, isLocked:false, isError:false, heaterOnMinutes:123, 
			timestamp:1445802480},
		];
	}
	
	$scope.minutesToText = function minutesToText(min)
	{
		var h = Math.floor(min / 60);
		var m = min - h*60;
		var text='';
		if(h > 0)
			text += h + Lang.getS('sHrs');
		
		text+= m + Lang.getS('sMins');
		return text;		
	}

	$scope.$on('$ionicView.beforeEnter', function() 
	{  
		$timeout(function()
		{
			$scope.settings = SettingsService.get('settings');
			
			$scope.houseTH = SettingsService.get('house_ths');
			
			$scope.houseHeat = SettingsService.get('house_heaters');

			if($scope.houseTH === null || $scope.houseHeat === null)
			{
				$scope.defaultDemoDevices();
			}

		});
	});
	
	$scope.$on('$ionicView.afterEnter', function() 
	{  
		$scope.uiOpenedTH = -1;
		$scope.uiOpenedHeater = -1;
		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwReplyDevicesOfType, 
			name:"ThermoController",
			//onMessage
			onMessage:function (data) 
			{
				LogDataService.addLog("Msg cwReplyTHs: " + data);
				
				var numTHs, devType, curID = 0, i, shouldSave = false, found;
				
				var res = {str:data};

				if(!commWeb.skipInt(res).err)
				{
					devType = res.result;
					
					if(devType == commWeb.eDeviceTypes.devTypeTH)
					{
						if(commWeb.skipInt(res).err) return;
						numTHs = res.result;
						
						for(i=0; i< $scope.houseTH.length; i++)
						{
							if(!$scope.houseTH[i].isEditing)
								$scope.houseTH[i].isValid = false;
						}
						
						while(numTHs--)
						{
							var objTH={};

							if(commWeb.skipInt(res).err) return;
							
							found = false;
							
							for(i=0; i< $scope.houseTH.length; i++)
							{
								if($scope.houseTH[i].sensorID == res.result)
								{
									if(!$scope.houseTH[i].isEditing)
									{
										objTH = $scope.houseTH[i];
									}
									found = true;
									break;
								}
							}

							objTH.sensorID = res.result;

							if(commWeb.skipString(res).err) return;
							objTH.title = res.result;
							
							objTH.waitForAck = -1;
							objTH.isEditing = false;
							objTH.isLocked = false;
							objTH.isError = false;
							objTH.timestamp = (new Date()).getTime()/1000;
							
							if(commWeb.skipFloat(res).err) return;
							objTH.curTemp = res.result;	
							
							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorTemp = res.result;
						
							if(commWeb.skipInt(res).err) return;
							if(res.result == 1)
								objTH.curTempSymbol = 'C';
							else
								objTH.curTempSymbol = 'F';
								
							if(commWeb.skipInt(res).err) return;
							objTH.autoPilotOn = res.result ? true : false;
							
							if(commWeb.skipInt(res).err) return;
							objTH.heaterOn = res.result ? true : false;
							
							if(commWeb.skipInt(res).err) return;
							objTH.acOn = res.result ? true : false;
							
							if(commWeb.skipFloat(res).err) return;
							objTH.minTemp = res.result;
							
							if(commWeb.skipFloat(res).err) return;
							objTH.maxTemp = res.result;
							
							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorHumid = res.result;

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorTemp1m = res.result;

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorTemp10m = res.result;

							if(commWeb.skipInt(res).err) 
							{
								//Make default schedules for all days
								objTH.autoPilotProgramDay = -1;
								objTH.autoPilotProgramIndex = 0;
								objTH.schedule = null;
								objTH.schedule = new Array([], [], [], [], [], [], []);
							}
							else
							{
								objTH.autoPilotProgramDay = res.result;
								
								if(commWeb.skipInt(res).err) return;
								objTH.autoPilotProgramIndex = res.result;
								
								var day=0, numProg, temp, _startH, _startM, _endH, _endM;

								objTH.schedule = null;
								objTH.schedule = new Array([], [], [], [], [], [], []);

								for(; day < 7; day++)
								{
									if(commWeb.skipInt(res).err) return;
									numProg  = res.result;
									
									while(numProg)
									{	
										if(commWeb.skipFloat(res).err) return;
										temp = res.result;	
										
										if(commWeb.skipInt(res).err) return;
										_startH  = res.result;
										
										if(commWeb.skipInt(res).err) return;
										_startM  = res.result;
										
										if(commWeb.skipInt(res).err) return;
										_endH = res.result;  
										
										if(commWeb.skipInt(res).err) return;
										_endM  = res.result;
										
										objTH.schedule[day].push({t:temp, startH:_startH, startM:_startM, endH:_endH, endM:_endM});
									
										numProg--;
									}
								}
							}
							objTH.isValid = true;
							
							if(!found)	
								$scope.houseTH.push(objTH);
						}

						for(i=0; i< $scope.houseTH.length; i++)
						{
							if(!$scope.houseTH[i].isValid)
							{
								$scope.houseTH.splice(i, 1);
							}
							else
							{
								$scope.houseTH[i].id = curID++;
							}
						}
					}
					else if(devType == commWeb.eDeviceTypes.devTypeHeater)
					{
						
						if(commWeb.skipInt(res).err) return;
						numTHs = res.result;

						for(i=0; i< $scope.houseHeat.length; i++)
						{
							$scope.houseHeat[i].isValid = false;
						}
						
						while(numTHs--)
						{
							var objHeater={};
							if(commWeb.skipInt(res).err) return;
							
							found = false;
							
							for(i=0; i < $scope.houseHeat.length; i++)
							{
								if($scope.houseHeat[i].sensorID == res.result)
								{
									objHeater = $scope.houseHeat[i];
									found = true;
									break;
								}
							}

							objHeater.sensorID = res.result;
							
							objHeater.waitForAck = -1;
							objHeater.isEditing = false;
							objHeater.isLocked = false;
							objHeater.isError = false;
							objHeater.timestamp = (new Date()).getTime()/1000;
							
							if(commWeb.skipString(res).err) return;
							objHeater.title = res.result;

							if(commWeb.skipInt(res).err) return;
							objHeater.heaterOn = res.result ? true : false;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.heaterFault = res.result ? true : false;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.lastGasReading = res.result;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.lowGasLevThres = res.result;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.medGasLevThres = res.result;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.highGasLevThres = res.result;
							
							if(commWeb.skipInt(res).err) return;
							if( res.result & 1)
								objHeater.heaterFaultDescr = "NoFault";
							if( res.result & 2)
								objHeater.heaterFaultDescr = "GasLeak";
							if( res.result & 4)
								objHeater.heaterFaultDescr = "HwFault";
							
							if(commWeb.skipInt(res).err) return;
							objHeater.heaterOnMinutes = res.result;
							
							objHeater.isValid = true;
							
							if(!found)	
								$scope.houseHeat.push(objHeater);
						}
						
						for(i=0; i< $scope.houseHeat.length; i++)
						{
							if(!$scope.houseHeat[i].isValid)
							{
								$scope.houseHeat.splice(i, 1);
							}
							else
							{
								$scope.houseHeat[i].id = curID++;
							}
						}
					}
				}				
			},
		});
		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwNotifyTHStatus, 
			name:"ThermoController",
			//onMessage
			onMessage:function (data) 
			{
				LogDataService.addLog("Msg cwNotifyTHStatus: " + data);
			},
		});

		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwReplyToCommand, 
			name:"ThermoController",
			//onMessage
			onMessage:function (data) 
			{
				LogDataService.addLog("Msg cwReplyToCommand: " + data);
				
				var res={str:data};
				
				if(commWeb.skipInt(res).err) return;
				
				if(res.result == commWeb.eCommWebErrorCodes.cwErrSuccess)
				{
					if(commWeb.skipInt(res).err) return;
					if(res.result == commWeb.eCommWebMsgTYpes.cwSetTHParams)
					{
						if(commWeb.skipInt(res).err) return;
						
						var th;
						for(var i = 0; i< $scope.houseTH.length; i++)	
						{
							th = $scope.houseTH[i];
							if(th.isEditing && th.waitForAck == res.result)
							{
								th.isEditing = false;
								break;
							}
						}
					}
				}
			},
		});
	
		socket.connectSocket();
		
		socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeTH+";" + commWeb.getSequence() + ";");
		socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeHeater+";" + commWeb.getSequence() + ";");
		
		$scope.thermoViewUpdate = $interval( function() 
		{
			var i;
			$scope.sendParamsToServer();
			socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeTH+";" + commWeb.getSequence() + ";");
			socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeHeater+";" + commWeb.getSequence() + ";");
		
			for(i=0; i < $scope.houseTH.length; i++)
			{
				if(Util.textTimestamp($scope.houseTH[i].timestamp).sec > 5)
					$scope.houseTH[i].isError = true;
				else
					$scope.houseTH[i].isError = false;
			}
			
			for(i=0; i < $scope.houseHeat.length; i++)
			{
				if(Util.textTimestamp($scope.houseHeat[i].timestamp).sec > 5)
					$scope.houseHeat[i].isError = true;
				else
					$scope.houseHeat[i].isError = false;
			}
		}, 5000);	
	});
	
	$scope.uiToggleShowTH = function uiToggleShowTH(id)
	{
		//first close all heaters
		$scope.uiOpenedHeater = -1;
		
		if($scope.uiOpenedTH == id)
			$scope.uiOpenedTH = -1;
		else
			$scope.uiOpenedTH = id;
	}
	
	$scope.uiToggleShowHeater = function uiToggleShowHeater(id)
	{
		//first close all sensors
		$scope.uiOpenedTH = -1;
		
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
			if(th.isEditing && !th.isLocked)
			{
				var message = commWeb.eCommWebMsgTYpes.cwSetTHParams + ";" + 
							th.sensorID + ";" + (Math.round( th.curTemp * 10 ) / 10).toFixed(1)  + ";" + 
							th.title + ";"+ (Math.round( th.minTemp * 10 ) / 10).toFixed(1)  + ";" + 
							(Math.round( th.maxTemp * 10 ) / 10).toFixed(1)  + ";" ; 
							
				var day=0, i, len, sched;
				for(; day<7; day++)
				{
					len = th.schedule[day].length;
					message +=  len + ";";
					for(i=0; i < len; i++)
					{
						sched = th.schedule[day][i];
						message += (Math.round( sched.t * 10 ) / 10).toFixed(1) + ';' + 
									sched.startH + ';' + 
									sched.startM + ';' + 
									sched.endH + ';' + 
									sched.endM + ';';
					}
				}
				
				var seq = commWeb.getSequence();
				
				message +=  seq + ";"
				
				if(th.isEditing)
				{
					th.waitForAck = seq;
				}
				
				LogDataService.addLog("Msg try send: " + message);
				socket.send(message);
			}
		}
	}
	
	$scope.$on('$ionicView.beforeLeave', function() 
	{ 
	  SettingsService.persist('settings', $scope.settings);
	
	  SettingsService.persist('house_ths', $scope.houseTH);
	  
	  SettingsService.persist('house_heaters', $scope.houseHeat);
	  
	
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

	
	$scope.getHealthyDescrRH = function getHealthyDescrRH(id)
	{
		if($scope.houseTH[id].curSensorHumid < 20)
			return Lang.getS('sVery') + " " + Lang.getS('sDry');
		if($scope.houseTH[id].curSensorHumid < 40)
			return Lang.getS('sDry');	
		if($scope.houseTH[id].curSensorHumid < 60)
			return Lang.getS('sOptim');
		if($scope.houseTH[id].curSensorHumid < 70)
			return Lang.getS('sDump');	
		
		return Lang.getS('sVery') + " " + Lang.getS('sDump');
	}

	$scope.showRHMoreInfo = function showRHMoreInfo(id)
	{
	
	}


	
	
	$scope.isTempHigherThanProgram = function isTempHigherThanProgram (th)
	{
		var thedate = new Date();
		var dayOfWeek = (thedate).getDay() - 1;
		
		if(dayOfWeek == -1)
			dayOfWeek = 6; //sunday
	
		if(th.autoPilotOn && !$scope.settings.houseHoliday &&
			th.autoPilotProgramIndex < th.schedule[dayOfWeek].length && th.autoPilotProgramIndex >= 0)
			
		{
			if(th.schedule[dayOfWeek][th.autoPilotProgramIndex].t > th.curTemp)
			{
				return 1;
			}
			else if(th.schedule[dayOfWeek][th.autoPilotProgramIndex].t < th.curTemp)
			{
				return -1;
			}
			else return 0;
		}
	} 
	
	$scope.getAutopilotTempClass = function getAutopilotTempClass(th)
	{
		var sign = $scope.isTempHigherThanProgram(th);
		
		if(sign < 0)
		{
			return "assertive";
		}
		else if(sign > 0)
		{
			return "positive";
		}
		return "dark";
	}
	
	$scope.getAutopilotTempIcon = function getAutopilotTempIcon(th)
	{
		var sign = $scope.isTempHigherThanProgram(th);
		
		if(sign < 0)
		{
			return "ion-arrow-up-b assertive";
		}
		else if(sign > 0)
		{
			return "ion-arrow-down-b positive";
		}		
		return "";
	} 

	$scope.getThermoAutoPilotDescr = function getThermoAutoPilotDescr(id)
	{	
		var descr = Lang.getS('sSensorDis');
		var thedate = new Date();
		var dayOfWeek = (thedate).getDay() - 1;
		
		if(dayOfWeek == -1)
			dayOfWeek = 6; //sunday

		if($scope.houseTH[id].autoPilotOn)
		{
			if($scope.settings.houseHoliday)
			{
				var daysOfHoliday = 0;
				var curTimestamp = thedate.getTime() / 1000;
				
				if(curTimestamp < $scope.settings.houseHolidayEnd)
				{
					daysOfHoliday = Math.floor(( $scope.settings.houseHolidayEnd - curTimestamp) / 86400);//3600*24;
				}
				
				descr = " " + Lang.getS('sHoliday2') + " ";
				
				if( daysOfHoliday <= 1 )
					descr += Lang.getS('sToday');
				else 
					descr += daysOfHoliday + " " + Lang.getS('sDays');
			}
			else 
			{
				if($scope.houseTH[id].autoPilotProgramIndex < $scope.houseTH[id].schedule[dayOfWeek].length && $scope.houseTH[id].autoPilotProgramIndex >= 0)
				{
					var hour = $scope.modalAutoPilot.ui.getHourStr($scope.houseTH[id].schedule[dayOfWeek][$scope.houseTH[id].autoPilotProgramIndex].endH);
					var min = $scope.modalAutoPilot.ui.getMinuteStr($scope.houseTH[id].schedule[dayOfWeek][$scope.houseTH[id].autoPilotProgramIndex].endM);
					//var different = "";
					
					//if($scope.houseTH[id].schedule[dayOfWeek][$scope.houseTH[id].autoPilotProgramIndex].t != $scope.houseTH[id].curTemp)
					//	different = '(!)';
					descr = /*different + */Lang.getS('sUntilHr') + hour + ":" + min;
				}
				else descr="";
			}
		}
		
		return descr;
	}
});