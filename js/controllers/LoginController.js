var _LoginCtrl = ionicApp.controller('LoginCtrl', function($scope, SettingsService, LogDataService, 
																socket, commWeb, $interval, $timeout, 
																$ionicPopup, $ionicModal, Lang, Util, $state) 
{
	$scope.lang = Lang;
	$scope.util = Util;
	
	$scope._sock = socket;
	
	$scope.ui =  {};
	$scope.heartbeat = 0;
	
	$scope.demoHouse = 
	{
		name:"DemoHouse",
		mainNodeID:"aabbccdd11223344",
		lastKnownDirectIP:"192.168.1.1", 
	};
	
	$scope.houseList = [];
	
	$scope.loginHouse = function loginHouse(mainNodeID)
	{
		
	}
	
	$scope.$on('$ionicView.beforeEnter', function() 
	{  
		$timeout(function()
		{
			$scope.houseList = SettingsService.get('houseList');
		});
	});
	
	$scope.$on('$ionicView.afterEnter', function() 
	{  
		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwReportWiFiList, 
			name:"RegisterCtrl",
			//onMessage
			onMessage:function (data) 
			{
				LogDataService.addLog("Msg cwReportWiFiList: " + data);
				
				var numWifiAP, i;
				
				var res = {str:data};
				
				if(commWeb.skipInt(res).err) return;
					numWifiAP = res.result;
					
				$scope.wifiList = [];
				
				for(i=0; i<numWifiAP; ++i)
				{
					var wifiAP={};
					
					if(commWeb.skipString(res).err) return;
					wifiAP.ssid = res.result;
					
					if(commWeb.skipString(res).err) return;
					wifiAP.bssid = res.result;

					if(commWeb.skipString(res).err) return;
					wifiAP.auth = res.result;					
					
					if(commWeb.skipInt(res).err) return;
					wifiAP.ch = res.result;
					
					if(commWeb.skipInt(res).err) return;
					wifiAP.rssi = res.result;

					if(commWeb.skipInt(res).err) return;
					wifiAP.hidden = res.result;					
					
					$scope.wifiList.push(wifiAP);
				}
			},
		});

		socket.setCallbacks({protocol:commWeb.eCommWebMsgTYpes.cwReplyToCommand, 
			name:"RegisterCtrl",
			//onMessage
			onMessage:function (data) 
			{
				LogDataService.addLog("Msg cwReplyToCommand: " + data);
				
				var res={str:data};
				
				if(commWeb.skipInt(res).err) return;
				
				if(res.result == commWeb.eCommWebErrorCodes.cwErrSuccess)
				{
					if(commWeb.skipInt(res).err) return;
					if(res.result == commWeb.eCommWebMsgTYpes.cwReportWiFiList)
					{
						//last wifi scan started
					}
				}
			},
		});

		socket.connectSocket();
		
		$scope.scanWifiAPList();
		
		$scope.registerViewUpdate = $interval( function() 
		{
			$scope.heartbeat++;
			
			if($scope.heartbeat % 5 == 0)
			{
				if(!socket.isAlive())
				{
					socket.connectSocket(true);
				}
			}			
			
			if($scope.heartbeat % 20 == 0)
			{
				//...
			}
		}, 1000);	
	});
	
	$scope.$on('$ionicView.beforeLeave', function() 
	{ 
	  SettingsService.persist('settings', $scope.settings);
	  
	  if (angular.isDefined($scope.registerViewUpdate)) 
	  {
		$interval.cancel($scope.registerViewUpdate);
		$scope.registerViewUpdate = undefined;
	  }
	});
	
	$scope.$on('$destroy', function() 
	{
	  if (angular.isDefined($scope.registerViewUpdate)) 
	  {
		$interval.cancel($scope.registerViewUpdate);
		$scope.registerViewUpdate = undefined;
	  }
	});

});