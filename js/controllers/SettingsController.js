var _SettingsCtrl = ionicApp.controller('SettingsCtrl', function($scope, settings, $state, socket) 
{
	$scope.settings = {};
	$scope.oldSettings = {};
	
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
			socket.reset(socket.s);
		}
	});
	
	$scope.saveSettings = function saveSettings()
	{
		settings.persist('settings', $scope.settings);
		//$state.go('app.house');
	}
	
	$scope.defaultSettings = function defaultSettings()
	{
		$scope.settings = {serverURL : "http://chat.socket.io"};
		//$state.go('app.house');
	}


});