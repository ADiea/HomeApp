ionicApp.factory('webSock',function(SettingsService, LogDataService, commWeb){
	
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
		_lastTimeTryConnect:0,
		_sockState:commWeb.WsWebProto.wsState_inval
	};
	
	LogDataService.addLog("FACTORY: WEB SOCKET", "#f00");
	
	//if(location.origin.replace(/^http/, 'ws')
	//type = web
	
	socket.send =  function (message) 
	{
		try
		{
			if(!socket._Connected)
			{
				var force=false;
				if((socket._reconnNo % 10) == 0 && socket._reconnNo > 0)
				{
					LogDataService.addLog("wsock: RECONN #"+socket._reconnNo, "#f00");
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
				LogDataService.addLog("wsock: SENT " + message);
			}
		}
		catch(e)
		{
			LogDataService.addLog("wsock: SockSendEx " + e.message);
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
				LogDataService.addLog("wsock: TX Timeout");
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
			
			LogDataService.addLog("wsock: Conn: in state " + currentState, "#aaa");
			
			if(
				_force || 
				(
					(
						socket._Socket.readyState != WebSocket.CONNECTING ||
						(new Date()).getTime() - socket._lastTimeTryConnect > 3000 
					) &&
					socket._Socket.readyState != WebSocket.OPEN && 
					(
						(!socket._Connected && !socket._Connecting) ||
						socket._wasError
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
				LogDataService.addLog("wsock: FORCE RECONN", "#aaa");
			}
			else return socket._Socket;	
		}
		
		if(settings == null)
		{
			LogDataService.addLog("wsock:  NO SETTINGS", "#f00");
		}
		else
		{
			LogDataService.addLog("wsock: CREATE ", "#aaa");
			socket._Connecting = true;
			socket._lastTimeTryConnect = (new Date()).getTime();
			try
			{
				socket._Socket = new WebSocket("wss://homea.herokuapp.com/");
			}
			catch(e)
			{
				//socket._wasError = true;
				socket._Socket = null;
				LogDataService.addLog("wsock: SockSendEx ()" + e.message);
				return null;
			}
			
			socket._Socket.onopen = function(evt)
			{
				LogDataService.addLog("wsock: CONNECTED", "#0f0");
				socket._Connected = true;
				socket._Connecting = false;
				socket._reconnNo = 0;
				socket._lastTimeRX = socket._lastTimeTX = 0;
				//socket.send(commWeb.eCommWebMsgTYpes.cwPrintDebugInformation + ";1;");
				
				socket._sockState:commWeb.WsWebProto.wsState_new;
				var msg={op:commWeb.WsWebProto.wsOP_cliHello};
				socket.send(JSON.stringify(msg));
			};
			socket._Socket.onclose = function(evt)
			{
				LogDataService.addLog("wsock: DISCONN", "#f00");
				socket._Connected = false;
				socket._Connecting = false;
				//socket.connectSocket();
			};
			socket._Socket.onmessage = function(evt)
			{
				var found = false;
				var res = {str:evt.data};
				
				var msg = JSON.parse(msg);
				
				switch(msg.op)
				{
					case commWeb.WsWebProto.wsOP_servHello:
						if(socket._sockState == commWeb.WsWebProto.wsState_new)
						{
							socket._sockState=commWeb.WsWebProto.wsState_hello;
							
							var reply={
										op:commWeb.WsWebProto.wsOP_cliLogin, 
										type:commWeb.WsWebProto.wsValue_mobileApp, 
										id:0
									  };
							socket.send(JSON.stringify(reply));
							
							LogDataService.addLog("wsock: rx servHello, login" );
						}
						else
						{
							LogDataService.addLog("wsock: rx servHello in bad state " + socket._sockState);
						}
					break;
					
					case commWeb.WsWebProto.wsOP_positiveAck:
						if(socket._sockState == commWeb.WsWebProto.wsState_hello)
						{
							socket._sockState=commWeb.WsWebProto.wsState_conn;
						}
						//else if
					
					break;
					
					case commWeb.WsWebProto.wsOP_negativeAck:
					
					break;
					
					default:
						LogDataService.addLog("wsock: rx bad op " + msg.op);
					break;
				
				}
				
				/*
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
				*/
				
				if(!found)
					LogDataService.addLog("wsock: RX "+evt.data);
			};
			socket._Socket.onerror = function(evt)
			{
				socket._Connecting = false;
				socket._Connected = false;
				socket._wasError = true;
				LogDataService.addLog("wsock: ERR:"+evt.data, "#f00");
				//socket._reconnNo ++;
			};
		}
		
		return socket._Socket;
	}
	
	return socket;
})