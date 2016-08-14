'use strict';

module.exports = (app, server) => {

  var io = require('socket.io')(server);

  io.on('connection', (socket) => {

    let addedUser = false;

    socket.on('userJoinedClientToServer', (username) => {

      if (addedUser) return;
      socket.username = username;
      addedUser = true;

      socket.broadcast.emit('userJoinedServerToClient', {
        username: socket.username,
      });
    });

    socket.on('chatTextClientToServer', (data) => {

      socket.broadcast.emit('chatTextServerToClient', data);

    });


  });

};
