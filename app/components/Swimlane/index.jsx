import React from 'react';

import './style';
import Card from '../Card';

const Swimlane = React.createClass({
  _renderCards() {
    return this.props.cards.map((card) => (
      <Card key={card.id} name={card.name} />
    ));
  },

  render() {
    return (
      <section className="swimlane">
        <header className="swimlane__header">
          <h3 className="swimlane__header__text">In progress</h3>
        </header>

        { this._renderCards() }

        <footer className="swimlane__card swimlane__card--add-item">
          <span>Add task...</span>
        </footer>
      </section>
    );
  }
});

export default Swimlane;
