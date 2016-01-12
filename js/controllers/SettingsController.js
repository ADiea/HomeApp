var _SettingsCtrl = ionicApp.controller('SettingsCtrl', function($scope, $state, socket, $timeout, $interval, $ionicPopup, $ionicModal, SettingsService, lang) 
{
	$scope.settings = {};
	$scope.oldSettings = {};
	$scope.ui = 
	{
		houseHolidayTemperature:0,
		holidayShow:false,
		houseHoliday:false,
		holidayEditPopupVisible:false,
		holidayEnd:
		{
			mo:0, 
			day:0,
			year:0,
			real_mo:0, 
			real_day:0,
			real_year:0,
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
			if($scope.ui.houseHolidayTemperature < $scope.settings.houseHolidayMaxTemperature) 
			{
				$scope.ui.houseHolidayTemperature += 0.5;
				try {navigator.notification.vibrate(10);}
				catch(e) {}
			}
		},
		doTempDown: function doTempDown()
		{
			if($scope.ui.houseHolidayTemperature > $scope.settings.houseHolidayMinTemperature) 
			{
				$scope.ui.houseHolidayTemperature -= 0.5;
				try { navigator.notification.vibrate(10); }
				catch(e) {}
			}
		},
		getHolidayTempInt : function getHolidayTempInt()
		{
			return parseInt($scope.ui.houseHolidayTemperature);
		},	
		getHolidayTempFrac : function getHolidayTempFrac()
		{
			return parseInt(Math.round($scope.ui.houseHolidayTemperature * 10 ) ) % 10;
		},
		validDaysInMounth: [31, 28, 31, 30, 31, 30, 31, 
							31, 30, 31, 30, 31],
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
	
	/*MODAL Holiday*/
	
	$scope.modalHolidayCreated = false;
	
	$scope.unwatchHoliday = $scope.$watch('settings.houseHoliday', function(newVal, oldVal) {
	if (typeof newVal != 'undefined' && typeof oldVal != 'undefined' && newVal != oldVal && newVal == true) 
	{
		$scope.editHoliday();
	}
	});

	$scope.editHoliday = function editHoliday()
	{
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
		
		$scope.ui.houseHolidayTemperature = $scope.settings.houseHolidayTemperature;
		$scope.ui.houseHoliday = true;
		
		$scope.ui.holidayEditPopupVisible = true;
		
		if(!$scope.modalHolidayCreated)
		{
			$scope.modalHolidayCreated = true;
			$ionicModal.fromTemplateUrl('views/editHoliday.html', {scope: $scope}).
			then(
				function(modal) 
				{
					$scope.modalHoliday = modal;
					
					$scope.refreshHolidayControls(false);
					$timeout(function()
					{
						$scope.modalHoliday.show();
					});
				});
		}
		else
		{
			$scope.refreshHolidayControls(false);
			$timeout(function()
			{
				$scope.modalHoliday.show();
			});
		}
	};
	
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) 
	{
		if($scope.ui.holidayEditPopupVisible)
		{
			$scope.closeHolidayMode(false);
			try { window.plugins.toast.showShortCenter("Cancelled",function(a){},function(b){}); }
			catch(e){}
		}
	});
  
	$scope.closeHolidayMode = function closeHolidayMode(hidePopup)
	{	
		$scope.ui.houseHolidayTemperature = $scope.settings.houseHolidayTemperature;
		$scope.ui.holidayEnd.mo = $scope.ui.holidayEnd.real_mo; 
		$scope.ui.holidayEnd.day = $scope.ui.holidayEnd.real_day;
		$scope.ui.holidayEnd.year = $scope.ui.holidayEnd.real_year;
		
		$scope.ui.holidayEditPopupVisible = false;
		
		$scope.ui.holidayEnd.unwatchMo();
		$scope.ui.holidayEnd.unwatchYear();
		
		if(hidePopup)
			$scope.modalHoliday.hide();
	}
	
	$scope.isDateInThePast = function isDateInThePast(year, month, day)
	{
		var date = new Date();

		var _year = date.getYear()+1900;
		var _month = date.getMonth();
		var _day = date.getDate() - 1;
		
		do
		{
			if(year > _year)
				break;
			else if(year == _year)
			{
				if(month > _month)
					break;			
				else if(month == _month)
				{
					if(day > _day)
						break;
					else if(day == _day)
					{
						return 0;
					}
				}
			}
			return -1;
		}while(0);
		return 1;
	}
	
	$scope.closeHolidayModeAndSave = function closeHolidayModeAndSave()
	{
		var dateSign = $scope.isDateInThePast(parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.year]), 
												$scope.ui.holidayEnd.mo,
												$scope.ui.holidayEnd.day);
		var message = "";
		
		if(dateSign > 0 || !$scope.ui.houseHoliday)
		{
			$scope.ui.holidayEnd.unwatchMo();
			$scope.ui.holidayEnd.unwatchYear();
			$scope.modalHoliday.hide();
			
			$scope.settings.houseHoliday = $scope.ui.houseHoliday;
			
			if($scope.ui.houseHoliday)
			{
				message = "Modul vacanta activat. Calatorie placuta!";
				
				$scope.ui.holidayEnd.real_mo = $scope.ui.holidayEnd.mo; 
				$scope.ui.holidayEnd.real_day = $scope.ui.holidayEnd.day;
				$scope.ui.holidayEnd.real_year = $scope.ui.holidayEnd.year;
				$scope.settings.houseHolidayTemperature = $scope.ui.houseHolidayTemperature;
			}
			else
			{	
				message = "Modul vacanta dezactivat.";
			}
		}
		else 
		{
			if(dateSign == 0)
				message = "Data intoarcerii nu poate fi astazi!";
			else
				message = "Data intoarcerii nu poate fi in trecut!";
		}
		
		try { window.plugins.toast.showShortCenter(message,function(a){},function(b){}); }
		catch(e){}
	}
	
	/*end modal holiday*/
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
			var date = new Date($scope.settings.houseHolidayEnd*1000);
					
			var _year = date.getYear() + 1900;
			var _month = date.getMonth();
			var _day = date.getDate() - 1;
			
			//auto disable holiday mode if date in present or past
			if($scope.isDateInThePast(_year, _month, _day) <= 0)
			{
				$scope.settings.houseHoliday = false;
			}
			
			if (_year%4 == 0)	
				$scope.ui.validDaysInMounth[1] = 29;
			else
				$scope.ui.validDaysInMounth[1] = 28;
				
			var yopts=[];
			
			for(var i=_year;i<_year+10;i++)
			{
				yopts.push(""+(i));
			}	
			$scope.ui.holidayEnd.yearOptions = yopts;

			$scope.ui.holidayEnd.mo = _month;
			$scope.ui.holidayEnd.day = _day;
			$scope.ui.holidayEnd.year = 0;
			
			$scope.ui.holidayEnd.real_mo = $scope.ui.holidayEnd.mo; 
			$scope.ui.holidayEnd.real_day = $scope.ui.holidayEnd.day;
			$scope.ui.holidayEnd.real_year = $scope.ui.holidayEnd.year;
			
			$scope.ui.holidayEnd.daysInCurrentMo = $scope.ui.validDaysInMounth[$scope.ui.holidayEnd.mo];
		}
	}
	
	$scope.$on('destroy', function() {
        // Unbind events
		$scope.unwatchHoliday();
	});
	
	$scope.$on('$ionicView.beforeEnter', function() 
	{
		$timeout(function()
		{
			$scope.settings = SettingsService.get('settings');

			if($scope.settings == null)
			{
				$scope.defaultSettings();
			}
			$scope.oldSettings = JSON.parse(JSON.stringify($scope.settings));
			
			$scope.refreshHolidayControls(true);
			
		});//timeout
	});
	
	$scope.$on('$ionicView.beforeLeave', function() 
	{
		var d = new Date(parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.real_year]), $scope.ui.holidayEnd.real_mo, $scope.ui.holidayEnd.real_day+1);
		$scope.settings.houseHolidayEnd = d.getTime() / 1000 | 0;
	
		SettingsService.persist('settings', $scope.settings);
		
		if($scope.settings.serverURL != $scope.oldSettings.serverURL)
		{
			socket.connectSocket(true);
		}
		
		try { window.plugins.toast.showShortCenter("Setari salvate",function(a){},function(b){}); }
		catch(e){}
		
		return;
	});
	
	$scope.saveSettings = function saveSettings()
	{
		SettingsService.persist('settings', $scope.settings);
	}
	
	$scope.defaultSettings = function defaultSettings(showConfirm)
	{
		$scope.settings = 
		{
			settingsVersion:1,
			serverURL : "ws://192.168.0.103",
			houseHoliday:false,
			houseHolidayEnd:1447910991,
			houseHolidayTemperature:18.0,
			houseHolidayMinTemperature:16.0,
			houseHolidayMaxTemperature:27.0
		};
	}

	$scope.defaultSettingsConfirm = function defaultSettingsConfirm()
	{
		var confirmPopup = $ionicPopup.confirm({
			 title: 'Setari fabrica',
			 template: 'Doriti revenirea la setarile din fabrica?'
		   });
		confirmPopup.then(function(res) 
		{
			if(res) 
			{
				$scope.defaultSettings();
			} 
	   });
	}	
	
	$scope.getLanguage = function getLanguage()
	{
		if(lang._langId == 0)
		{
			return lang.getS('sRomana');
		}
		else
		{
			return lang.getS('sEnglish');
		}
	}
});