'use strict';

define(['vuejs', 'socket.io-client', 'momentjs'], function () {

  var Vue = require('vuejs'),
      moment = require('momentjs'),
      io = require('socket.io-client');

  // SocketIO setup
  var socket = io();
  var connected = true;

  function cleanInput(input) {
    // todo: make this work
    return input;
    //return $('<div/>').text(input).text();
  }

  // Vue

  Vue.filter('formatMessageDate', function (value) {
    return moment(value).format('h:mm A');
  });

  var data = {
    messages: [],
    chatText: ''
  };

  new Vue({
    el: '#chat',
    data: data,
    methods: {
      submitChat: function submitChat() {
        var chatText = cleanInput(this.chatText);
        if (chatText && connected) {
          this.chatText = '';
          socket.emit('chatTextClientToServer', {
            message: chatText,
            date: Date.now()
          });
        }
      }
    }
  });

  // Socket
  socket.on('chatTextServerToClient', function (message) {
    data.messages.push(message);
  });

  return {
    getHello: function getHello() {
      return 'Hello World';
    }
  };
});
//# sourceMappingURL=chat.js.map
