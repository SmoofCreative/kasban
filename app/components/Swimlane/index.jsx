import React, { PropTypes }  from 'react';
import { DropTarget } from 'react-dnd';

import './style';
import Card from '../Card';

const cardTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    console.log('swimlanetarget', item, props, component);
    // TODO perform drop action?
  }
};

const collect = (connect) => ({
  connectDropTarget: connect.dropTarget()
});

const Swimlane = React.createClass({
  propTypes: {
    connectDropTarget: PropTypes.func.isRequired
  },

  _renderCards() {

    // add an .index attribute to the cards
    let cards = this.props.cards.map((i,k) => {
      i.index = k;
      return i;
    });

    return cards.map((card) => (
      <Card key={card.id} card={card} />
    ));
  },

  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <section className="swimlane">
        <header className="swimlane__header">
          <h3 className="swimlane__header__text">{this.props.name}</h3>
        </header>

        <div className="swimlane__cards">
        { this._renderCards() }
        </div>

        <footer className="swimlane__footer">
          <span>Add task...</span>
        </footer>
      </section>
    );
  }
});

export default DropTarget('card', cardTarget, collect)(Swimlane);
