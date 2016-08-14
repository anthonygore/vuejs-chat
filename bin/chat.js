'use strict';

module.exports = (app, server) => {

  var io = require('socket.io')(server);

  io.on('connection', (socket) => {

    let addedUser = false;

    socket.on('userJoinedClientToServer', (user) => {

      if (addedUser) return;
      socket.user = user;
      addedUser = true;

      socket.broadcast.emit('userJoinedServerToClient', socket.user);
    });

    socket.on('chatTextClientToServer', (data) => {

      socket.broadcast.emit('chatTextServerToClient', data);

    });


  });

};
