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
    chatText: '',
    channel: 'public'
  };

  function addUser(user) {
    data.users.push(user);
  }

  function addMessage(message) {
    data.messages.push(message);
  }

  Vue.filter('formatMessageDate', function (value) {
    return moment(value).format('h:mm A');
  });

  function isNotSubsequentMessage(currentMessage, index) {
    var previousMessage = data.messages[index - 1];
    if (!previousMessage) return true;
    return previousMessage.username !== currentMessage.username;
  }

  Vue.filter('isNotSubsequentMessage', isNotSubsequentMessage);

  Vue.filter('getMessageClass', function (currentMessage, index) {
    if (isNotSubsequentMessage(currentMessage, index) && index !== 0) {
      return 'message-top-padding';
    } else {
      return '';
    }
  });

  Vue.transition('messageAdded', {
    css: false,
    enter: function enter(el, done) {
      var messageList = document.getElementById('message-list');
      messageList.scrollTop = messageList.scrollHeight;
      done();
    }

  });

  var username = 'george'.concat(Math.floor(Math.random() * 100 + 1)),
      avatar = 'http://www.picgifs.com/avatars/celebrities/nicolas-cage/avatars-nicolas-cage-621219.jpg';

  new Vue({
    el: '#chat',
    data: data,
    methods: {
      changeChannel: function changeChannel(user) {
        this.channel = user;
      },
      submitChat: function submitChat() {
        var chatText = cleanInput(this.chatText);
        if (chatText && connected) {
          this.chatText = '';
          var message = {
            username: username,
            message: chatText,
            date: Date.now(),
            avatar: avatar
          };
          addMessage(message);
          socket.emit('chatTextClientToServer', message);
        }
      }
    }
  });

  // Add this user on page load
  (function () {
    var user = {
      username: username,
      avatar: avatar
    };
    socket.emit('userJoinedClientToServer', user);
    addUser(user);
  })();

  socket.on('userJoinedServerToClient', function (obj) {
    addUser(obj);
  });

  socket.on('chatTextServerToClient', function (message) {
    addMessage(message);
  });
});
//# sourceMappingURL=chat.js.map
