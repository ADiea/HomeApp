ionicApp.factory('socket',function(SettingsService, LogDataService, commWeb, webSock, directSock){
	
	var socket = {
		_Connected: false,
		_HouseBaseID:122,
		_connectMethod:commWeb.WsWebProto.wsConnTypeProxy,
		_Callbacks:[],
		_MessageToSend:null,
	};
	
	LogDataService.addLog("FACTORY: SOCKET", "#f00");
	
	socket.onRXproxy = {onMessage:function(message)
	{
		var msg = JSON.parse(message);
				
		switch(msg.op)
		{
			case commWeb.WsWebProto.wsOP_msgRelay:	
				if(msg.from == socket._HouseBaseID)
				{
					LogDataService.addLog("socket: Handle msg from homeBase " + msg.msg);
					socket.onMessageRx(msg.msg);
				}
			break;	
		}	
	}};
	
	socket.onRXdirect = {onMessage:function(message)
	{
		socket.onMessageRx(message);	
	}};
	
	webSock.setRxCallback(socket.onRXproxy);
	directSock.setRxCallback(socket.onRXdirect);	
	
	socket.onMessageRx = function(message)
	{
		var found = false;
		var res = {str:message};
		
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
			LogDataService.addLog("sock: RX "+message);
	
	}
	
	socket.send =  function (message) 
	{
		try
		{
			if(socket._connectMethod == commWeb.WsWebProto.wsConnTypeProxy)
			{
				if(webSock._Connected && webSock._sockState == commWeb.WsWebProto.wsState_conn)
				{
					socket._Connected = true;
					var msg={op:commWeb.WsWebProto.wsOP_msgRelay, 
										 dest:socket._HouseBaseID, 
										 type:commWeb.WsWebProto.wsValue_homeBase,
										 msg:message};
					webSock._Socket.send(JSON.stringify(msg));
				}
				else
				{
					socket._Connected = false;
					LogDataService.addLog("socket: cannot send yet, sock state:" + webSock._sockState);
				}
			}
			else //direct
			{
				directSock.send(message);
				socket._Connected = directSock._Connected;
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
		if(socket._connectMethod == commWeb.WsWebProto.wsConnTypeProxy)
		{
			return webSock._sockState == commWeb.WsWebProto.wsState_conn;
		}
		else //direct conenction
		{
			return directSock.isAlive();
		}
	}
	
	socket.getSocket = function()
	{
		if(socket._connectMethod == commWeb.WsWebProto.wsConnTypeProxy)
		{
			return webSock._Socket;
		}
		else //direct conenction
		{
			return directSock._Socket;
		}
	}
	
	socket.connectSocket = function(force)
	{
		var _force = force || false;
		if(socket._connectMethod == commWeb.WsWebProto.wsConnTypeProxy)
		{
			return webSock.connectSocket(_force);
		}
		else //direct conenction
		{
			return directSock.connectSocket(_force);
		}	
	}
	
	return socket;
})