import React from 'react';

import './style';
import Card from '../Card';

const Swimlane = React.createClass({
  _renderCards() {
    return this.props.cards.map((card) => (
      <Card key={card.id} card={card} />
    ));
  },

  render() {
    return (
      <section className="swimlane">
        <header className="swimlane__header">
          <h3 className="swimlane__header__text">{this.props.name}</h3>
        </header>

        <div className="swimlane__cards">
        { this._renderCards() }
        </div>

        <footer className="swimlane__card swimlane__card--add-item">
          <span>Add task...</span>
        </footer>
      </section>
    );
  }
});

export default Swimlane;
