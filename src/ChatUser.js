'use strict';

const ChatRoom = require('./ChatRoom');

let userId = 0;
class ChatUser {
  constructor() {
    console.log('New Chat User created');

    // A new user has been connected
    this.id = ++userId;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  login(room, name, eventHandler) {
    console.log('EventHandler is ', eventHandler);
    this.room = ChatRoom.get(room);
    this.name = name;
    this.eventHandler = eventHandler;
    this.room.join(this);
    return Object.keys(this.room.users).map(key => this.room.users[key]);
  }

  startTyping() {
    this.room.sendEvent(this, 'typing');
  }

  stopTyping() {
    this.room.sendEvent(this, 'stopped typing');
  }

  sendMessage(message) {
    this.room.sendMessage(this, message);
  }

  logout() {
    if (this.room) {
      this.room.leave(this);
    }
  }

  destructor() {
    this.logout();
  }
}

ChatUser.Map = {
  login: 'array',
  startTyping: null,
  stopTyping: null,
  sendMessage: null,
  logout: null,
};

module.exports = ChatUser;
