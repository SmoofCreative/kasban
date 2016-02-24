import React from 'react';

import './style';
import Header from '../components/Header';
import Project from '../components/Project';
import Auth from '../components/Auth'

const Main = React.createClass({
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

export default Main;
