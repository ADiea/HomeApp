var _logCtrl = ionicApp.controller('LogCtrl', function($scope, LogDataService, Lang) 
{
	$scope.lang = Lang;
	$scope.logData = LogDataService.getLogData();

	$scope.logTextDisplay = '';
	$scope.logTextDownload = '';
	$scope.lastLogSize = 0;

	$scope.getLogText = function getLogText()
	{
		var len = $scope.logData.length, i=0;

		if($scope.lastLogSize != len)
		{
			$scope.lastLogSize = len;
			$scope.logTextDisplay = '';
			$scope.logTextDownload = '';

			for(i = len-1;i >= 0; i--)
			{
				$scope.logTextDisplay += $scope.logData[i].log + '\n';
			}

			for(i = 0; i<len; i++)
			{
				$scope.logTextDownload += $scope.logData[i].log + '\n';
			}
		}
		return $scope.logTextDisplay;
	}

	$scope.getLogTextSafe = function getLogTextSafe()
	{
		return window.encodeURIComponent($scope.logTextDownload);
	}
});