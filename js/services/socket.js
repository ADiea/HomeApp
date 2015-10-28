ionicApp.factory('socket',function(socketFactory, SettingsService, LogDataService, commWeb){
	
	var socket = {};

	//Create socket and connect to http://chat.socket.io 
	var _Socket = null;
	
	var _Callbacks = [];
	
	socket._Connected = false;
	
	var _MessageToSend = null;
	
	socket._reconnNo = 0;
	
	socket.send =  function (message) 
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
			_Socket.send(message);
			LogDataService.addLog("SENT " + message);
			//LogDataService.addLog("SENT!", "#aaa");
		}
    }
	
	socket.setCallbacks = function(callbackObj)
	{
		_Callbacks.push(callbackObj);
	}
	
	socket.getSocket = function()
	{
		if(_Socket == null)
		{
			socket.connectSocket();
		}
		
		return _Socket;
	}

	socket.connectSocket = function(force)
	{
		var settings = SettingsService.get('settings');
		var _force = force || false;
	
		if(_Socket != null)
		{
			if(_force || !socket._Connected)
			{
				_Socket = null;
				socket._Connected = false;
				//socket._reconnNo = 0;
			}
			else return _Socket;	
		}
		
		if(settings == null)
		{
			//_Socket = socketFactory();
			//connect to external web server
		}
		else
		{
			_Socket = new WebSocket(settings.serverURL);
			
			_Socket.onopen = function(evt)
			{
				LogDataService.addLog("CONN ", "#0f0");
				socket._Connected = true;
				socket._reconnNo = 0;
			};
			_Socket.onclose = function(evt)
			{
				//LogDataService.addLog("DISC ", "#f00");
				socket._Connected = false;
				//socket.connectSocket();
			};
			_Socket.onmessage = function(evt)
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
			_Socket.onerror = function(evt)
			{
				//LogDataService.addLog("ERR:"+evt.data, "#f00");
				//socket._reconnNo ++;
			};
		}
		
		return _Socket;
	}
	
	return socket;
})