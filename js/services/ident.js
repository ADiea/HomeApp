ionicApp.factory('ident',function(){
	
	var ident = {
		id:5
	};
	
	ident.getMyId = function()
	{
		try
		{
			id = device.uuid;
		}
		catch(e)
		{
		
		}
		
		id=5;
		
		return ident.id;
	};
	
	return ident;
})