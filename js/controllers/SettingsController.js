var _SettingsCtrl = ionicApp.controller('SettingsCtrl', function($scope, settings, $state, socket) 
{
	$scope.settings = {};
	$scope.oldSettings = {};
	$scope.ui = 
	{
		holidayShow:false,
		holidayStart:
		{
			mo:0, 
			day:0,
			year:0,
			moOptions:[],
			dayOptions:[],
			yearOptions:[]
		}, 
		holidayEnd:
		{
			mo:'Dec', 
			day:'23',
			year:'2015'
		},
		toggleHolydayShow:function toggleHolydayShow()
		{
			$scope.ui.holidayShow = !$scope.ui.holidayShow;
			if($scope.ui.holidayShow)
			{
				var date = new Date($scope.settings.houseHolidayStart*1000);
				
				var _year = date.getYear();
				var _month = date.getMonth();
				var _day = date.getDate();
				
				
				var validMonths = ["Ianuarie", "Februarie", "Martie", "Aprilie",
								"Mai", "Iunie", "Iulie", "August", "Septembrie", 
								"Octombrie", "Noiembrie", "Decembrie"];
								
				var validDaysInMounth = [31, 28, 31, 30, 31, 30, 31, 
										31, 30, 31, 30, 31];
										
				if (_year%4 == 0)	validDaysInMounth[1]++;
					
				
				var monopts = [];
				for(var i=0;i<12;i++)
				{
					var obj={id:i, type:1};
					obj.value = validMonths[i];					
					monopts.push(obj);
				}
				$scope.ui.holidayStart.moOptions = monopts;
				
				
				var dayopts = [];
				for(var i=0;i<validDaysInMounth[_month];i++)
				{
					var obj={id:i, type:1};
					obj.value = (i<9?'0':"")+(i+1)+" ";
					
					dayopts.push(obj);
				}	
				$scope.ui.holidayStart.dayOptions = dayopts;

				var yopts=[]
				for(var i=_year;i<_year+10;i++)
				{
					var obj={id:i, type:1};
					obj.value = ""+(i+1900);
					
					yopts.push(obj);
				}	
				
				$scope.ui.holidayStart.yearOptions = yopts;


				
				
				$scope.ui.holidayStart.mo = _month;
				$scope.ui.holidayStart.day = _day-1;
				$scope.ui.holidayStart.year = 0;
				
				//$scope.ui.holidayStart = 
				//date.getMonth();
			}
		}
	};
	
	$scope.$on('$ionicView.beforeEnter', function() 
	{
		$scope.settings = settings.get('settings');
		if($scope.settings == null)
		{
			$scope.defaultSettings();
		}
		$scope.oldSettings = JSON.parse(JSON.stringify($scope.settings));
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
			houseHolidayStart:1447205294,
			houseHolidayEnd:1447265294,
			houseHolidayTemperature:18,
			};
		//$state.go('app.house');
	}
});