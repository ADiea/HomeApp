var _FMCtrl = ionicApp.controller('FMRadioCtrl', function($scope, settings) 
{
	$scope.settings = settings;// = {serverIP : "192.168.0.6"};
	
	$scope.radioTitle = "Bathroom Radio";
	
	$scope.radioOn = true;
});