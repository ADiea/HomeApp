ionicApp.factory('Lang',function(SettingsService, LogDataService){
	
	var lang = {
		_langId: 1,
		_s: [
		
		{'sRomana':'Romana', 'sEnglish':'Engleza', 'sLanguage':'Limba'}, 
		{'sRomana':'Romanian', 'sEnglish':'English', 'sLanguage':'Language'}
		
		]
	};
	
	LogDataService.addLog("FACTORY: LANGUAGE", "#f00");
	
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