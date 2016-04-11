ionicApp.factory('webSock',function(SettingsService, LogDataService, commWeb, ident){
	
	var webSock = {
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
		_sockState:commWeb.WsWebProto.wsState_inval
	};
	
	LogDataService.addLog("FACTORY: WEB SOCKET", "#f00");
	
	//if(location.origin.replace(/^http/, 'ws')
	//type = web
	
	webSock.send =  function (message) 
	{
		try
		{
			if(!webSock._Connected)
			{
				var force=false;
				if((webSock._reconnNo % 10) == 0 && webSock._reconnNo > 0)
				{
					LogDataService.addLog("wsock: RECONN #"+webSock._reconnNo, "#f00");
					force=true;
				}

				webSock._reconnNo++;
				webSock._MessageToSend = message;
				webSock.connectSocket(force);
			}
			else
			{
				webSock._Socket.send(msg);
				webSock._lastTimeTX = (new Date()).getTime();
			}
		}
		catch(e)
		{
			LogDataService.addLog("wsock: SockSendEx " + e.message);
			webSock._Connected = false;
		}
    }
	
	webSock.setRxCallback = function(callbackObj)
	{
		webSock._rxCallback = callbackObj;
	}
	
	webSock.isAlive = function()
	{
		if((webSock._Socket != null) && 
				(webSock._Connected || webSock._Connecting))
		{
			if(webSock._lastTimeTX > webSock._lastTimeRX &&
				(new Date()).getTime() - webSock._lastTimeTX > 3000)
			{
				LogDataService.addLog("wsock: TX Timeout");
				return false;
			}
			else return true
		}
		return false;
	}
	
	webSock.getSocket = function()
	{
		if(webSock._Socket == null)
		{
			webSock.connectSocket();
		}
		
		return webSock._Socket;
	}

	webSock.connectSocket = function(force)
	{
		var settings = SettingsService.get('settings');
		var _force = force || false;
		var currentState;
	
		if(webSock._Socket != null)
		{
			switch (webSock._Socket.readyState) {
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
						webSock._Socket.readyState != WebSocket.CONNECTING ||
						(new Date()).getTime() - webSock._lastTimeTryConnect > 3000 
					) &&
					webSock._Socket.readyState != WebSocket.OPEN && 
					(
						(!webSock._Connected && !webSock._Connecting) ||
						webSock._wasError
					)
				)	
			)
			{
				webSock._wasError = false;
				
				webSock._Socket.onopen = null;
				webSock._Socket.onclose = null
				webSock._Socket.onmessage = null;
				webSock._Socket.onerror = null;
				
				webSock._Socket.close();
				webSock._Socket = null;
				webSock._Connected = false;
				LogDataService.addLog("wsock: FORCE RECONN", "#aaa");
			}
			else return webSock._Socket;	
		}
		
		if(settings == null)
		{
			LogDataService.addLog("wsock:  NO SETTINGS", "#f00");
		}
		else
		{
			LogDataService.addLog("wsock: CREATE ", "#aaa");
			webSock._Connecting = true;
			webSock._lastTimeTryConnect = (new Date()).getTime();
			try
			{
				webSock._Socket = new WebSocket("ws://homea.herokuapp.com/");
			}
			catch(e)
			{
				//webSock._wasError = true;
				webSock._Socket = null;
				LogDataService.addLog("wsock: SockSendEx ()" + e.message);
				return null;
			}
			
			webSock._Socket.onopen = function(evt)
			{
				LogDataService.addLog("wsock: CONNECTED", "#0f0");
				webSock._Connected = true;
				webSock._Connecting = false;
				webSock._reconnNo = 0;
				webSock._lastTimeRX = webSock._lastTimeTX = 0;

				webSock._sockState=commWeb.WsWebProto.wsState_new;
				var msg={op:commWeb.WsWebProto.wsOP_cliHello};
				msg = JSON.stringify(msg);
				LogDataService.addLog("wsock: _send"+msg, "#f00");
				webSock._Socket.send(msg);
			};
			webSock._Socket.onclose = function(evt)
			{
				LogDataService.addLog("wsock: DISCONN"/*+evt.code + " "+evt.reason + " " + ev.wasClean*/ , "#f00");
				webSock._Connected = false;
				webSock._Connecting = false;
			};
			webSock._Socket.onmessage = function(evt)
			{	
				LogDataService.addLog("wsock: RX "+evt.data);
				
				var msg = JSON.parse(evt.data);
				
				switch(msg.op)
				{
					case commWeb.WsWebProto.wsOP_servHello:
						if(webSock._sockState == commWeb.WsWebProto.wsState_new)
						{
							webSock._sockState=commWeb.WsWebProto.wsState_hello;
							
							var reply={
										op:commWeb.WsWebProto.wsOP_cliLogin, 
										type:commWeb.WsWebProto.wsValue_mobileApp, 
										id:ident.getMyId()
									  };
							webSock._Socket.send(JSON.stringify(reply));
							
							LogDataService.addLog("wsock: rx servHello, login" );
						}
						else
						{
							LogDataService.addLog("wsock: rx servHello in bad state " + webSock._sockState);
						}
					break;
					
					case commWeb.WsWebProto.wsOP_positiveAck:
						if(webSock._sockState == commWeb.WsWebProto.wsState_hello)
						{
							webSock._sockState=commWeb.WsWebProto.wsState_conn;
							LogDataService.addLog("wsock: login accepted");
						}
						//else if
					
					break;
					
					case commWeb.WsWebProto.wsOP_negativeAck:
					
						if(webSock._sockState == commWeb.WsWebProto.wsState_hello)
						{
							LogDataService.addLog("wsock: login rejected: " + msg.err);
							
							/*dupl code*/
							/*
							timeout 10s
							var reply={
										op:commWeb.WsWebProto.wsOP_cliLogin, 
										type:commWeb.WsWebProto.wsValue_mobileApp, 
										id:0
									  };
							webSock.send(JSON.stringify(reply));
							
							LogDataService.addLog("wsock: reattempt login" );
							*/
							
						}
					
					break;
					
					case commWeb.WsWebProto.wsOP_msgRelay:
					break;
					
					default:
						LogDataService.addLog("wsock: rx bad op " + msg.op);
					break;
				
				}
				
				webSock._rxCallback.onMessage(evt.data);
				
				webSock._lastTimeRX = (new Date()).getTime();
				
			};
			webSock._Socket.onerror = function(evt)
			{
				webSock._Connecting = false;
				webSock._Connected = false;
				webSock._wasError = true;
				LogDataService.addLog("wsock: ERR:"+evt.data, "#f00");
				//webSock._reconnNo ++;
			};
		}
		
		return webSock._Socket;
	}
	
	return webSock;
})