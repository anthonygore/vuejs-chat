'use strict';

define(['vuejs', 'socket.io-client', 'momentjs'], function () {

  const Vue = require('vuejs'),
    moment = require('momentjs'),
    io = require('socket.io-client');

  // SocketIO setup
  const socket = io();
  var connected = true;

  function cleanInput (input) {
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
    data.users.push({ username });
  }

  function addMessage(message) {
    data.messages.push(message);
  }

  Vue.filter('formatMessageDate', (value) => {
    return moment(value).format('h:mm A');
  });

  Vue.filter('isNotSubsequentMessage', (currentMessage, index) => {
    let previousMessage = data.messages[index - 1];
    if (!previousMessage) return true;
    return previousMessage.username !== currentMessage.username;
  });

  let username = 'george'.concat(Math.floor((Math.random() * 100) + 1));

  new Vue({
    el: '#chat',
    data: data,
    methods: {
      submitChat() {
        var chatText = cleanInput(this.chatText);
        if (chatText && connected) {
          this.chatText = '';
          let message = {
            username,
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
  (function() {
    socket.emit('userJoinedClientToServer', username);
    addUser(username);
  })();

  socket.on('userJoinedServerToClient', (obj) => {
    addUser(obj.username);
  });

  socket.on('chatTextServerToClient', (message) => {
    addMessage(message);
  });

});
