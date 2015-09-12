ionicApp.service('LogDataService', function($q) {
  return {
    logData:[{log:Date()}]
    ,
    getLogData: function() {
      return this.logData
    }
  }
});