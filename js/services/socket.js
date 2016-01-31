ionicApp.factory('socket',function(SettingsService, LogDataService, commWeb){
	
	var socket = {
		_Connected: false,
		_Connecting: false,
		_Socket: null,
		_Callbacks:[],
		_MessageToSend:null,
		_reconnNo:0,
		_lastTimeRX:0,
		_lastTimeTX:0,
		_wasError:false,
	};
	
	LogDataService.addLog("FACTORY: SOCKET", "#f00");
	
	socket.send =  function (message) 
	{
		try
		{
			if(!socket._Connected)
			{
				var force=false;
				if((socket._reconnNo % 10) == 0 && socket._reconnNo > 0)
				{
					LogDataService.addLog("sock: RECONN #"+socket._reconnNo, "#f00");
					force=true;
				}

				socket._reconnNo++;
				socket._MessageToSend = message;
				socket.connectSocket(force);
			}
			else
			{
				socket._Socket.send(message);
				socket._lastTimeTX = (new Date()).getTime();
				LogDataService.addLog("sock: SENT " + message);
			}
		}
		catch(e)
		{
			LogDataService.addLog("sock: SockSendEx " + e.message);
		}
    }
	
	socket.setCallbacks = function(callbackObj)
	{
		var i=0, found=0;
		for(; i< socket._Callbacks.length; i++)
			if(socket._Callbacks[i].name === callbackObj.name &&
				socket._Callbacks[i].protocol === callbackObj.protocol)
			{
				found = 1;
				break;
			}
		
		if(!found)
			socket._Callbacks.push(callbackObj);
	}
	
	socket.isAlive = function()
	{
		if((socket._Socket != null) && 
				(socket._Connected || socket._Connecting))
		{
			if(socket._lastTimeTX > socket._lastTimeRX &&
				(new Date()).getTime() - socket._lastTimeTX > 3000)
			{
				LogDataService.addLog("sock: TX Timeout");
				return false;
			}
			else return true
		}
		return false;
	}
	
	socket.getSocket = function()
	{
		if(socket._Socket == null)
		{
			socket.connectSocket();
		}
		
		return socket._Socket;
	}

	socket.connectSocket = function(force)
	{
		var settings = SettingsService.get('settings');
		var _force = force || false;
		var currentState;
	
		if(socket._Socket != null)
		{
			switch (socket._Socket.readyState) {
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
			
			LogDataService.addLog("sock: Conn: in state " + currentState, "#aaa");
			
			if(socket._Socket.readyState != WebSocket.CONNECTING &&
				(
					_force || 
					(
						socket._Socket.readyState != WebSocket.OPEN && 
						(
							(!socket._Connected && !socket._Connecting) ||
							socket._wasError
						)
					)
				)
			)
			{
				socket._wasError = false;
				
				socket._Socket.onopen = null;
				socket._Socket.onclose = null
				socket._Socket.onmessage = null;
				socket._Socket.onerror = null;
				
				socket._Socket.close();
				socket._Socket = null;
				socket._Connected = false;
				LogDataService.addLog("sock: FORCE RECONN", "#aaa");
			}
			else return socket._Socket;	
		}
		
		if(settings == null)
		{
			LogDataService.addLog("sock:  NO SETTINGS", "#f00");
		}
		else
		{
			LogDataService.addLog("sock: CREATE "+settings.serverURL, "#aaa");
			socket._Connecting = true;
			try
			{
				socket._Socket = new WebSocket(settings.serverURL);
			}
			catch(e)
			{
				//socket._wasError = true;
				socket._Socket = null;
				LogDataService.addLog("sock: SockSendEx ()" + e.message);
				return null;
			}
			
			socket._Socket.onopen = function(evt)
			{
				LogDataService.addLog("sock: CONNECTED", "#0f0");
				socket._Connected = true;
				socket._Connecting = false;
				socket._reconnNo = 0;
				socket._lastTimeRX = socket._lastTimeTX = 0;
				socket.send(commWeb.eCommWebMsgTYpes.cwPrintDebugInformation + ";1;");
			};
			socket._Socket.onclose = function(evt)
			{
				LogDataService.addLog("sock: DISCONN", "#f00");
				socket._Connected = false;
				socket._Connecting = false;
				//socket.connectSocket();
			};
			socket._Socket.onmessage = function(evt)
			{
				var found = false;
				var res = {str:evt.data};
				
				if(!commWeb.skipInt(res).err)
				{	
					socket._lastTimeRX = (new Date()).getTime();
					
					for(var i=0; i < socket._Callbacks.length; i++)
					{
						if(socket._Callbacks[i].protocol == res.result)
						{
							socket._Callbacks[i].onMessage(res.str);
							found = true;
						}
					}
				}
				
				if(!found)
					LogDataService.addLog("sock: RX "+evt.data);
			};
			socket._Socket.onerror = function(evt)
			{
				socket._Connecting = false;
				socket._Connected = false;
				socket._wasError = true;
				LogDataService.addLog("ERR:"+evt.data, "#f00");
				//socket._reconnNo ++;
			};
		}
		
		return socket._Socket;
	}
	
	return socket;
})