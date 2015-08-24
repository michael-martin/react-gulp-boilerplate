'use strict';

import React from 'react';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange(e) {
    this.setState({
      val: e.target.value,
    });
  }

  render() {
    return (
      <div>
          <h1>Magical state keeper: {this.state.val}</h1>
          <input type='text' onChange={(e) => this.onChange(e)} />
      </div>
    );
  }
}
