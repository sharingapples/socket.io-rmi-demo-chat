'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: window.location.hash.substring(1) || 'public',
      name: '',
    };

    this.onJoin = this.onJoin.bind(this);
    this.trySubmit = this.trySubmit.bind(this);
  }

  trySubmit(e) {
    if (e.charCode === 13) {
      this.onJoin();
    }
  }

  onJoin() {
    const { room, name } = this.state;
    if (room.trim().length > 0 && name.trim().length > 0) {
      this.props.onJoin(this.state.room, this.state.name);
    }
  }

  updateState(inp, e) {
    this.state[inp] = e.target.value;
    this.setState({});
  }

  componentDidMount() {
    const elem = findDOMNode(this.refs.name);
    if (elem) {
      elem.focus();
    }

  }

  render() {
    const { rmi } = this.props;
    const { room, name } = this.state;

    const disabled = rmi === null || room.trim().length == 0 || name.trim().length == 0;
    return (
      <div className="login-form">
        <input type="text" placeholder="Room" value={room}
          onChange={this.updateState.bind(this, 'room')}
          onKeyPress={this.trySubmit}/>
        <input ref="name" type="text" placeholder="Name" value={name}
          onChange={this.updateState.bind(this, 'name')}
          onKeyPress={this.trySubmit}/>
        <button onClick={this.onJoin} disabled={disabled}>Join</button>
      </div>
    );
  }
}

export default LoginForm;
