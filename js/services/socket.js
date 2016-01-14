ionicApp.factory('socket',function(SettingsService, LogDataService, commWeb){
	
	var socket = {
		_Connected: false,
		_Connecting: false,
		_Socket: null,
		_Callbacks:[],
		_MessageToSend:null,
		_reconnNo:0
	};
	
	LogDataService.addLog("FACTORY: SOCKET", "#f00");
	
	
	socket.send =  function (message) 
	{
		try
		{
			if(!socket._Connected)
			{
				if((socket._reconnNo % 10) == 0)
					LogDataService.addLog("sock: RECONN #"+socket._reconnNo, "#f00");

				socket._reconnNo++;
				socket._MessageToSend = message;
				socket.connectSocket();
			}
			else
			{
				socket._Socket.send(message);
				LogDataService.addLog("sock: SENT " + message);
				//LogDataService.addLog("SENT!", "#aaa");
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
			if(socket._Callbacks[i].name === callbackObj.name)
			{
				found = 1;
				break;
			}
		
		if(!found)
			socket._Callbacks.push(callbackObj);
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
	
		if(socket._Socket != null)
		{
			if((_force || !socket._Connected) && !socket._Connecting)
			{
				socket._Socket = null;
				socket._Connected = false;
				//LogDataService.addLog("FORCE ", "#aaa");
			}
			else return socket._Socket;	
		}
		
		if(settings == null)
		{
			LogDataService.addLog("sock:  NO SETTINGS", "#f00");
		}
		else
		{
			//LogDataService.addLog("CREATE ", "#aaa");
			socket._Connecting = true;
			socket._Socket = new WebSocket(settings.serverURL);
			
			socket._Socket.onopen = function(evt)
			{
				LogDataService.addLog("sock: CONNECTED", "#0f0");
				socket._Connected = true;
				socket._Connecting = false;
				socket._reconnNo = 0;
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
				LogDataService.addLog("sock: RX "+evt.data);
				
				var res = commWeb.skipInt(evt.data);
				
				if(!res.err)
				{	
					for(var i=0; i < socket._Callbacks.length; i++)
					{
						if(socket._Callbacks[i].protocol == res.result)
						{
							socket._Callbacks[i].onMessage(res.str);
						}
					}
				}
			};
			socket._Socket.onerror = function(evt)
			{
				socket._Connecting = false;
				socket._Connected = false;
				//LogDataService.addLog("ERR:"+evt.data, "#f00");
				//socket._reconnNo ++;
			};
		}
		
		return socket._Socket;
	}
	
	return socket;
})