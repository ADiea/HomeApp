ionicApp.factory('socket',function(socketFactory, SettingsService, LogDataService, commWeb){
	
	var socket = {};

	//Create socket and connect to http://chat.socket.io 
	var _Socket = null;
	
	var _Callbacks = [];
	
	
	
	var _Connected = false;
	
	var _MessageToSend = null;
	
	var _reconnNo = 0;
	
	socket.send =  function (message) 
	{
		LogDataService.addLog("SEND:" + message);
	
		if(!_Connected)
		{
			LogDataService.addLog("RECONN #"+_reconnNo);
			_MessageToSend = message;
			socket.connectSocket();
		}
		else
		{
			_Socket.send(message);
			LogDataService.addLog("SENT!", "#aaa");
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
			if(_force || !_Connected)
			{
				_Socket = null;
				_Connected = false;
				_reconnNo = 0;
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
				LogDataService.addLog("CONNECTED", "#0f0");
				_Connected = true;
				_reconnNo = 0;
			};
			_Socket.onclose = function(evt)
			{
				LogDataService.addLog("DISCONNECTED", "#f00");
				_Connected = false;
				socket.connectSocket();
			};
			_Socket.onmessage = function(evt)
			{
				LogDataService.addLog("MSG:"+evt.data);
				
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
				LogDataService.addLog("ERR:"+evt.data, "#f00");
				_reconnNo ++;
			};
		}
		
		return _Socket;
	}
	
	return socket;
})