'use strict';

// All the rooms that have been created so far
let rooms = {};

class ChatRoom {
  constructor(name) {
    this.name = name;
    this.users = {};
  }

  join(user) {
    // Let all the user's know that a new user has joined
    Object.keys(this.users).forEach(key => {
      console.log('Found user with key', key, this.users[key]);
      this.users[key].eventHandler.onEvent(user, 'join');
    });

    // add the user
    console.log('Joining user ', user.id, user.name);
    this.users[user.id] = user;
  }

  leave(user, eventHandler) {
    delete this.users[user.id];

    let count = 0;
    Object.keys(this.users).forEach(key => {
      count += 1;
      this.users[key].eventHandler.onEvent(user, 'leave');
    });

    if (count == 0) {
      // Also remove the room if there aren't any users left
      delete rooms[this.name];
    }
  }

  sendMessage(user, message) {
    Object.keys(this.users).forEach(key => {
      this.users[key].eventHandler.onMessage(user, message);
    });
  }

  sendEvent(user, event) {
    Object.keys(this.users).forEach(key => {
      if (key != user.id) {
        this.users[key].eventHandler.onEvent(user, event);
      }
    });
  }
}

ChatRoom.get = function (name) {
  if (rooms[name] === undefined)
    rooms[name] = new ChatRoom(name);
  return rooms[name];
};

module.exports = ChatRoom;
