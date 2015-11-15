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
			moOptions:[],
			dayOptions:[],
			yearOptions:[],
			tempOptions:[],
			daysInCurrentMo:0,
			refreshMo:null, refreshYear:null, refreshDay:null, refreshTemp:null
		}, 
		validMonths:["Ianuarie", "Februarie", "Martie", "Aprilie",
								"Mai", "Iunie", "Iulie", "August", "Septembrie", 
								"Octombrie", "Noiembrie", "Decembrie"],
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
				
			var monopts = [];
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
			$scope.ui.holidayEnd.dayOptions = dayopts;

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