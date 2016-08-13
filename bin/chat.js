'use strict';

module.exports = (app, server) => {

  var io = require('socket.io')(server);

  io.on('connection', (socket) => {

    socket.on('chatTextClientToServer', (data) => {

      socket.emit('chatTextServerToClient', {
        username: 'johnsmith', // socket.username,
        date: data.date,
        message: data.message
      });

    });


  });

};
