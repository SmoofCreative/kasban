import React from 'react';

import './style';
import Card from '../Card';
import SwimlaneHeader from './header';

const Swimlane = React.createClass({
  renderCards() {
    return this.props.cards.map((card) => (
      <Card key={card.id} card={card} moveCard={this.props.moveCard} />
    ));
  },

  render() {

    return (
      <section className="swimlane">
        <SwimlaneHeader title={ this.props.name } />

        <div className="swimlane__cards">
        { this.renderCards() }
        </div>

        <footer className="swimlane__footer">
          <span>Add task...</span>
        </footer>
      </section>
    );
  }
});

export default Swimlane;
