'use strict';

import React from 'react';
import { render } from 'react-dom';
import ChatWindow from './ChatWindow';

const RMIClient = require('socket.io-rmi-client');

//import io from 'socket.io-client';
const io = require('socket.io-client');

console.log(RMIClient.EventHandler);

class ChatEventHandler extends RMIClient.EventHandler {
  constructor() {
    super();
  }

  onMessage(user, message) {
    console.log('message', message, user);
  }

  onEvent(user, event) {
    console.log('event', event, user);
  }
}

const eventHandler = new ChatEventHandler();

const res = RMIClient.connect(io, '');

res.onConnected = (rmi) => {
  chatWindow.onConnected(rmi);
};

res.onDisconnected = () => {
  chatWindow.setState({
    rmi: null,
  });
};

res.onError = (error) => {

};

const chatWindow = render(<ChatWindow />, document.getElementById('content'));
