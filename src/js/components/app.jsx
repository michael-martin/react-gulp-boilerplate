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
      <div className='hello-world'>
        <h2>Obligatory Hello World example</h2>
        <p>Enter your name below, then make a change to the app.jsx file. See how your app re-compiles instantly, and the state (your name) is still preserved?</p>
        <input
          onChange={(e) => this.onChange(e)}
          placeholder='What is your name?'
          type='text'
          value={this.state.val}
        />
        <p>Hello {this.state.val}</p>
      </div>
    );
  }
}
