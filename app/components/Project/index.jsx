import React from 'react';
import { connect } from 'react-redux';

import './style';
import Swimlane from '../Swimlane';

const Project = React.createClass({
  render() {
    const { cards } = this.props;
    return (
      <main className="main">
        <div className="container">
          <div className="flex-container">
            <Swimlane cards={cards} />
          </div>
        </div>
      </main>
    );
  }
});

const mapStateToProps = (state) => ({
  cards: []
});

export default connect(mapStateToProps)(Project);
