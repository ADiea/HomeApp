ionicApp.factory('Util',function(Lang, LogDataService, $interval, $ionicPopup){
	
	var util = {
		
	};
	
	LogDataService.addLog("FACTORY: UTIL", "#f00");
	
	util.isFunction = function isFunction(functionToCheck) 
	{
		 var getType = {};
		 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}
	
	util.getTempInt =  function (val) 
	{
		return parseInt(val) + Lang.getS('sDecPt');
    }
	
	util.getTempFrac =  function (val) 
	{
		return parseInt(Math.round( val * 10 ) ) % 10;
    }
	
	util.canTempUp =  function canTempUp(obj) 
	{
		var maxTemp;
		if(util.isFunction(obj.maxTemp))
			maxTemp = obj.maxTemp();
		else
			maxTemp = obj.maxTemp;
		
		if(obj.curTemp < maxTemp)
		{
			return true;
		}
		return false;
    }
	
	util.canTempDown =  function canTempDown(obj) 
	{
		var minTemp;
		if(util.isFunction(obj.minTemp))
			minTemp = obj.minTemp();
		else
			minTemp = obj.minTemp;
	
		if(obj.curTemp > minTemp)
		{
			return true;
		}
		return false;
    }
	
	util.doTempUp = function doTempUp(obj)
	{
		if(util.canTempUp(obj))
		{
			obj.curTemp += 0.5;
			obj.isEditing = true;
			try {navigator.notification.vibrate(10);}
			catch(e) {}
		}
	};
	util.doTempDown = function doTempDown(obj)
	{
		if(util.canTempDown(obj))
		{
			obj.curTemp -= 0.5;
			obj.isEditing = true;
			try {navigator.notification.vibrate(10);}
			catch(e) {}
		}
	};
	
	
	util.holdTempSetBtn = function holdTempSetBtn(up, hold, obj)
	{
		util.thermoTempChangeDirectionUp = up;

		
		if (angular.isDefined(util.thermoTempChangeTimer)) 
		{
			$interval.cancel(util.thermoTempChangeTimer);
			util.thermoTempChangeTimer = undefined;
		}

		if(hold)
		{
			obj.isLocked = true;
			util.thermoTempChangeTimer = $interval( function() 
			{
				if(util.thermoTempChangeDirectionUp)
				{
					util.doTempUp(obj);
				}
				else
				{
					util.doTempDown(obj);
				}
			}, 200);
		}
		else
		{
			obj.isLocked  = false;
		}
	}
	
	util.showDevErrorInfo = function showErrorInfoTH(dev)
	{
		var alertPopup = $ionicPopup.alert({
		 title: Lang.getS('sCommErr'),
		 template: Lang.getS('sErrLastData') + dev.title + Lang.getS('sErrReceived') + 
					util.textTimestamp(dev.timestamp).text + Lang.getS('sErrAgo')
	   });
	}
	
	util.textTimestamp = function textTimestamp(date)
	{
		var ret={text:'', sec:0};
		var seconds = Math.floor(((new Date().getTime()/1000) - date)),
		interval = Math.floor(seconds / 31536000);
		ret.sec = seconds;
		
		do
		{
			if (interval > 1) 
			{
				ret.text = interval + Lang.getS('sTsYrs'); break;
			}

			interval = Math.floor(seconds / 2592000);
			if (interval > 1) 
			{
				ret.text =  interval + Lang.getS('sTsMon');	break;
			}

			interval = Math.floor(seconds / 86400);
			if (interval >= 1) 
			{
				ret.text = interval + Lang.getS('sTsDays');	break;
			}

			interval = Math.floor(seconds / 3600);
			if (interval >= 1) 
			{
				ret.text =  interval + Lang.getS('sTsHrs');	break;
			}

			interval = Math.floor(seconds / 60);
			if (interval > 1) 
			{
				ret.text =  interval + Lang.getS('sTsMin');	break;
			}
			
			ret.text = Math.floor(seconds) + Lang.getS('sTsSec');
		
		}while(false);
		
		return ret;
	}

	return util;
})