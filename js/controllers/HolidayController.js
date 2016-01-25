var _HolidayCtrl = ionicApp.controller('HolidayCtrl', function($scope, $state, socket, $timeout, 
$interval, $ionicPopup, $ionicModal, SettingsService, Lang, Util, $ionicHistory ) 
{
	$scope.util = Util;
	$scope.settings = {};
	$scope.lang = Lang;
	
	$scope.ui = 
	{
		houseHolidayTemperature:{
			curTemp:0, 
			minTemp:function(){return $scope.settings.houseHolidayMinTemperature;},
			maxTemp:function(){return $scope.settings.houseHolidayMaxTemperature;},
			isEditing:false,
			isLocked:false
		},
		holidayShow:false,
		houseHoliday:false,

		holidayEnd:
		{
			mo:0, 
			day:0,
			year:0,
			real_mo:0, 
			real_day:0,
			real_year:0,
			moOptions:["sJan", "sFeb", "sMar", "sApr", "sMay", "sJun", 
						"sJuly", "sAug", "sSep", "sOct", "sNov", "sDec" ],
			dayOptions:["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", 
						"16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
			yearOptions:[],
			daysInCurrentMo:0,
			refreshMo:null, refreshYear:null, refreshDay:null
		},
		validDaysInMounth: [31, 28, 31, 30, 31, 30, 31, 
							31, 30, 31, 30, 31],
	};
	
	/*MODAL Holiday*/
  
	$scope.closeHolidayMode = function closeHolidayMode()
	{	
		$scope.ui.houseHolidayTemperature.curTemp = $scope.settings.houseHolidayTemperature;
		$scope.ui.holidayEnd.mo = $scope.ui.holidayEnd.real_mo; 
		$scope.ui.holidayEnd.day = $scope.ui.holidayEnd.real_day;
		$scope.ui.holidayEnd.year = $scope.ui.holidayEnd.real_year;
		
		$ionicHistory.goBack();
	}
	
	$scope.closeHolidayModeAndSave = function closeHolidayModeAndSave(doGoBack)
	{
		var dateSign = $scope.isDateInThePast(parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.year]), 
												$scope.ui.holidayEnd.mo,
												$scope.ui.holidayEnd.day);
		var message = "";
		var goBack = false;
		var autoGoBack = doGoBack || true;
		
		if(dateSign > 0 || !$scope.ui.houseHoliday)
		{
			$scope.settings.houseHoliday = $scope.ui.houseHoliday;
			
			if($scope.ui.houseHoliday)
			{
				message = "Modul vacanta activat. Calatorie placuta!";
				
				$scope.ui.holidayEnd.real_mo = $scope.ui.holidayEnd.mo; 
				$scope.ui.holidayEnd.real_day = $scope.ui.holidayEnd.day;
				$scope.ui.holidayEnd.real_year = $scope.ui.holidayEnd.year;
				$scope.settings.houseHolidayTemperature = $scope.ui.houseHolidayTemperature.curTemp;
			}
			else
			{	
				message = "Modul vacanta dezactivat.";
			}
			
			goBack = true;
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
		
		if(goBack && autoGoBack)
		{
			$ionicHistory.goBack();
		}
	}
	
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
			var realDate = new Date();
			var date = new Date($scope.settings.houseHolidayEnd*1000);
					
			var _year = realDate.getYear() + 1900;
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
	
	$scope.$on('$ionicView.beforeEnter', function() 
	{
		$timeout(function()
		{
			$scope.settings = SettingsService.get('settings');
			
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
			
			$scope.ui.houseHolidayTemperature.curTemp = $scope.settings.houseHolidayTemperature;
			$scope.ui.houseHoliday = $scope.settings.houseHoliday;

			$scope.refreshHolidayControls(true);
			$scope.refreshHolidayControls(false);
			
		});//timeout
	});
	
	$scope.$on('$ionicView.beforeLeave', function() 
	{
		$scope.closeHolidayModeAndSave (false);
	
		var d = new Date(parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.real_year]), $scope.ui.holidayEnd.real_mo, $scope.ui.holidayEnd.real_day+1);
		$scope.settings.houseHolidayEnd = d.getTime() / 1000 || 0;
	
		SettingsService.persist('settings', $scope.settings);
		
		$scope.ui.holidayEnd.unwatchMo();
		$scope.ui.holidayEnd.unwatchYear();
	});
	
	$scope.saveSettings = function saveSettings()
	{
		SettingsService.persist('settings', $scope.settings);
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
});