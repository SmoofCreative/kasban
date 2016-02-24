import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions';

const Auth = React.createClass({
  _handleClick() {
    this.props.dispatch(Actions.doAuth())
  },

  render() {
    return (
      <div style={{paddingTop: 85, paddingLeft: 50}}>
        <button onClick={this._handleClick}>Authmeplox</button>
      </div>
    );
  }
})

export default connect()(Auth);
