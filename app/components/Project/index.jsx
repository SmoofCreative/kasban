import React from 'react';
import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import './style';
import Swimlane from '../Swimlane';
import Actions from '../../actions';

const Project = React.createClass({

  handleCardMove(idToMove, idToInsertAfter) {
    this.props.dispatch(Actions.moveCard(idToMove, idToInsertAfter));
  },

  renderSwimlanes () {
    return this.props.sections.map((section) => (
      <Swimlane key={section.id}
                cards={section.cards}
                name={section.name}
                moveCard={this.handleCardMove} />
    ))
  },

  render() {
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

export default _flow(
  connect(mapStateToProps),
  DragDropContext(HTML5Backend)
)(Project);
