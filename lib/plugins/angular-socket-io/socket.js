/*
 * @license
 * angular-socket-io v0.7.0
 * (c) 2014 Brian Ford http://briantford.com
 * License: MIT
 */

angular.module('btford.socket-io', []).
  provider('socketFactory', function () {

    'use strict';

    // when forwarding events, prefix the event name
    var defaultPrefix = 'socket:',
      ioSocket;

    // expose to provider
    this.$get = ['$rootScope', '$timeout', function ($rootScope, $timeout) {

      var asyncAngularify = function (socket, callback) {
        return callback ? function () {
          var args = arguments;
          $timeout(function () {
            callback.apply(socket, args);
          }, 0);
        } : angular.noop;
      };

      return function socketFactory (options) {
        options = options || {};
        var socket = options.ioSocket || io.connect();
        var prefix = options.prefix === undefined ? defaultPrefix : options.prefix ;
        var defaultScope = options.scope || $rootScope;

        var addListener = function (eventName, callback) {
          socket.on(eventName, callback.__ng = asyncAngularify(socket, callback));
        };

        var addOnceListener = function (eventName, callback) {
          socket.once(eventName, callback.__ng = asyncAngularify(socket, callback));
        };
		
		var removeAllListeners = function() {
            return socket.removeAllListeners.apply(socket, arguments);
          };

        var wrappedSocket = {
		theSocket:socket,
          on: addListener,
          addListener: addListener,
          once: addOnceListener,

          emit: function (eventName, data, callback) {
            var lastIndex = arguments.length - 1;
            var callback = arguments[lastIndex];
            if(typeof callback == 'function') {
              callback = asyncAngularify(theSocket, callback);
              arguments[lastIndex] = callback;
            }
            return theSocket.emit.apply(theSocket, arguments);
          },

          removeListener: function (ev, fn) {
            if (fn && fn.__ng) {
              arguments[1] = fn.__ng;
            }
            return theSocket.removeListener.apply(theSocket, arguments);
          },

          removeAllListeners: removeAllListeners,

          disconnect: function (close) {
            return theSocket.disconnect(close);
          },

          connect: function() {
            return theSocket.connect();
          },

          // when theSocket.on('someEvent', fn (data) { ... }),
          // call scope.$broadcast('someEvent', data)
          forward: function (events, scope) {
            if (events instanceof Array === false) {
              events = [events];
            }
            if (!scope) {
              scope = defaultScope;
            }
            events.forEach(function (eventName) {
              var prefixedEvent = prefix + eventName;
              var forwardBroadcast = asyncAngularify(theSocket, function () {
                Array.prototype.unshift.call(arguments, prefixedEvent);
                scope.$broadcast.apply(scope, arguments);
              });
              scope.$on('$destroy', function () {
                theSocket.removeListener(eventName, forwardBroadcast);
              });
              theSocket.on(eventName, forwardBroadcast);
            });
          }
        };

        return wrappedSocket;
      };
    }];
  });
