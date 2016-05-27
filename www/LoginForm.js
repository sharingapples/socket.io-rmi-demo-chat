'use strict';

import React from 'react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      room: window.location.hash.substring(1) || 'public',
      name: 'John Doe',
    };

    this.onJoin = this.onJoin.bind(this);
  }

  onJoin(e) {
    this.props.onJoin(this.state.room, this.state.name);
  }

  updateState(inp, e) {
    this.state[inp] = e.target.value;
    this.setState({});
  }

  render() {
    const { rmi } = this.props;
    return (
      <div className="login-form">
        <input type="text" placeholder="Room" defaultValue={this.state.room}
          onChange={this.updateState.bind(this, 'room')}/>
        <input type="text" placeholder="Name" defaultValue={this.state.name}
          onChange={this.updateState.bind(this, 'name')}/>
        <button onClick={this.onJoin} disabled={rmi === null}>Join</button>
      </div>
    );
  }
}

export default LoginForm;
