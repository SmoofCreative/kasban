import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions';

const Auth = React.createClass({
  handleClick() {
    this.props.dispatch(Actions.doAuth())
  },

  render() {
    return (
      <button className="header__cta cta" onClick={this.handleClick}>Authenticate</button>
    );
  }
})

export default connect()(Auth);
