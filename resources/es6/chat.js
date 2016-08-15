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
    chatText: '',
    channel: 'public'
  };

  function addUser(user) {
    data.users.push(user);
  }

  function removeUser(_uid) {
    data.users = data.users.filter((user) => { return user._uid !== _uid; });
  }

  function addMessage(message) {
    data.messages.push(message);
  }

  Vue.filter('formatMessageDate', (value) => {
    return moment(value).format('h:mm A');
  });

  function isNotSubsequentMessage(currentMessage, index) {
    let previousMessage = data.messages[index - 1];
    if (!previousMessage) return true;
    return previousMessage.username !== currentMessage.username;
  }

  Vue.filter('isNotSubsequentMessage', isNotSubsequentMessage);

  Vue.filter('getMessageClass', (currentMessage, index) => {
    if (isNotSubsequentMessage(currentMessage, index) && index !== 0) {
      return 'message-top-padding';
    } else {
      return '';
    }
  });

  Vue.transition('messageAdded', {
    css: false,
    enter: function (el, done) {
      var messageList = document.getElementById('message-list');
      messageList.scrollTop = messageList.scrollHeight;
      done();
    },

  });

  let username = 'george'.concat(Math.floor((Math.random() * 100)))
    , avatar = 'http://www.picgifs.com/avatars/celebrities/nicolas-cage/avatars-nicolas-cage-621219.jpg'
    , _uid = Math.floor((Math.random() * 10000))
    ;

  new Vue({
    el: '#chat',
    data: data,
    methods: {
      changeChannel: function (user) {
        this.channel = user;
      },
      submitChat() {
        var chatText = cleanInput(this.chatText);
        if (chatText && connected) {
          this.chatText = '';
          let message = {
            username,
            message: chatText,
            date: Date.now(),
            isServerMessage: false,
            avatar
          };
          addMessage(message);
          socket.emit('chatTextClientToServer', message);
        }
      }
    }
  });

  // Add this user on page load
  (function() {
    let user = {
      username,
      _uid,
      avatar
    };
    socket.emit('userJoinedClientToServer', user);
    addUser(user);
  })();

  socket.on('userJoinedServerToClient', (obj) => {
    addUser(obj);
    addMessage({
      username: obj.username,
      avatar: obj.avatar,
      message: 'has joined.',
      isServerMessage: true
    });
  });

  socket.on('userLeftServerToClient', (obj) => {
    removeUser(obj._uid);
  });

  socket.on('chatTextServerToClient', (message) => {
    addMessage(message);
  });

});
