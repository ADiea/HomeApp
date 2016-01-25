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
		'sTimeslot':'Interval', 'sDecPt':',', 'sFactorySettingsDescr':'Doriti revenirea la setarile din fabrica?', 'sLithuanian':'Lituaniana', 'sBetween':'intre',
		'sMon':'Lu', 'sTue':'Ma', 'sWed':'Mi', 'sThu':'Jo', 'sFri':'Vi',
		'sSat':'Sa', 'sSun':'Du', 'sNewSlot':'Adauga interval nou', 'sHrs':'ore', 'sMins':'min',
		'sCommErr':'Problema comunicatie', 'sErrLastData':'Ultimele date de la ', 'sErrReceived':' primite acum', 'sErrAgo':' ', 'sTsYrs':' ani',
		'sTsMon':' luni', 'sTsDays':' zile', 'sTsHrs':' ore', 'sTsMin':' min', 'sTsSec':' s',
		'sUntilHr':' pana la ', 'sSensorDis':'senzor inactiv', 'sHolidayQue':'Parasiti modul vacanta?', '':'', '':'',
		/*'':'', '':'', '':'', '':'', '':'',
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
		'sTimeslot':'Slot', 'sDecPt':'.', 'sFactorySettingsDescr':'Reset to factory settings?', 'sLithuanian':'Lithuanian', 'sBetween':'between',
		'sMon':'Mon', 'sTue':'Tue', 'sWed':'Wed', 'sThu':'Thu', 'sFri':'Fri',
		'sSat':'Sat', 'sSun':'Sun', 'sNewSlot':'New time slot', 'sHrs':' hours', 'sMins':' mins',
		'sCommErr':'Device offline', 'sErrLastData':'Last data from ', 'sErrReceived':' received ', 'sErrAgo':' ago', 'sTsYrs':' yrs',
		'sTsMon':' mons', 'sTsDays':' days', 'sTsHrs':' hrs', 'sTsMin':' min', 'sTsSec':' s',
		'sUntilHr':' until ', 'sSensorDis':'sensor is disabled', 'sHolidayQue':'Turn off holiday mode?', '':'', '':'',
		/*'':'', '':'', '':'', '':'', '':'',
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
		'sTimeslot':'', 'sDecPt':'.', 'sFactorySettingsDescr':'Atstatyti gamyklinius nustatymus?', 'sLithuanian':'Lietuvos', 'sBetween':'',
		'sMon':'', 'sTue':'', 'sWed':'', 'sThu':'', 'sFri':'',
		'sSat':'', 'sSun':'', 'sNewSlot':'', 'sHrs':'', 'sMins':'',
		'sCommErr':'', 'sErrLastData':'', '':'sErrReceived', 'sErrAgo':'', 'sTsYrs':'',
		'sTsMon':'', 'sTsDays':'', 'sTsHrs':'', 'sTsMin':'', 'sTsSec':'',
		'sUntilHr':' iki ',  'sSensorDis':'', 'sHolidayQue':'', '':'', '':'',
		/*'':'', '':'', '':'', '':'', '':'',
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