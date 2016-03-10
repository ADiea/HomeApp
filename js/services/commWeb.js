ionicApp.factory('commWeb',function(){
	
	var commWeb = {
		pktSeq:0
	};
	
	commWeb.WsWebProto = 
	{
		//operation code 
		wsOP_cliHello:0,
		wsOP_servHello:1,
		wsOP_cliLogin:2,
		wsOP_msgRelay:3,
		wsOP_msgSpecial:4,
		wsOP_positiveAck:5,
		wsOP_negativeAck:6,
		
		//subopCodes
		wsOP_srvDebugConn:0,
		
		//message keys
		wsKey_clientType:0,
		
		//message values
		wsValue_homeBase:0,
		wsValue_webBrowser:1,
		wsValue_mobileApp:2,
		wsValue_unknown:3,
		
		//connection states
		wsState_new:0,
		wsState_hello:1,
		wsState_conn:2,
		wsState_inval:3,
	};
	
	commWeb.getSequence = function getSequence()
	{
		return commWeb.pktSeq++;
	}
	
	commWeb.skipInt = function skipInt( ret)
	{
		var i;
		i = ret.str.indexOf(";");
		
		if(i != -1)
		{		
			ret.result = parseInt(ret.str.substring(0, i));
			ret.err = isNaN(ret.result);
			ret.str = ret.str.substring(i+1);
		}
		else ret.err = true;
		
		return ret;		
	}
	
	commWeb.skipFloat = function skipFloat( ret)
	{
		var i;
		i = ret.str.indexOf(";");
		
		if(i != -1)
		{
			ret.result = parseFloat(ret.str.substring(0, i));
			ret.err = isNaN(ret.result);
			ret.str = ret.str.substring(i+1);
		}
		else ret.err = true;
		
		return ret;
	}
	
	commWeb.skipString = function skipString( ret)
	{
		var i;
		var done = false;
		
		ret.result = "";
		
		while(!done)
		{
			i = ret.str.indexOf(";");
			if(i == -1)
			{
				ret.err = true;
				done = true;
				break;
			}
			
			if(ret.str.charAt(i-1) == "\\")
			{
				ret.result += ret.str.substring(0, i-1) + ';';
				ret.str = ret.str.substring(i+1);
			}
			else
			{
				ret.result += ret.str.substring(0, i);
				ret.str = ret.str.substring(i+1);
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
		cwNotifyGenericDeviceStatus:21,
		cwSetGenericDeviceParams:22,

		cwGetGenericDeviceLogs:23,
		cwReplyGenericDeviceLogs:24,
	//	cwGetDevices:,
	//	cwReplyDeviceList:,

		//plant sensors
		//plantwatering

		cwMaxId:25,
	};
	
	return commWeb;
})