import React from 'react';

import './style';
import Swimlane from '../Swimlane';

const Project = React.createClass({
  _renderSwimlanes() {
    return <Swimlane />;
  },

  render() {
    return (
      <main className="main">
        <div className="container">
          <div className="flex-container">
            { this._renderSwimlanes() }
          </div>
        </div>
      </main>
    );
  }
});

export default Project;
