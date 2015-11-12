var _SettingsCtrl = ionicApp.controller('SettingsCtrl', function($scope, settings, $state, socket) 
{
	$scope.settings = {};
	$scope.oldSettings = {};
	$scope.ui = 
	{
		holidayShow:false,
		holidayStart:
		{
			mo:'Oct', 
			day:'22',
			year:'2015',
			moOptions:[],
			dayOptions:[],
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
				
				$scope.ui.holidayStart.moOptions = [];
				for(var i=1;i<13;i++)
				{
					var obj={id:i, type:1};
					obj.value = "L_"+i;
					
					$scope.ui.holidayStart.moOptions.push(obj);
				}
				
				$scope.ui.holidayStart.dayOptions = [];
				for(var i=1;i<32;i++)
				{
					var obj={id:i, type:1};
					obj.value = ""+i;
					
					$scope.ui.holidayStart.dayOptions.push(obj);
				}				
				
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
	
	//////////////////////////////////
	
	
	 
    $scope.monthOptions = function  monthOptions()
	{
	return [{
	id:0,
      type:1,
      value: 'Ian'
    }, {
	id:1,
      type:1,
      value: 'Feb'
    }, {
	id:2,
      type:1,
      value: 'Mar'
    }, {
	id:3,
      type:1,	
      value: 'Apr'
    }, {
	id:4,
      type:1,
      value: 'Mai'
    }, {
	id:5,
     type:1,
      value: 'Iun'
    }, {
	id:6,
     type:1,
      value: 'Iul'
    }, {
	id:7,
      type:1,
      value: 'Aug'
    }, {
	id:8,
      type:1,
      value: 'Sep'
    }, {
	id:9,
      type:1,
      value: 'Oct'
    }, {
	id:10,
      type:1,
      value: 'Noi'
    }, {
	id:11,
	  type:1,
      value: 'Dec'
    }];
	}
});