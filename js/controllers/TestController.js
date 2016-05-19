var _TestCtrl = ionicApp.controller('TestsCtrl', function($scope, $stateParams, commWeb, socket, Lang, webSock) 
{
	$scope.lang = Lang;
	$scope.moreInfo = "n/a";
	
	/*
	var host = location.origin.replace(/^http/, 'ws')
      var ws = new WebSocket(host);
      ws.onmessage = function (event) {
        var li = document.createElement('li');
        li.innerHTML = JSON.parse(event.data);
        document.querySelector('#pings').appendChild(li);
      };
	*/  
	
	$scope.connectWiFi = function connectWiFi(wifi)
	{
		var wifiNet = WifiWizard.formatWPAConfig(wifi.s, wifi.p);
		
		try { window.plugins.toast.showShortCenter("Try connect "+wifi.s ,function(a){},function(b){}); }
		catch(e){}
		
		WifiWizard.addNetwork(wifiNet, 
			function(){
				try { window.plugins.toast.showShortCenter("Added WiFi " + wifi.s ,function(a){},function(b){}); }
				catch(e){}
				
				WifiWizard.connectNetwork(wifi.s, 
					function()
					{
						try { window.plugins.toast.showShortCenter("CONNECTED to" + wifi.s ,function(a){},function(b){}); }
						catch(e){}
					}, 
					function()
					{
						try { window.plugins.toast.showShortCenter("Failed connect to " + wifi.s ,function(a){},function(b){}); }
						catch(e){}
					}
				);
				
			}, 
			function(){
				try { window.plugins.toast.showShortCenter("Cannot add WiFi " + wifi.s ,function(a){},function(b){}); }
				catch(e){}
				
				WifiWizard.connectNetwork(wifi.s, 
					function()
					{
						try { window.plugins.toast.showShortCenter("CONNECTED to" + wifi.s ,function(a){},function(b){}); }
						catch(e){}
					}, 
					function()
					{
						try { window.plugins.toast.showShortCenter("Failed connect to " + wifi.s ,function(a){},function(b){}); }
						catch(e){}
					}
				);
			}
		);
	}
	
	$scope.doQRScan = function doQRScan()
	{
		$scope.moreInfo = "QR Scan Started";
		
		if(typeof cordova == 'undefined')
			$scope.moreInfo = "QR Scan - !cordova";
		if(typeof cordova.plugins == 'undefined')
			$scope.moreInfo = "QR Scan - !plugins";
		if(typeof cordova.plugins.barcodeScanner == 'undefined')
			$scope.moreInfo = "QR Scan - !barcodeScanner";
		
		cordova.plugins.barcodeScanner.scan
		(
		  function (result) 
		  {
			if(!result.cancelled)
			{
				$scope.moreInfo = "Barcode type is: " + result.format + "\nDecoded text is: " + result.text;
				
				try { window.plugins.toast.showShortCenter("Scanned: " + result.text ,function(a){},function(b){}); }
				catch(e){}
						
				var wifi = JSON.parse(result.text);
				
				if(wifi != null)
				{
				
					try { window.plugins.toast.showShortCenter("JSON: s:" + wifi.s + " p:" + wifi.p ,function(a){},function(b){}); }
					catch(e){}
				
				try{
					WifiWizard.isWifiEnabled(
						function(status)
						{
							$scope.moreInfo = "WiFi is" + status?"ena":"dis";
							
							try { window.plugins.toast.showShortCenter($scope.moreInfo  ,function(a){},function(b){}); }
							catch(e){}
							
							if(!status)
							{
								WifiWizard.setWifiEnabled(true, function(){$scope.connectWiFi(wifi);}, 
									function()
									{
										$scope.moreInfo = "Can't start WiFi";
										try { window.plugins.toast.showShortCenter($scope.moreInfo  ,function(a){},function(b){}); }
										catch(e){}
									});
							}
							else
							{
								$scope.connectWiFi(wifi);
							}
						}, 
						function()
						{
							$scope.moreInfo = "Can't get WiFi state";
							try { window.plugins.toast.showShortCenter($scope.moreInfo  ,function(a){},function(b){}); }
							catch(e){}
						}
					);
					}
					catch(e)
					{
						try { window.plugins.toast.showShortCenter("ex: " + e.message  ,function(a){},function(b){}); }
							catch(e){}
					}
				}
				else
				{
					try { window.plugins.toast.showShortCenter("Failed to parse " + result.text ,function(a){},function(b){}); }
					catch(e){}
				}
				
			}
			else
			{
				$scope.moreInfo = "QR Scan Cancelled";
			}
		  },
		  function (error) 
		  {
			$scope.moreInfo = "QR Scan failed " + error;
		  }
		);
	}
	
// Fetch Device info from Device Plugin
	$scope.alertDeviceInfo = function() {
		$scope.moreInfo = ('Device Platform: ' + device.platform + '\n'
				+ 'Device Version: ' + device.version + '\n' + 'Device Model: '
				+ device.model + '\n' + 'Device UUID: ' + device.uuid + '\n');

		//navigator.notification.alert(deviceInfo);
	};

	// Fetch location info from GeoLocation Plugin
	$scope.alertGeoLocation = function() {
		var onSuccess = function(position) {
			$scope.moreInfo = 'Latitude: '
					+ position.coords.latitude + '\n' + 'Longitude: '
					+ position.coords.longitude + '\n' + 'Altitude: '
					+ position.coords.altitude + '\n' + 'Accuracy: '
					+ position.coords.accuracy + '\n' + 'Altitude Accuracy: '
					+ position.coords.altitudeAccuracy + '\n' + 'Heading: '
					+ position.coords.heading + '\n' + 'Timestamp: '
					+ position.timestamp + '\n';
		};
		var onFailure = function(err, msg) {
			$scope.moreInfo = 'Error: '
					+ err + '\n' + 'Err code: '
					+ err.code + '\n' + 'Msg: '
					+ msg + '\n' + 'Accuracy: '
					+ position.coords.accuracy + '\n';
		};
		$scope.moreInfo = "Location: (loading)";
		navigator.geolocation.getCurrentPosition(onSuccess, onFailure, { timeout: 15000, enableHighAccuracy: false });

	};

	// Makes a beep sound
	$scope.beepNotify = function() {
		navigator.notification.beep(1);
	};

	// Vibrates the phone
	$scope.vibrateNotify = function() {
		navigator.notification.vibrate(1000);
	};
	
	$scope.debugHeap = function() {
		var message = commWeb.eCommWebMsgTYpes.cwPrintDebugInformation + ";0;"
		socket.send(message);
	};
	
	$scope.debugTcp = function() {
		var message = commWeb.eCommWebMsgTYpes.cwPrintDebugInformation + ";1;"
		socket.send(message);
	};
	
	$scope.debugReset = function() {
		var message = commWeb.eCommWebMsgTYpes.cwSpecialCommand + ";0;"
		socket.send(message);
	};
	
	
	
	
});