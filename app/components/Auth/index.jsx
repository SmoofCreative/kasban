import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions';

const Auth = React.createClass({
  _handleClick() {
    this.props.dispatch(Actions.doAuth())
  },

  render() {
    return (
      <div style={{display: 'inline-block', marginRight: 15}}>
        <button className="header__cta cta" onClick={this._handleClick}>Authmeplox</button>
      </div>
    );
  }
})

export default connect()(Auth);
