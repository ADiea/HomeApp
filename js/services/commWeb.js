ionicApp.factory('commWeb',function(){
	
	var commWeb = {
		pktSeq:0
	};
	
	commWeb.getSequence = function getSequence()
	{
		return commWeb.pktSeq++;
	}
	
	commWeb.skipInt = function skipInt( string)
	{
		var ret={};
		var i;
		i = string.indexOf(";");
		
		if(i != -1)
		{		
			ret.result = parseInt(string.substring(0, i));
			ret.err = isNaN(ret.result);
			ret.str = string.substring(i+1);
		}
		else ret.err = true;
		
		return ret;		
	}
	
	commWeb.skipFloat = function skipFloat( string)
	{
		var ret={};
		var i;
		i = string.indexOf(";");
		
		if(i != -1)
		{
			ret.result = parseFloat(string.substring(0, i));
			ret.err = isNaN(ret.result);
			ret.str = string.substring(i+1);
		}
		else ret.err = true;
		
		return ret;
	}
	
	commWeb.skipString = function skipString( string)
	{
		var ret={};
		var i;
		var done = false;
		
		ret.result = "";
		
		while(!done)
		{
			i = string.indexOf(";");
			if(i == -1)
			{
				ret.err = true;
				ret.str = string;
				done = true;
				break;
			}
			
			if(string.charAt(i-1) == "\\")
			{
				ret.result += string.substring(0, i-1) + ';';
				string = string.substring(i+1);
			}
			else
			{
				ret.result += string.substring(0, i);
				ret.str = string.substring(i+1);
				done = true;
				ret.err = false;
			}
		}
		return ret;
	}
	
	commWeb.eDeviceTypes = {
	
		devTypeLight:0,
		devTypeTH:1,
		devTypeHeater:2,
	
	},
	
	commWeb.eCommWebErrorCodes = {
		cwErrSuccess:0,
		cwErrNotImplemented:1,
		cwErrInvalidPacketID:2,
		cwErrFunctionNotImplemented:3,
		cwErrInvalidDeviceID:4,
		cwErrDeviceDoesNotAnswer:5,
		cwErrInvalidCommandParams:6,
	};

	commWeb.eCommWebMsgTYpes = {
		cwReplyToCommand:0,

		cwGetLights:1,
		cwReplyLights:2,
		cwSetLightParams:3,
		cwNotifyLightStatus:4,

		cwGetDevicesOfType:5,
		cwReplyDevicesOfType:6,
		cwSetTHParams:7,
		cwGetConfortStatus:8,
		cwReplyConfortStatus:9,
		cwNotifyTHStatus:10,

		cwGetRadioFMs:11,
		cwReplyRadioFMs:12,
		cwSetRadioFMParams:13,

		cwGetMovements:14,
		cwReplyMovements:15,
		cwSetMovementParams:16,
		cwNotifyMovementStatus:17,
		
		cwSetHeaterParams:18,
		cwPrintDebugInformation:19,

		cwSpecialCommand:20,


	//	cwGetDevices:,
	//	cwReplyDeviceList:,

		//plant sensors
		//plantwatering

		cwMaxId:18,
	};
	
	return commWeb;
})