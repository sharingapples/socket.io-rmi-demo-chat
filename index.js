'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/', express.static(__dirname + '/static'));

const RmiServer = require('socket.io-rmi-server');
const ChatUser = require('./src/ChatUser');

RmiServer.start(io, ChatUser, ChatUser.Map);

http.listen(3000, () => {
  console.log('App listening on port 3000');
});
