'use strict';
import React from 'react';
import { findDOMNode } from 'react-dom';

import LoginForm from './LoginForm';
const RMIClient = require('socket.io-rmi-client');

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: null,
      name: null,
      rmi: null,
      message: '',
      logs: [],
      typers: {},
      users: {},
    };

    this._renderLog = this._renderLog.bind(this);
    this.onSend = this.onSend.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onJoin = this.onJoin.bind(this);
    this.onTimer = this.onTimer.bind(this);
    this.timer = null;

    this.eventHandler = new RMIClient.EventHandler();
    this.eventHandler.onMessage = this.onMessage.bind(this);
    this.eventHandler.onEvent = this.onEvent.bind(this);
  }

  onConnected(rmi) {
    this.state.rmi = rmi;
    if (this.state.room) {
      this.onJoin(this.state.room, this.state.name);
    }

    this.setState({
      rmi: rmi,
    });
  }

  onMessage(user, message) {
    this.appendLog('msg', user, message);
  }

  appendLog(type, user, data) {
    this.state.logs.push({
      type, user, data,
    });
    this.setState({
      logs: this.state.logs,
    });
  }

  componentDidUpdate() {
    // Scroll the window to view
    const elem = findDOMNode(this.refs.logs);
    if (elem) {
      elem.scrollTop = elem.scrollHeight - elem.offsetHeight;
      //console.log(elem.scrollHeight);
    }
    //findDOMNode(this.refs.logs).scrollTo(0, )
  }

  onEvent(user, event) {
    console.log('Event', event, user);
    if (event === 'typing') {
      this.state.typers[user.id] = user;
      this.setState({
        typers: this.state.typers,
      });
    } else if (event === 'stopped typing') {
      delete this.state.typers[user.id];
      this.setState({
        typers: this.state.typers,
      });
    } else if (event === 'join') {
      this.state.users[user.id] = user;
      this.setState({
        users: this.state.users,
      });
      this.appendLog('status', user, 'joined');
    } else if (event === 'leave') {
      console.log('User', user.id, user.name, ' left');
      delete this.state.typers[user.id];
      delete this.state.users[user.id];
      this.setState({
        users: this.state.users,
        typers: this.state.typers,
      });
      console.log(this.state.users);
      this.appendLog('status', user, 'left');
    }
  }

  onJoin(room, name) {
    this.state.rmi.login(room, name, this.eventHandler).then(users => {
      const usersObject = {};
      users.forEach(user => usersObject[user.id] = user);
      this.setState({
        room: room,
        name: name,
        users: usersObject,
      });
      console.log(`${users.length} users in ${room}`, users);
    });
  }

  clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onSend() {
    if (this.state.message) {
      this.clearTimer();
      this.state.rmi.sendMessage(this.state.message);
      this.state.rmi.stopTyping();
      this.setState({
        message: '',
      });
    }
  }

  onTimer() {
    console.log('Stopped Typing');
    this.clearTimer();
    this.state.rmi.stopTyping();
  }

  onKeyPress(e) {
    if (e.charCode === 13) {
      this.onSend();
    }
  }

  onChange(e) {
    this.clearTimer();
    this.timer = setTimeout(this.onTimer, 3000);
    this.state.rmi.startTyping();
    this.setState({
      message: e.target.value,
    });
  }

  _renderLog(log, idx) {
    return (
      <div className={'log-' + log.type} key={idx}>
        <span className="user">
          {log.user.name}
        </span>
        <span className="data">
          {log.data}
        </span>
      </div>
    );
  }

  _renderTypers(list) {
    if (list.length == 0)
      return false;

    console.log(list);
    let inner = null;
    if (list.length === 1) {
      inner = <div>{list[0].name} is typing</div>;
    } else if (list.length === 2) {
      inner = <div>{list[0].name} and {list[1].name} are typing</div>;
    } else {
      const last = list[list.length - 1];
      inner = <div>{last.name} and {list.length - 1} others are typing</div>;
    }

    return (
      <div className="typer-status">
        {inner}
      </div>
    );
  }

  render() {
    const { room, name, rmi, typers, users, logs, message } = this.state;
    const typersArray = Object.keys(typers).map(key => typers[key]);
    const usersArray = Object.keys(users).map(key => users[key]);
    if (!room) {
      return <LoginForm rmi={rmi} onJoin={this.onJoin}/>;
    } else {
      return (
        <div className="chat-window">
          <div className="title-bar">
            {name} ({room}) <span className="count">{usersArray.length}</span>
          </div>
          <div ref="logs" className="logs">
            <div className="messages">
              {logs.map(this._renderLog)}
            </div>
          </div>
          {this._renderTypers(typersArray)}
          <div className="input-bar">
            <input type="text" placeholder="Type your message..."
                  onChange={this.onChange}
                  onKeyPress={this.onKeyPress} value={message} />
            <button onClick={this.onSend}>Send</button>
          </div>
        </div>
      );
    }
  }
}

export default ChatWindow;
