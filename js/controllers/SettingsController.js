var _SettingsCtrl = ionicApp.controller('SettingsCtrl', function($scope, $state, socket, $timeout, $interval, $ionicPopup, $ionicModal, SettingsService, Lang, Util) 
{
	$scope.util = Util;
	$scope.settings = {};
	$scope.oldSettings = {};
	
	$scope.settingsLang = Lang;
	
	$scope.getHolidayEndDate = function getHolidayEndDate()
	{
		/*{{ui.holidayEnd.dayOptions[ui.holidayEnd.real_day]}} 
								{{settingsLang.getS(ui.holidayEnd.moOptions[ui.holidayEnd.real_mo])}} 
								{{ui.holidayEnd.yearOptions[ui.holidayEnd.real_year]}}
								*/
		return "21 oct 2016";						
	
	}
	
	$scope.editHoliday = function editHoliday()
	{
		$state.go('app.holiday');
	}
	
	$scope.ui = 
	{

		lang:
		{
			langId:0,
			refreshLang : null,
			langOptions : ['sRomana', 'sEnglish', 'sLithuanian']
		},
		
	};
	
	$scope.ui.lang.unwatchLang = $scope.$watch('ui.lang.langId', function(newVal) 
	{
		if (typeof newVal != 'undefined') 
		{
			Lang.set(newVal);
		}
	});
	
	
	$scope.refreshHolidayControls = function refreshHolidayControls(reinit)
	{
		if(!reinit)
		{
			$timeout(function(){
				//$scope.ui.holidayEnd.refreshMo();
				
				}, 0);
		}
		else
		{
		
		}
	}
	
	$scope.$on('destroy', function() {
        // Unbind events
		$scope.ui.lang.unwatchLang();
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
		//var d = new Date(parseInt($scope.ui.holidayEnd.yearOptions[$scope.ui.holidayEnd.real_year]), $scope.ui.holidayEnd.real_mo, $scope.ui.holidayEnd.real_day+1);
		//$scope.settings.houseHolidayEnd = d.getTime() / 1000 | 0;
	
		SettingsService.persist('settings', $scope.settings);
		
		if($scope.settings.serverURL != $scope.oldSettings.serverURL)
		{
			socket.connectSocket(true);
		}
		
/*		
		try { window.plugins.toast.showShortCenter("Setari salvate",function(a){},function(b){}); }
		catch(e){}
*/		
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
			 title: Lang.getS('sFactorySettings'),
			 template: Lang.getS('sFactorySettingsDescr')
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
		if(Lang._langId == 0)
		{
			return Lang.getS('sRomana');
		}
		else
		{
			return Lang.getS('sEnglish');
		}
	}
});