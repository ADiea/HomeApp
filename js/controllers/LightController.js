var _LightCtrl = ionicApp.controller('LightsCtrl', function($scope, $ionicModal, $interval, socket, logData) 
{
	$scope.houseLights = [
		{id:0, title:"Hall Ceiling", light:{enable:true, dirty:false,
											params:[{id:0, toggled:false, name:"Inty", title:"Intensity", min:30, max:90, cur:60, step:1},
													{id:1, toggled:false, name:"Speed", title:"FadeSpeed", min:1, max:15, cur:5, step:1},
													{id:2, toggled:false, name:"OnTime", title:"OnTime", min:4, max:956, cur:4, step:4},
													{id:3, toggled:false, name:"MinInty", title:"MinIntensity", min:10, max:50, cur:30, step:1}]}},
															
		{id:1, title:"Bath Ceiling", light:{enable:true, dirty:false,
											params:[{id:0, toggled:false, name:"Inty", title:"Intensity", min:10, max:100, cur:20, step:1},
													{id:1, toggled:false, name:"Speed", title:"FadeSpeed", min:1, max:15, cur:5, step:1},
													{id:2, toggled:false, name:"OnTime", title:"OnTime", min:4, max:956, cur:4, step:4},
													{id:3, toggled:false, name:"MinInty", title:"MinIntensity", min:10, max:50, cur:30, step:1}]}},
															
		{id:2, title:"Kitchen Ambient", light:{enable:true, dirty:false,
											params:[{id:0, toggled:false, name:"Inty", title:"Intensity", min:0, max:80, cur:30, step:1},
													{id:1, toggled:false, name:"Speed", title:"FadeSpeed", min:1, max:15, cur:5, step:1},
													{id:2, toggled:false, name:"OnTime", title:"OnTime", min:4, max:956, cur:4, step:4},
													{id:3, toggled:false, name:"MinInty", title:"MinIntensity", min:10, max:50, cur:30, step:1}]}},
	];
	
	$scope.logData = logData;
	
	$scope.logScrollUp = function logScrollUp()
	{
		$ionicScrollDelegate.$getByHandle('logscroll').scrollTop();
	}
	
	$scope.addLog = function addLog(msg)
	{
		var date = new Date();
		$scope.logData.unshift({log:date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + msg});
	}
	
	 socket.on('new message', function (data) {
	 if(data.username)
		$scope.addLog("["+data.username+"] "+data.message);	  
		});
	  
	  socket.on('user joined', function (data) {
		$scope.addLog("Joined: " + data.username);
	  });
	
	$scope.serverAnswer = "notStarted";
	
	$scope.sendToServer = function sendToServer()
	{
			//$scope.houseLights[$scope.modalLight.id].light = $scope.modalLight.light;
		$scope.serverAnswer = "Sent!";
		//$scope.closeLight();
	}

	$ionicModal.fromTemplateUrl('views/light_single.html', {scope: $scope}).then(
		function(modal) 
		{
			$scope.modal = modal;
		});

	// Triggered in the login modal to close it
	$scope.closeLight = function closeLight() 
	{
		$scope.modal.hide();
		
		/*
		$timeout.cancel($scope.timeoutId);
		$scope.timeoutId = null;*/
	};

	$scope.serverSequence = 0;

	// Open the login modal
	$scope.openLight = function openLight(lightId) 
	{
		$scope.modalLight = $scope.houseLights[lightId];
		$scope.modal.show();
		
		socket.emit('add user', $scope.modalLight.title);
		
		$scope.timeoutId = $interval( function() 
		{
			$scope.serverSequence++;
			if($scope.modalLight.dirty)
			{
				$scope.modalLight.dirty = false;
				$scope.serverAnswer = $scope.serverSequence + "_Sending...";

			}
			else
			{
				$scope.serverAnswer = $scope.serverSequence+"_WaitForInput";
			}
		}, 1000);
	};

	$scope.timeoutId = null;


	/*
		var timeoutId = null;
		
		$scope.$watch('data.dimMax', function() 
		{
			if(timeoutId !== null) {

				return;
			}

			timeoutId = $timeout( function() {
				
				console.log('Value:'+$scope.data.dimMax);
				
				$timeout.cancel(timeoutId);
				timeoutId = null;
				
				// Now load data from server 
			}, 300);  
		
			
		});
	*/	


	$scope.rangeChangeCallback = function rangeChangeCallback(sliderObj)
	{ 
		$scope.modalLight.light.params[parseInt(sliderObj.input[0].id)].cur  = sliderObj.from;
		$scope.modalLight.dirty = true;
	}

	$scope.rangeChangeCallbackFinish = function rangeChangeCallback(sliderObj)
	{ 
		$scope.rangeChangeCallback(sliderObj);
		$scope.$apply();
	}
	
	$scope.doUp = function doUp(id)
	{
		var delta = Math.round(($scope.modalLight.light.params[id].max - $scope.modalLight.light.params[id].min)/10);

		$scope.modalLight.light.params[id].cur  += delta;
		
		if($scope.modalLight.light.params[id].cur > $scope.modalLight.light.params[id].max)
			$scope.modalLight.light.params[id].cur = $scope.modalLight.light.params[id].max;
	}
	
	$scope.doDown = function doDown(id)
	{
		var delta = Math.round(($scope.modalLight.light.params[id].max - $scope.modalLight.light.params[id].min)/10);

		$scope.modalLight.light.params[id].cur -= delta;
		if($scope.modalLight.light.params[id].cur < $scope.modalLight.light.params[id].min)
			$scope.modalLight.light.params[id].cur = $scope.modalLight.light.params[id].min;
	}



	/*accordion*/
	  $scope.toggleSettings = function toggleSettings(id) {
		if ($scope.isSettingsShown(id)) 
		  $scope.modalLight.light.params[id].toggle = false;
		else 
		  $scope.modalLight.light.params[id].toggle = true;
	  };
	  
	  $scope.isSettingsShown = function isSettingsShown(id) 
	  {
		if($scope.modalLight.light.params[id].toggle)
			return $scope.modalLight.light.params[id].toggle;
		return false;
	  };
	  


});