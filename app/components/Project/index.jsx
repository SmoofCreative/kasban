import React from 'react';
import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import './style';
import Swimlane from '../Swimlane';


const Project = React.createClass({

  renderSwimlanes () {
    return this.props.sections.map((section) => (
      <Swimlane cards={section.cards} name={section.name} id={section.id} />
    ))
  },

  // findCard(id) {
  //   const { cards } = this.state;
  //   const card = cards.filter(c => c.id === id)[0];

  //   console.log(cards)

  //   return {
  //     card,
  //     index: cards.indexOf(card)
  //   };
  // },

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
