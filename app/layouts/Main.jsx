import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import Project from '../components/Project';
import Auth from '../components/Auth'
import Actions from '../actions';

const Main = React.createClass({
  componentDidMount() {
    this.props.dispatch(Actions.checkAuth())
  },

  render() {
    return (
      <div>
        <Header />

        <Auth />

        <Project />
      </div>
    );
  }
});

export default connect()(Main);
