var _ThermoCtrl = ionicApp.controller('ThermoCtrl', function($scope, SettingsService, LogDataService, 
																socket, commWeb, $interval, $timeout, 
																$ionicPopup, $ionicModal, Lang, Util, $state) 
{
	$scope.lang = Lang;
	$scope.util = Util;
	
	$scope.ui =  {};
	$scope.heartbeat = 0;
	
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
		originalTh:{},
		editInterval:{},
		editIntervalIndex:0,
	};

	$scope.closeProgram = function closeProgram() 
	{
		$scope.modalAutoPilot.modalSched.hide();	
		$scope.modalAutoPilot.originalTh.isEditing = false;
		$scope.modalAutoPilot.originalTh.isLocked = false;
	};
	
	$scope.closeProgramAndSave = function closeProgramAndSave() 
	{
		$scope.modalAutoPilot.originalTh.schedule = JSON.parse(JSON.stringify($scope.modalAutoPilot.th.schedule));

		$scope.modalAutoPilot.originalTh.isEditing = true;
		$scope.modalAutoPilot.originalTh.isLocked = false;
		$scope.modalAutoPilot.modalSched.hide();
	};
		
	$scope.showAutopilotSettings = function showAutopilotSettings(th)
	{
		if($scope.settings.houseHoliday)
		{
			$state.go('app.holiday');
		}
		else
		{
			$scope.modalAutoPilot.originalTh = th;
			$scope.modalAutoPilot.th = JSON.parse(JSON.stringify(th));

			$scope.modalAutoPilot.ui.intvIdx = 0;
			
			$scope.modalAutoPilot.ui.curWeekDay = $scope.modalAutoPilot.th.autoPilotProgramDay;
			
			$scope.modalAutoPilot.ui.weekday = $scope.modalAutoPilot.ui.curWeekDay;
			
			if($scope.modalAutoPilot.ui.weekday == -1)
				$scope.modalAutoPilot.ui.weekday = 0;
			
			$scope.modalAutoPilot.ui.showOptionsIndex = -1;
			
			th.isEditing = true;
			th.isLocked = true;
			
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

/*---------------- MODAL charts -----*/
//http://n3-charts.github.io/line-chart/#/examples
	$scope.modalChart = {};
	
	$scope.modalChart.processDevChart = function processDevChart(dev)
	{
		dev.chartData[0] = [];
		dev.chartLabels = [];
		
		var deltaTime = (dev.chartTimes[dev.chartTimes.length - 1] - dev.chartTimes[0] )/ 20;
		var curTime = dev.chartTimes[0], k=0, curVal = 0;
		
		while(curTime <= dev.chartTimes[dev.chartTimes.length - 1])
		{
			if(curTime >= dev.chartTimes[k])
			{
				curVal = dev.chartDataRaw[k];
				k++;
				
				var date = new Date(dev.chartTimes[k-1]*1000);
				var h = date.getHours();
				
				var m = date.getMinutes() + "";
				if(m.length < 2) m = "0"+m;

				dev.chartLabels.push(h + ":" + m);
			}
			else dev.chartLabels.push("");
			
			dev.chartData[0].push(curVal);
			curTime += deltaTime;
		}	
	}

	$scope.deviceChart = function deviceChart(dev)
	{
		try{
		$scope.modalChart.processDevChart(dev);
		}
		catch(e)
		{}
	
		if(!$scope.modalChart.modalChartCreated)
		{
			$scope.modalChart.modalChartCreated = true;
			$scope.modalChart.chartDev = dev;
			
			$ionicModal.fromTemplateUrl('views/modalChart.html', {scope: $scope}).
			then(
				function(modal) 
				{
					$scope.modalChart.modalChart = modal;
					$scope.modalChart.modalChart.show();
			});	
		}
		else
		{
			$timeout(function(){$scope.modalChart.modalChart.show();});
		}
	}


/* ----------- end modal charts ----------*/

/* ---------MODAL settings  ------------ */
	$scope.modalSettings = {
		modalSettings:[null, null],
		modalSettingsCreated:[false, false],
		modalSettingsActive:0,
		
		tempMin:{ curTemp:1, minTemp:0, isEditing:false, isLocked:false, 
				maxTemp:function(){return $scope.modalSettings.tempMax.curTemp - 0.5;},			
		},
		tempMax:{ curTemp:30,maxTemp:30, isEditing:false, isLocked:false, 
				minTemp:function(){return $scope.modalSettings.tempMin.curTemp + 0.5;},
		},
		url:['views/editThermoSettings.html', 'views/editHeatSettings.html'],
		title:"",
		thresLow:0, 
		thresMed:0, 
		thresHigh:0, 
	};

	$scope.showModalSettings = function showTHSettings(th, openTHSettings)
	{
		openTHSettings = openTHSettings || false;
		
		if(openTHSettings)
		{
			$scope.modalSettings.tempMin.curTemp = th.minTemp;
			$scope.modalSettings.tempMax.curTemp = th.maxTemp;
			
			$scope.modalSettings.openedDev = th;
			$scope.modalSettings.modalSettingsActive = 0;
		}
		else
		{
			$scope.modalSettings.openedDev = th;
			$scope.modalSettings.modalSettingsActive = 1;
			
			$scope.modalSettings.thresLow = $scope.modalSettings.openedDev.lowGasLevThres;
			$scope.modalSettings.thresMed = $scope.modalSettings.openedDev.medGasLevThres;
			$scope.modalSettings.thresHigh = $scope.modalSettings.openedDev.highGasLevThres;
		}
		
		$scope.modalSettings.title = $scope.modalSettings.openedDev.title;
		
		$scope.modalSettings.openedDev.isEditing = true;
		$scope.modalSettings.openedDev.isLocked = true;
	
		if(!$scope.modalSettings.modalSettingsCreated[$scope.modalSettings.modalSettingsActive])
		{
			$scope.modalSettings.modalSettingsCreated[$scope.modalSettings.modalSettingsActive] = true;
			
			$ionicModal.fromTemplateUrl($scope.modalSettings.url[$scope.modalSettings.modalSettingsActive], {scope: $scope}).
			then(
				function(modal) 
				{
					$scope.modalSettings.modalSettings[$scope.modalSettings.modalSettingsActive] = modal;
					$scope.modalSettings.modalSettings[$scope.modalSettings.modalSettingsActive].show();
			});	
		}
		else
		{
			$timeout(function(){$scope.modalSettings.modalSettings[$scope.modalSettings.modalSettingsActive].show();});
		}
	}

	$scope.closeModalSettings = function closeModalSettings(hideModal)
	{
		$scope.modalSettings.openedDev.isEditing = false;
		$scope.modalSettings.openedDev.isLocked = false;
		
		if(hideModal)
		{
			$scope.modalSettings.modalSettings[$scope.modalSettings.modalSettingsActive].hide();
		}
	}
	
	$scope.closeAndSaveModalSettings = function closeAndSaveModalSettings()
	{
		if($scope.modalSettings.modalSettingsActive == 0)
		{
			$scope.modalSettings.openedDev.minTemp = $scope.modalSettings.tempMin.curTemp;
			$scope.modalSettings.openedDev.maxTemp = $scope.modalSettings.tempMax.curTemp;
		}
		else if($scope.modalSettings.modalSettingsActive == 1)
		{
			$scope.modalSettings.openedDev.lowGasLevThres = $scope.modalSettings.thresLow;
			$scope.modalSettings.openedDev.medGasLevThres = $scope.modalSettings.thresMed;
			$scope.modalSettings.openedDev.highGasLevThres = $scope.modalSettings.thresHigh;
		}
		
		$scope.modalSettings.openedDev.title = $scope.modalSettings.title;
		
		$scope.modalSettings.openedDev.isEditing = true;
		$scope.modalSettings.openedDev.isLocked = false;

		$scope.sendParamsToServer();

		$scope.modalSettings.modalSettings[$scope.modalSettings.modalSettingsActive].hide();
	}

/* END --- MODAL settings*/

	$scope.defaultDemoDevices = function defaultDemoDevices()
	{
		$scope.houseTH = [
		{
			sensorID:0, title:"DemoDormitor", sensorLocation:0, 
			minTemp:16.0, maxTemp:27.0, curTemp:21.0, curSensorTemp:22, curSensorTemp1m:22.1, curSensorTemp10m:21.9, curTempSymbol:'C', curSensorHumid:45.2, 
			timestamp:1552337694, heaterOn:false, acOn:false, autoPilotOn:1, autoPilotProgramIndex:0, autoPilotProgramDay:-1, 
			waitForAck:-1, isEditing:false, isLocked:false, isOutdated:false, isOffline:false, sensorLocation:0,
			schedule:[
				[{t:20.0, startH:0, startM:0, endH:8, endM:0}, {t:17.5, startH:8, startM:0, endH:18, endM:0}, {t:21.0, startH:18, startM:0, endH:23, endM:11}], 
				[], [], [], [], [], []
			],
			chartData:[[]], chartDataRaw:[], chartSeries:["graph"], chartLabels:[], 
			chartTimes:[] 
		}];
		
		$scope.houseHeat = [
		{
			sensorID:1, title:"Centrala",  
			lowGasLevThres:300, medGasLevThres:500, highGasLevThres:700, 
			lastGasReading:350, heaterOn:true, heaterFault:false, heaterFaultDescr:"",
			waitForAck:-1, isEditing:false, isLocked:false, isOutdated:false, isOffline:false, heaterOnMinutes:59, 
			timestamp:1445802480, chartData:[[]], chartDataRaw:[], chartSeries:["graph"], chartLabels:[], 
			chartTimes:[] 
		}];
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
		$scope.uiOpenedObject = null;

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

						while(numTHs--)
						{
							var objTH={};

							if(commWeb.skipInt(res).err) return;// skip dummy dev type
							
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
							objTH.isOutdated = false;
							objTH.isOffline = false;
							objTH.timestamp = (new Date()).getTime()/1000;
							objTH.curTempSymbol = 'C';
							
							if(commWeb.skipFloat(res).err) return;
							objTH.curTemp = res.result;	
							
							if(commWeb.skipFloat(res).err) return;
							objTH.minTemp = res.result;
							
							if(commWeb.skipFloat(res).err) return;
							objTH.maxTemp = res.result;
							
							if(commWeb.skipInt(res).err) return;
							objTH.sensorLocation = res.result;
							
							if(commWeb.skipInt(res).err) return;
							objTH.autoPilotOn = res.result;

							if(commWeb.skipInt(res).err) return; //watchers list
							var numWatchers = res.result;
							
							while(numWatchers > 0)
							{
								if(commWeb.skipInt(res).err) return; //watchers #i
							}
							
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
							
							if(commWeb.skipInt(res).err) return;
							objTH.autoPilotProgramIndex = res.result;

							if(commWeb.skipInt(res).err) return;
							objTH.autoPilotProgramDay = res.result;	

							if(commWeb.skipInt(res).err) return;
							objTH.heaterOn = res.result ? true : false;
							
							if(commWeb.skipInt(res).err) return;
							objTH.acOn = res.result ? true : false;

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorTemp = res.result;

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorHumid = res.result;

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorTemp1m = res.result;

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorTemp10m = res.result;		

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorHumid1m = res.result;	

							if(commWeb.skipFloat(res).err) return;
							objTH.curSensorHumid10m = res.result;			
							
							if(!found)	
								$scope.houseTH.push(objTH);
						}
					}
					else if(devType == commWeb.eDeviceTypes.devTypeHeater)
					{
						if(commWeb.skipInt(res).err) return;
						numTHs = res.result;
						
						while(numTHs--)
						{
							var objHeater={};
							
							if(commWeb.skipInt(res).err) return;// skip dummy dev type
							
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
							objHeater.isOutdated = false;
							objHeater.isOffline = false;
							objHeater.timestamp = (new Date()).getTime()/1000;
							
							if(commWeb.skipString(res).err) return;
							objHeater.title = res.result;

							if(commWeb.skipInt(res).err) return;
							objHeater.highGasLevThres = res.result;

							if(commWeb.skipInt(res).err) return;
							objHeater.medGasLevThres = res.result;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.lowGasLevThres = res.result;
							
							if(commWeb.skipInt(res).err) return; //watchers list
							var numWatchers = res.result;
							
							while(numWatchers > 0)
							{
								if(commWeb.skipInt(res).err) return; //watchers #i
							}							

							if(commWeb.skipInt(res).err) return;
							objHeater.heaterOn = res.result ? true : false;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.heaterFault = res.result ? true : false;
							
							if(commWeb.skipInt(res).err) return;
							objHeater.lastGasReading = res.result;
							
							if(commWeb.skipInt(res).err) return;
							if( res.result & 1)
								objHeater.heaterFaultDescr = "NoFault";
							if( res.result & 2)
								objHeater.heaterFaultDescr = "GasLeak";
							if( res.result & 4)
								objHeater.heaterFaultDescr = "HwFault";
							
							if(commWeb.skipInt(res).err) return;
							objHeater.heaterOnMinutes = res.result;
							
							if(!found)	
								$scope.houseHeat.push(objHeater);
						}
					}
				}				
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
					if(res.result == commWeb.eCommWebMsgTYpes.cwSetGenericDeviceParams)
					{
						if(commWeb.skipInt(res).err) return;
						
						var dev, i, lenTH = $scope.houseTH.length, lenHeat = $scope.houseHeat.length;
						for(i = 0; i < lenTH + lenHeat; i++)	
						{
							dev = i < lenTH ? $scope.houseTH[i] : $scope.houseHeat[i - lenTH];	
							if(dev.isEditing && dev.waitForAck == res.result)
							{
								dev.isEditing = false;
								break;
							}
						}
					}
				}
			},
		});

		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwReplyGenericDeviceLogs, 
			name:"ThermoController",
			//onMessage
			onMessage:function (data) 
			{
				LogDataService.addLog("Msg cwReplyGenericDeviceLogs: " + data);
				var type, id, dev=null, i, error = false;
				
				var res={str:data};
				
				if(commWeb.skipInt(res).err) return;
				type = res.result;
				
				if(commWeb.skipInt(res).err) return;
				id = res.result;
				
				if(type==1)
				{
					for(i = 0; i < $scope.houseTH.length; i++)
					{
						if($scope.houseTH[i].sensorID == id)
						{
							dev = $scope.houseTH[i];
							break;
						}
					}
				}
				else if (type==2)
				{
					for(i = 0; i < $scope.houseHeat.length; i++)
					{
						if($scope.houseHeat[i].sensorID == id)
						{
							dev = $scope.houseHeat[i];
							break;
						}
					}				
				}
				
				if(dev !== null)
				{
					dev.chartDataRaw = [];
					dev.chartTimes = [];
					var date, value;
					do
					{
						if(commWeb.skipInt(res).err) {error = true; break;}
						date = res.result;
						if(commWeb.skipInt(res).err) {error = true; break;}
						if(commWeb.skipInt(res).err) {error = true; break;}
						if(commWeb.skipFloat(res).err) {error = true; break;}
						value = res.result;
						
						dev.chartTimes.push(date);
						dev.chartDataRaw.push(value);
					}while(!error);
					
				
					$scope.modalChart.processDevChart(dev);
				}
			},
		});

		socket.connectSocket();
		
		socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeTH+";" + commWeb.getSequence() + ";");
		socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeHeater+";" + commWeb.getSequence() + ";");
		
		$scope.thermoViewUpdate = $interval( function() 
		{
			$scope.heartbeat++;
			
			$scope.sendParamsToServer();
			
			if($scope.heartbeat % 5 == 0)
			{
				if(!socket.isAlive())
				{
					socket.connectSocket(true);
				}
			}			
			
			if($scope.heartbeat % 20 == 0)
			{
				var dev, i, lenTH = $scope.houseTH.length, lenHeat = $scope.houseHeat.length;
				
				socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeTH+";" + commWeb.getSequence() + ";");
				socket.send(commWeb.eCommWebMsgTYpes.cwGetDevicesOfType+";"+commWeb.eDeviceTypes.devTypeHeater+";" + commWeb.getSequence() + ";");

				for(i = 0; i < lenTH + lenHeat; i++)	
				{
					dev = i < lenTH ? $scope.houseTH[i] : $scope.houseHeat[i - lenTH];
					
					dev.isOutdated = false;
					dev.isOffline = false;
				
					if(Util.textTimestamp(dev.timestamp).sec > 60)
						dev.isOffline = true;
					else if(Util.textTimestamp(dev.timestamp).sec > 25)
						dev.isOutdated = true;
				}
			}
		}, 1000);	
	});
	
	$scope.getDeviceLogs = function getDeviceLogs(dev)
	{
		var message = commWeb.eCommWebMsgTYpes.cwGetGenericDeviceLogs + ";" + 
							dev.sensorID + ";" + 
							'1454284568' + ";" + 
							'1' + ";" + 
							'50' + ';'+
							commWeb.getSequence() + ';';
		socket.send(message);
	}
	
	$scope.uiToggleShowObj = function uiToggleShowObj(obj)
	{
		if($scope.uiOpenedObject == obj)
			$scope.uiOpenedObject = null;
		else
			$scope.uiOpenedObject = obj;
	}
	
	$scope.sendParamsToServer = function sendParamsToServer()
	{
		var dev, i, lenTH = $scope.houseTH.length, lenHeat = $scope.houseHeat.length;
			
		for(i = 0; i < lenTH + lenHeat; i++)	
		{
			dev = i < lenTH ? $scope.houseTH[i] : $scope.houseHeat[i - lenTH];
			
			var message = commWeb.eCommWebMsgTYpes.cwSetGenericDeviceParams + ";" + 
							dev.sensorID + ";" + 
							dev.sensorID + ";" + 
							dev.title + ';';
			
			if(dev.isEditing && !dev.isLocked)
			{
				if(i < lenTH)
				{
					message +=  (Math.round( dev.curTemp * 10 ) / 10).toFixed(1)  + ";" + 
								(Math.round( dev.minTemp * 10 ) / 10).toFixed(1)  + ";" + 
								(Math.round( dev.maxTemp * 10 ) / 10).toFixed(1)  + ";" +
								dev.sensorLocation  + ';' + dev.autoPilotOn + ';0;'; //0-> watchers list 
				
					var day=0, i, len, sched;
					for(; day<7; day++)
					{
						len = dev.schedule[day].length;
						message +=  len + ";";
						for(i=0; i < len; i++)
						{
							sched = dev.schedule[day][i];
							message += (Math.round( sched.t * 10 ) / 10).toFixed(1) + ';' + 
										sched.startH + ';' + 
										sched.startM + ';' + 
										sched.endH + ';' + 
										sched.endM + ';';
						}
					}
					message += "0;0;0;0;0.0;0.0;0.0;0.0;0.0;0.0;"
				}
				else 
				{
					message += dev.highGasLevThres + ";" + 
								dev.medGasLevThres + ';' + dev.lowGasLevThres  + ";0;0;0;0;0;0;";
				}
				
				var seq = commWeb.getSequence();
				
				message +=  seq + ";"
				
				if(dev.isEditing)
				{
					dev.waitForAck = seq;
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
	
	$scope.getHealthyDescrRH = function getHealthyDescrRH(th)
	{
		if(th.curSensorHumid < 20)
			return Lang.getS('sVery') + " " + Lang.getS('sDry');
		if(th.curSensorHumid < 40)
			return Lang.getS('sDry');	
		if(th.curSensorHumid < 60)
			return Lang.getS('sOptim');
		if(th.curSensorHumid < 70)
			return Lang.getS('sDump');	
		
		return Lang.getS('sVery') + " " + Lang.getS('sDump');
	}

	$scope.showRHMoreInfo = function showRHMoreInfo(id)
	{
	
	}
	
	$scope.getAutopilotTempClass = function getAutopilotTempClass (th)
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
				return "tempLow";
			}
			else if(th.schedule[dayOfWeek][th.autoPilotProgramIndex].t < th.curTemp)
			{
				return "tempHigh";
			}
			else return "";
		}
	}

	$scope.getThermoAutoPilotDescr = function getThermoAutoPilotDescr(th)
	{	
		var descr = Lang.getS('sSensorDis');
		var thedate = new Date();
		var dayOfWeek = (thedate).getDay() - 1;
		
		if(dayOfWeek == -1)
			dayOfWeek = 6; //sunday

		if(th.autoPilotOn)
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
				if(th.autoPilotProgramIndex < th.schedule[dayOfWeek].length && th.autoPilotProgramIndex >= 0)
				{
					var hour = $scope.modalAutoPilot.ui.getHourStr(th.schedule[dayOfWeek][th.autoPilotProgramIndex].endH);
					var min = $scope.modalAutoPilot.ui.getMinuteStr(th.schedule[dayOfWeek][th.autoPilotProgramIndex].endM);

					descr = Lang.getS('sUntilHr') + hour + ":" + min;
				}
				else descr="";
			}
		}
		
		return descr;
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
});