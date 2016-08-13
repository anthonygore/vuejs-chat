'use strict';

requirejs.config({
  'paths': {
    'vuejs': 'https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.26/vue',
    'socket.io-client': 'https://cdn.socket.io/socket.io-1.4.5',
    'momentjs': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min',
    'chat': './chat'
  }
});

requirejs(['index']);
