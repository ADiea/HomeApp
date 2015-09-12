ionicApp.factory('socket',function(socketFactory, SettingsService){
	//Create socket and connect to http://chat.socket.io 
	var mySocket;
	var settings = SettingsService.get('settings');
	
	if(settings == null)
	{
		mySocket = socketFactory();
	}
	else
	{
		var myIoSocket = io.connect(settings.serverURL);
		mySocket = socketFactory({ ioSocket: myIoSocket });
	}

	return mySocket;
})