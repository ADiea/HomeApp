var _SettingsCtrl = ionicApp.controller('SettingsCtrl', function($scope, settings, $state, socket) 
{
	$scope.settings = {};
	$scope.oldSettings = {};
	$scope.ui = 
	{
		holidayShow:false,
		holidayEnd:
		{
			mo:0, 
			day:0,
			year:0,
			temp:0,
			moOptions:[{id:0, value:"Ianuarie"}, {id:1, value:"Februarie"}, {id:2, value:"Martie"}, 
					 {id:3, value:"Aprilie"},{id:4, value:"Mai"}, {id:5, value:"Iunie"}, {id:6, value:"Iulie"}, 
					 {id:7, value:"August"}, {id:8, value:"Septembrie"}, {id:9, value:"Octombrie"}, 
					 {id:10, value:"Noiembrie"}, {id:11, value:"Decembrie"}],
			dayOptions:[{id:0, value:"00"}, {id:1, value:"01"}, {id:2, value:"02"}, 
					 {id:3, value:"03"},{id:4, value:"04"}, {id:5, value:"05"}, {id:6, value:"06"}, 
					 {id:7, value:"07"}, {id:8, value:"08"}, {id:9, value:"09"}, 
					 {id:10, value:"10"}, {id:11, value:"11"},
					 {id:0, value:"12"}, {id:1, value:"13"}, {id:2, value:"14"}, 
					 {id:3, value:"15"},{id:4, value:"16"}, {id:5, value:"17"}, {id:6, value:"18"}, 
					 {id:7, value:"19"}, {id:8, value:"20"}, {id:9, value:"21"}, 
					 {id:10, value:"22"}, {id:11, value:"23"},
					 {id:0, value:"24"}, {id:1, value:"25"}, {id:2, value:"26"}, 
					 {id:3, value:"27"},{id:4, value:"28"}, {id:5, value:"29"}, {id:6, value:"30"}, 
					 {id:7, value:"31"}],
			yearOptions:[],
			tempOptions:[],
			daysInCurrentMo:0,
			refreshMo:null, refreshYear:null, refreshDay:null, refreshTemp:null
		}, 
		/*validMonths:[{id:0, value:"Ianuarie"}, {id:1, value:"Februarie"}, {id:2, value:"Martie"}, 
					 {id:3, value:"Aprilie"},{id:4, value:"Mai"}, {id:5, value:"Iunie"}, {id:6, value:"Iulie"}, 
					 {id:7, value:"August"}, {id:8, value:"Septembrie"}, {id:9, value:"Octombrie"}, 
					 {id:10, value:"Noiembrie"}, {id:11, value:"Decembrie"}],*/
		validDaysInMounth: [31, 28, 31, 30, 31, 30, 31, 
										31, 30, 31, 30, 31],
		
		toggleHolydayShow:function toggleHolydayShow()
		{
			$scope.ui.holidayShow = !$scope.ui.holidayShow;
			if($scope.ui.holidayShow)
			{
				$scope.refreshHolidayControls(false);
			}
		}
	};
	
	$scope.refreshHolidayControls = function refreshHolidayControls(reinit)
	{
		if(!reinit)
		{
			$scope.ui.holidayEnd.mo = $scope.ui.holidayEnd.mo;
			$scope.ui.holidayEnd.day = $scope.ui.holidayEnd.day;
			$scope.ui.holidayEnd.year = $scope.ui.holidayEnd.year;
		
			$scope.ui.holidayEnd.refreshMo();
			$scope.ui.holidayEnd.refreshYear();
			$scope.ui.holidayEnd.refreshDay();
			$scope.ui.holidayEnd.refreshTemp();
			
			
		}
		else
		{
			var date = new Date($scope.settings.houseHolidayEnd*1000);
					
			var _year = date.getYear();
			var _month = date.getMonth();
			var _day = date.getDate();
			
			if (_year%4 == 0)	
				$scope.ui.validDaysInMounth[1] = 29;
			else
				$scope.ui.validDaysInMounth[1] = 28;
				
			/*var monopts = [];
			for(var i=0;i<12;i++)
			{
				var obj={id:i};
				obj.value = $scope.ui.validMonths[i];					
				monopts.push(obj);
			}
			$scope.ui.holidayEnd.moOptions = monopts;
			
			var dayopts = [];
			for(var i=0;i<31;i++)
			{
				var obj={id:i};
				obj.value = (i<9?'0':"")+(i+1);
				dayopts.push(obj);
			}	
			$scope.ui.holidayEnd.dayOptions = dayopts;*/

			var yopts=[];
			var j=0;
			for(var i=_year;i<_year+10;i++)
			{
				var obj={id:j++};
				obj.value = ""+(i+1900);
				yopts.push(obj);
			}	
			$scope.ui.holidayEnd.yearOptions = yopts;
			
			var tempopts=[];
			for(var i=0;i<22;i++)
			{
				var obj={id:i};

				obj.value = 16 + 0.5*i;
				
				obj.i = parseInt(obj.value);
				obj.f = parseInt(Math.round( obj.value * 10 ) ) % 10;
				
				tempopts.push(obj);
			}	
			$scope.ui.holidayEnd.tempOptions = tempopts;

			$scope.ui.holidayEnd.mo = _month;
			$scope.ui.holidayEnd.day = _day-1;
			$scope.ui.holidayEnd.year = 0;
		}
	}
	
	$scope.ui.holidayEnd.unwatchMo = $scope.$watch('ui.holidayEnd.mo', function(newVal) 
	{
		if (typeof newVal != 'undefined' && $scope.ui.holidayEnd.yearOptions.length > 0) 
		{
			if (parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.year].value)%4 == 0)	
				$scope.ui.validDaysInMounth[1] = 29;
			else
				$scope.ui.validDaysInMounth[1] = 28;
				
			$scope.ui.holidayEnd.daysInCurrentMo = $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];
	/*
			if($scope.ui.holidayEnd.dayOptions.length != $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo])
			{
				var dayopts = [];
				for(var i=0;i<$scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];i++)
				{
					var obj={id:i, type:1};
					obj.value = (i<9?'0':"")+(i+1);
					dayopts.push(obj);
				}	
				$scope.ui.holidayEnd.dayOptions = dayopts;
			}
	*/		
		}
	});
	
	$scope.ui.holidayEnd.unwatchYear = $scope.$watch('ui.holidayEnd.year', function(newVal) 
	{
		if (typeof newVal != 'undefined' && $scope.ui.holidayEnd.yearOptions.length > 0) 
		{
			if (parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.year].value)%4 == 0)	
				$scope.ui.validDaysInMounth[1] = 29;
			else
				$scope.ui.validDaysInMounth[1] = 28;
				
			$scope.ui.holidayEnd.daysInCurrentMo = $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];
			/*
			if($scope.ui.holidayEnd.dayOptions.length != $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo])
			{
				var dayopts = [];
				for(var i=0;i<$scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];i++)
				{
					var obj={id:i, type:1};
					obj.value = (i<9?'0':"")+(i+1);
					dayopts.push(obj);
				}	
				$scope.ui.holidayEnd.dayOptions = dayopts;
			}
			*/
		}
	});
	
	
	$scope.$on('destroy', function() {
            // Unbind events
            $scope.ui.holidayEnd.unwatchMo();
			$scope.ui.holidayEnd.unwatchYear();
          });
	
	$scope.$on('$ionicView.beforeEnter', function() 
	{
		$scope.settings = settings.get('settings');
		if($scope.settings == null)
		{
			$scope.defaultSettings();
		}
		$scope.oldSettings = JSON.parse(JSON.stringify($scope.settings));
		
		$scope.refreshHolidayControls(true);
	});
	
	$scope.$on('$ionicView.beforeLeave', function() 
	{
		settings.persist('settings', $scope.settings);
		
		if($scope.settings.serverURL != $scope.oldSettings.serverURL)
		{
			socket.connectSocket(true);
		}
	});
	
	$scope.saveSettings = function saveSettings()
	{
		settings.persist('settings', $scope.settings);
		//$state.go('app.house');
	}
	
	$scope.defaultSettings = function defaultSettings()
	{
		$scope.settings = {
			serverURL : "ws://192.168.0.103",
			houseHoliday:true,
			//householidayStart:1447205294,
			houseHolidayEnd:1447910991,
			houseHolidayTemperature:18,
			};
		//$state.go('app.house');
	}
});