ionicApp.service('LogDataService', function($q) {
  return {
    logData:[{log:Date(), col:'#000'}]
    ,
    getLogData: function() {
      return this.logData
    },
	addLog: function(msg, color)
	{
		var date = new Date();
		var col = color || "#000";
		this.logData.unshift({log:date.getHours() + ":" 
							+ ('0'+date.getMinutes()).slice(-2) + ":" 
							+ ('0'+date.getSeconds()).slice(-2) + " " 
							+msg, col:col});
	}
  }
});