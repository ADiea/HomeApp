ionicApp.factory('lang',function(SettingsService, LogDataService){
	
	var lang = {
		_langId: 1,
		_s: [
		
		{'sRomana':'Romana', 'sEnglish':'Engleza'}, 
		{'sRomana':'Romanian', 'sEnglish':'English'}
		
		]
	};
	
	LogDataService.addLog("LANGUAGE FACTORY", "#f00");
	
	lang.set =  function (language) 
	{
		lang._langId = language;
    }
	
	lang.getS = function getS(str)
	{
		var s = "";
		try{
			s = lang._s[lang._langId][str];
		}
		catch(ex)
		{
			LogDataService.addLog("LANG: ex for str:" + str, "#f00");
		}
		return s;
	}

	return lang;
})