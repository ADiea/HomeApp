ionicApp.factory('socket',function(socketFactory, SettingsService){
	
	var socket = {};

	//Create socket and connect to http://chat.socket.io 
	var _Socket = null;
	
	socket.getSocket = function()
	{
		if(_Socket == null)
		{
			socket.resetSocket();
		}
		
		return _Socket;
	}

	socket.resetSocket = function()
	{
		var settings = SettingsService.get('settings');
	
		if(settings == null)
		{
			_Socket = socketFactory();
		}
		else
		{
			var myIoSocket = io.connect(settings.serverURL);
			_Socket = socketFactory({ ioSocket: myIoSocket });
		}
		
		return _Socket;
	}
	
	return socket;
})