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
  var data = {
    messages: [],
    users: [],
    chatText: ''
  };

  function addUser(username) {
    data.users.push({ username: username });
  }

  function addMessage(message) {
    data.messages.push(message);
  }

  Vue.filter('formatMessageDate', function (value) {
    return moment(value).format('h:mm A');
  });

  var username = 'george'.concat(Math.floor(Math.random() * 100 + 1));

  new Vue({
    el: '#chat',
    data: data,
    methods: {
      submitChat: function submitChat() {
        var chatText = cleanInput(this.chatText);
        if (chatText && connected) {
          this.chatText = '';
          var message = {
            username: username,
            message: chatText,
            date: Date.now()
          };
          addMessage(message);
          socket.emit('chatTextClientToServer', message);
        }
      }
    }
  });

  // Add this user on page load
  (function () {
    socket.emit('userJoinedClientToServer', username);
    addUser(username);
  })();

  socket.on('userJoinedServerToClient', function (obj) {
    addUser(obj.username);
  });

  socket.on('chatTextServerToClient', function (message) {
    addMessage(message);
  });
});
//# sourceMappingURL=chat.js.map
