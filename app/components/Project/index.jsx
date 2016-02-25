import React from 'react';
import { connect } from 'react-redux';

import './style';
import Swimlane from '../Swimlane';

const Project = React.createClass({
  renderSwimlanes () {
    return this.props.sections.map((section) => (
      <Swimlane cards={section.cards} name={section.name} id={section.id} />
    ))
  },

  render() {
    // const { sections } = this.props;
    return (
      <main className="main">
        <div className="container">
          <div className="flex-container">

            { this.renderSwimlanes() }

          </div>
        </div>
      </main>
    );
  }
});

const mapStateToProps = (state) => ({
  sections: state.sections
});

export default connect(mapStateToProps)(Project);
