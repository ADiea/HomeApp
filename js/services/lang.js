ionicApp.factory('Lang',function(SettingsService, LogDataService){
	
	var lang = {
		_langId: 1,
		_s: [
		
		{
		'sRomana':'Romana', 'sEnglish':'Engleza', 'sLanguage':'Limba', 'sHoliday':'Mod Vacanta', 
		'sBaseIP':'IP', 'sUntilHoliday':'pana pe', 'sInactiveHoliday':'Dezactivat', 'sFactorySettings':'Setari Fabrica',
		'sSetTitle':'Setari', 'sJan':'Ianuarie', 'sFeb':'Februarie', 'sMar':'Martie', 'sApr':'Aprilie',
		'sMay':'Mai', 'sJun':'Iunie', 'sJul':'Iulie', 'sAug':'August', 'sSep':'Septembrie',
		'sOct':'Octombrie', 'sNov':'Noiembrie', 'sDec':'Decembrie', 'sOnHoliday':'In vacanta!',
		'sTemp':'Temperatura', 'sRet':'Retur', 'sMenu':'Meniu', 'sHome':'Acasa', 'sLights':'Lumini',
		'sHeating':'Incalzire', 'sFMRadio':'Muzica', 'sTests':'Teste', 'sLog':'Log', 'sHoliday2':'vacanta',
		'sToday':'astazi', 'sDays':'zile', 'sSched':'Program', 'sStatist':'Istoric', 'sHealth':'Sanatate',
		'sVery':'foarte', 'sDry':'uscat', 'sDump':'umed', 'sOptim':'optim', 'sActiveHol':'activ',
		'sTimeslot':'', 'sDecPt':',', 'sFactorySettingsDescr':'Doriti revenirea la setarile din fabrica?', 'sLithuanian':'Lituaniana', /*'':'',
		/*'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		/*'':'', '':'', '':'', '':'', '':'',*/
		}, 
		{
		'sRomana':'Romanian', 'sEnglish':'English', 'sLanguage':'Language', 'sHoliday':'Holiday', 
		'sBaseIP':'IP', 'sUntilHoliday':'until', 'sInactiveHoliday':'Disabled', 'sFactorySettings':'Factory Settings',
		'sSetTitle':'Settings', 'sJan':'January', 'sFeb':'February', 'sMar':'March', 'sApr':'April',
		'sMay':'May', 'sJun':'June', 'sJul':'July', 'sAug':'August', 'sSep':'September',
		'sOct':'October', 'sNov':'November', 'sDec':'December', 'sOnHoliday':'On Holiday!',
		'sTemp':'Temperature', 'sRet':'Return', 'sMenu':'Menu', 'sHome':'Home', 'sLights':'Lights',
		'sHeating':'Heating', 'sFMRadio':'Music', 'sTests':'Tests', 'sLog':'Log', 'sHoliday2':'holiday',
		'sToday':'today', 'sDays':'days', 'sSched':'Schedule', 'sStatist':'Statistics', 'sHealth':'Health',
		'sVery':'very', 'sDry':'dry', 'sDump':'humid', 'sOptim':'normal', 'sActiveHol':'enabled',
		'sTimeslot':'', 'sDecPt':'.', 'sFactorySettingsDescr':'Reset to factory settings?', 'sLithuanian':'Lithuanian', /*'':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		/*'':'', '':'', '':'', '':'', '':'',*/
		}, 
		{
		'sRomana':'rumunu', 'sEnglish':'Anglu', 'sLanguage':'Kalba', 'sHoliday':'Svente', 
		'sBaseIP':'IP', 'sUntilHoliday':'iki', 'sInactiveHoliday':'Išjungta', 'sFactorySettings':'Gamykliniai nustatymai',
		'sSetTitle':'Nustatymai', 'sJan':'Sausis', 'sFeb':'vasaris', 'sMar':'Kovas', 'sApr':'balandis',
		'sMay':'Geguže', 'sJun':'birželis', 'sJul':'liepa', 'sAug':'Rugpjutis', 'sSep':'rugsejis',
		'sOct':'spalis', 'sNov':'lapkritis', 'sDec':'gruodis', 'sOnHoliday':'Atostogose',
		'sTemp':'Temperatura', 'sRet':'Grižti', 'sMenu':'Valgiaraštis', 'sHome':'Pagrindinis', 'sLights':'Žibintai',
		'sHeating':'Kaitinimas', 'sFMRadio':'Muzika', 'sTests':'Testai', 'sLog':'Prisijungti', 'sHoliday2':'švente',
		'sToday':'šiandien', 'sDays':'dienu', 'sSched':'Tvarkaraštis', 'sStatist':'Statistika', 'sHealth':'Sveikatos',
		'sVery':'labai', 'sDry':'sausas', 'sDump':'dregnas', 'sOptim':'normalus', 'sActiveHol':'ijungta',
		'sTimeslot':'', 'sDecPt':'.', 'sFactorySettingsDescr':'Atstatyti gamyklinius nustatymus?', 'sLithuanian':'Lietuvos', /*'':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		'':'', '':'', '':'', '':'', '':'',
		/*'':'', '':'', '':'', '':'', '':'',*/
		}
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
			s = s || str;
		}
		catch(ex)
		{
			LogDataService.addLog("LANG: ex for str:" + str, "#f00");
		}
		return s;
	}

	return lang;
})