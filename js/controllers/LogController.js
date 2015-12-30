var _logCtrl = ionicApp.controller('LogCtrl', function($scope, LogDataService) 
{
	$scope.logData = LogDataService.getLogData();
});