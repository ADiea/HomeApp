var _SettingsCtrl = ionicApp.controller('SettingsCtrl', function($scope, settings, $state, socket, $timeout, $interval) 
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
			moOptions:["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", 
						"Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie" ],
			dayOptions:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", 
						"16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
			yearOptions:[],
			daysInCurrentMo:0,
			refreshMo:null, refreshYear:null, refreshDay:null
		},
		getHolidayTemp:function getHolidayTemp()
		{
			return $scope.settings.houseHolidayTemperature.toFixed(1);
		},
		doTempUp: function doTempUp()
		{
			if($scope.settings.houseHolidayTemperature < $scope.settings.houseHolidayMaxTemperature) 
			{
				$scope.settings.houseHolidayTemperature += 0.5;
				try
				{
					navigator.notification.vibrate(10);
				}
				catch(e)
				{}
			}
		},
		doTempDown: function doTempDown()
		{
			if($scope.settings.houseHolidayTemperature > $scope.settings.houseHolidayMinTemperature) 
			{
				$scope.settings.houseHolidayTemperature -= 0.5;
								try
				{
					navigator.notification.vibrate(10);
				}
				catch(e)
				{}
			}
		},
		getHolidayTempInt : function getHolidayTempInt()
		{
			return parseInt($scope.settings.houseHolidayTemperature);
		},	
		getHolidayTempFrac : function getHolidayTempFrac()
		{
			return parseInt(Math.round($scope.settings.houseHolidayTemperature * 10 ) ) % 10;
		},
		validDaysInMounth: [31, 28, 31, 30, 31, 30, 31, 
							31, 30, 31, 30, 31],
		
		toggleHolydayShow:function toggleHolydayShow()
		{
			$scope.ui.holidayShow = !$scope.ui.holidayShow;
			if($scope.ui.holidayShow)
			{
				$scope.refreshHolidayControls(false);
			}
		},
		holdTempSetBtn: function holdTempSetBtn(up, hold)
		{
			$scope.thermoTempChangeDirectionUp = up;

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
						$scope.ui.doTempUp();
						
					}
					else
					{
						$scope.ui.doTempDown();
					}
				}, 250);
			}
		}
	};
	
	$scope.refreshHolidayControls = function refreshHolidayControls(reinit)
	{
	
		if(!reinit)
		{
			$timeout(function(){
				$scope.ui.holidayEnd.refreshMo();
				$scope.ui.holidayEnd.refreshYear();
				$scope.ui.holidayEnd.refreshDay();
				}, 0);
		}
		else
		{
			var date = new Date(); //$scope.settings.houseHolidayEnd*1000
					
			var _year = date.getYear();
			var _month = date.getMonth();
			var _day = date.getDate();
			
			if (_year%4 == 0)	
				$scope.ui.validDaysInMounth[1] = 29;
			else
				$scope.ui.validDaysInMounth[1] = 28;
				
			var yopts=[];
			
			for(var i=_year;i<_year+10;i++)
			{
				yopts.push(""+(i+1900));
			}	
			$scope.ui.holidayEnd.yearOptions = yopts;

			$scope.ui.holidayEnd.mo = _month;
			$scope.ui.holidayEnd.day = _day-1;
			$scope.ui.holidayEnd.year = 0;
			
			$scope.ui.holidayEnd.daysInCurrentMo = $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];
		}
	
	}
	
	$scope.ui.holidayEnd.unwatchMo = $scope.$watch('ui.holidayEnd.mo', function(newVal) 
	{
		if (typeof newVal != 'undefined' && $scope.ui.holidayEnd.yearOptions.length > 0) 
		{
			if (parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.year])%4 == 0)	
				$scope.ui.validDaysInMounth[1] = 29;
			else
				$scope.ui.validDaysInMounth[1] = 28;
				
			$scope.ui.holidayEnd.daysInCurrentMo = $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];
		}
	});
	
	$scope.ui.holidayEnd.unwatchYear = $scope.$watch('ui.holidayEnd.year', function(newVal) 
	{
		if (typeof newVal != 'undefined' && $scope.ui.holidayEnd.yearOptions.length > 0) 
		{
			if (parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.year])%4 == 0)	
				$scope.ui.validDaysInMounth[1] = 29;
			else
				$scope.ui.validDaysInMounth[1] = 28;
				
			$scope.ui.holidayEnd.daysInCurrentMo = $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];
		}
	});
	
	
	$scope.$on('destroy', function() {
            // Unbind events
            $scope.ui.holidayEnd.unwatchMo();
			$scope.ui.holidayEnd.unwatchYear();
          });
	
	$scope.$on('$ionicView.beforeEnter', function() 
	{
		$timeout(function()
		{
			$scope.settings = settings.get('settings');

			if($scope.settings == null)
			{
				$scope.defaultSettings();
			}
			$scope.oldSettings = JSON.parse(JSON.stringify($scope.settings));
			
			$scope.refreshHolidayControls(true);
		});
	});
	
	$scope.$on('$ionicView.beforeLeave', function() 
	{
		//$scope.settings.houseHolidayEnd = DATE($scope.ui.holidayEnd.day, $scope.ui.holidayEnd.mo, $scope.ui.holidayEnd.year)
		//$scope.settings.houseHolidayTemperature = $scope.ui.holidayTemp;
	
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
			settingsVersion:1,
			serverURL : "ws://192.168.0.103",
			houseHoliday:true,
			houseHolidayEnd:1447910991,
			houseHolidayTemperature:18.0,
			houseHolidayMinTemperature:16.0,
			houseHolidayMaxTemperature:27.0
			};
		//$state.go('app.house');
	}
});