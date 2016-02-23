import React from 'react';

import './style';
import Header from '../components/Header';
import Project from '../components/Project';

const Main = React.createClass({
  render() {
    return (
      <div>
        <Header />
        <Project />
      </div>
    );
  }
});

export default Main;
