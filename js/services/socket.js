ionicApp.factory('socket',function(SettingsService, LogDataService, commWeb){
	
	var socket = {};

	socket._Socket = null;
	
	var _Callbacks = [];
	
	socket._Connected = false;
	
	var _MessageToSend = null;
	
	socket._reconnNo = 0;
	
	socket.send =  function (message) 
	{
		try
		{
			if(!socket._Connected)
			{
				if((socket._reconnNo % 10) == 0)
					LogDataService.addLog("RECONN #"+socket._reconnNo, "#f00");

				socket._reconnNo++;
				_MessageToSend = message;
				socket.connectSocket();
			}
			else
			{
				socket._Socket.send(message);
				LogDataService.addLog("SENT " + message);
				//LogDataService.addLog("SENT!", "#aaa");
			}
		}
		catch(e)
		{
			LogDataService.addLog("SockSendEx " + e.message);
		}
    }
	
	socket.setCallbacks = function(callbackObj)
	{
		_Callbacks.push(callbackObj);
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
			if(_force || !socket._Connected)
			{
				socket._Socket = null;
				socket._Connected = false;
				//socket._reconnNo = 0;
			}
			else return socket._Socket;	
		}
		
		if(settings == null)
		{
			LogDataService.addLog("NO SETS", "#f00");
		}
		else
		{
			socket._Socket = new WebSocket(settings.serverURL);
			
			socket._Socket.onopen = function(evt)
			{
				LogDataService.addLog("CONN ", "#0f0");
				socket._Connected = true;
				socket._reconnNo = 0;
			};
			socket._Socket.onclose = function(evt)
			{
				//LogDataService.addLog("DISC ", "#f00");
				socket._Connected = false;
				//socket.connectSocket();
			};
			socket._Socket.onmessage = function(evt)
			{
				LogDataService.addLog("RX "+evt.data);
				
				var res = commWeb.skipInt(evt.data);
				
				if(!res.err)
				{	
					for(var i=0; i < _Callbacks.length; i++)
					{
						if(_Callbacks[i].protocol == res.result)
						{
							_Callbacks[i].onMessage(res.str);
						}
					}
				}
			};
			socket._Socket.onerror = function(evt)
			{
				//LogDataService.addLog("ERR:"+evt.data, "#f00");
				//socket._reconnNo ++;
			};
		}
		
		return socket._Socket;
	}
	
	return socket;
})