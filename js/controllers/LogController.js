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
	
	$scope.getLogName = function getLogName()
	{
		var d = new Date();
		var y = d.getFullYear();
		var m = d.getMonth() + 1;
		var day = d.getDate();
		var min = d.getMinutes();
		var h = d.getHours();
		
		if(m<10) m = '0'+m;
		if(day<10) day = '0'+day;
		if(min<10) min = '0'+min;
		if(h<10) h = '0'+h;
		
		
		
		return y + '' + m + '' + day + '' + h + '' + min + "_homeApp.log";
	}
});