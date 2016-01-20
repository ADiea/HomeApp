ionicApp.factory('Util',function(Lang){
	
	var util = {
		
	};
	
	LogDataService.addLog("FACTORY: UTIL", "#f00");
	
	util.getTempInt =  function (val) 
	{
		return parseInt(val) + Lang.getS('sDecPt');
    }
	
	util.getTempFrac =  function (val) 
	{
		return parseInt(Math.round( val * 10 ) ) % 10;
    }
	
	util.canTempUp =  function canTempUp(val, max) 
	{
		if(val < max)
		{
			return true;
		}
		return false;
    }
	
	util.canTempDown =  function canTempDown(val, min) 
	{
		if(val > min)
		{
			return true;
		}
		return false;
    }
	
	util.doTempUp = function doTempUp(val, max/*, dirty*/)
	{
		if(val < max)
		{
			val += 0.5;
			try {navigator.notification.vibrate(10);}
			catch(e) {}
		}
	};
	util.doTempDown = function doTempDown(val, min)
	{
		if(val > min)
		{
			val -= 0.5;
			try {navigator.notification.vibrate(10);}
			catch(e) {}
		}
	};
	

	return lang;
})