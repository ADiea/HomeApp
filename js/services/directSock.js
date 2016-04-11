ionicApp.factory('directSock',function(SettingsService, LogDataService){
	
	var directSock = {
		_Connected: false,
		_Connecting: false,
		_Socket: null,
		_rxCallback:null,
		_MessageToSend:null,
		_reconnNo:0,
		_lastTimeRX:0,
		_lastTimeTX:0,
		_wasError:false,
		_lastTimeTryConnect:0,
	};
	
	LogDataService.addLog("FACTORY: DIRECT SOCK", "#f00");
	
	directSock.send =  function (message) 
	{
		try
		{
			if(!directSock._Connected)
			{
				var force=false;
				if((directSock._reconnNo % 10) == 0 && directSock._reconnNo > 0)
				{
					LogDataService.addLog("directSock: RECONN #"+directSock._reconnNo, "#f00");
					force=true;
				}

				directSock._reconnNo++;
				directSock._MessageToSend = message;
				directSock.connectSocket(force);
			}
			else
			{
				directSock._Socket.send(message);
				directSock._lastTimeTX = (new Date()).getTime();
				LogDataService.addLog("directSock: SENT " + message);
			}
		}
		catch(e)
		{
			LogDataService.addLog("directSock: SockSendEx " + e.message);
			directSock._Connected;
		}
    }
	
	directSock.setRxCallback = function(callbackObj)
	{
		directSock._rxCallback = callbackObj;
	}
	
	directSock.isAlive = function()
	{
		if((directSock._Socket != null) && 
				(directSock._Connected || directSock._Connecting))
		{
			if(directSock._lastTimeTX > directSock._lastTimeRX &&
				(new Date()).getTime() - directSock._lastTimeTX > 3000)
			{
				LogDataService.addLog("directSock: TX Timeout");
				return false;
			}
			else return true
		}
		return false;
	}
	
	directSock.getSocket = function()
	{
		if(directSock._Socket == null)
		{
			directSock.connectSocket();
		}
		
		return directSock._Socket;
	}

	directSock.connectSocket = function(force)
	{
		var settings = SettingsService.get('settings');
		var _force = force || false;
		var currentState;
	
		if(directSock._Socket != null)
		{
			switch (directSock._Socket.readyState) {
			  case WebSocket.CONNECTING:
				currentState = "CONNECTING";
				break;
			  case WebSocket.OPEN:
				currentState = "OPEN";
				break;
			  case WebSocket.CLOSING:
				currentState = "CLOSING";
				break;
			  case WebSocket.CLOSED:
				currentState = "CLOSED";
				break;
			  default:
				currentState = "UNKNOWN";
				break;
			}
			
			LogDataService.addLog("directSock: Conn: in state " + currentState, "#aaa");
			
			if(
				_force || 
				(
					(
						directSock._Socket.readyState != WebSocket.CONNECTING ||
						(new Date()).getTime() - directSock._lastTimeTryConnect > 3000 
					) &&
					directSock._Socket.readyState != WebSocket.OPEN && 
					(
						(!directSock._Connected && !directSock._Connecting) ||
						directSock._wasError
					)
				)	
			)
			{
				directSock._wasError = false;
				
				directSock._Socket.onopen = null;
				directSock._Socket.onclose = null
				directSock._Socket.onmessage = null;
				directSock._Socket.onerror = null;
				
				directSock._Socket.close();
				directSock._Socket = null;
				directSock._Connected = false;
				LogDataService.addLog("directSock: FORCE RECONN", "#aaa");
			}
			else return directSock._Socket;	
		}
		
		if(settings == null)
		{
			LogDataService.addLog("directSock:  NO SETTINGS", "#f00");
		}
		else
		{
			LogDataService.addLog("directSock: CREATE "+settings.serverURL, "#aaa");
			directSock._Connecting = true;
			directSock._lastTimeTryConnect = (new Date()).getTime();
			try
			{
				directSock._Socket = new WebSocket(settings.serverURL);
			}
			catch(e)
			{
				//directSock._wasError = true;
				directSock._Socket = null;
				LogDataService.addLog("directSock: SockSendEx ()" + e.message);
				return null;
			}
			
			directSock._Socket.onopen = function(evt)
			{
				LogDataService.addLog("directSock: CONNECTED", "#0f0");
				directSock._Connected = true;
				directSock._Connecting = false;
				directSock._reconnNo = 0;
				directSock._lastTimeRX = directSock._lastTimeTX = 0;
			};
			directSock._Socket.onclose = function(evt)
			{
				LogDataService.addLog("directSock: DISCONN", "#f00");
				directSock._Connected = false;
				directSock._Connecting = false;
			};
			directSock._Socket.onmessage = function(evt)
			{
				directSock._lastTimeRX = (new Date()).getTime();

				directSock._rxCallback.onMessage(evt.data);

				LogDataService.addLog("directSock: RX "+evt.data);
			};
			directSock._Socket.onerror = function(evt)
			{
				directSock._Connecting = false;
				directSock._Connected = false;
				directSock._wasError = true;
				LogDataService.addLog("directSock ERR:"+evt.data, "#f00");
			};
		}
		return directSock._Socket;
	}

	return directSock;
})