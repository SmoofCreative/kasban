import React from 'react';

import './style';
import Card from '../Card';
import SwimlaneHeader from './header';
import SwimlaneFooter from './footer';

const Swimlane = React.createClass({
  handleNewTaskSubmit(task) {
    // Add the swimlane id
    let { id } = this.props;
    this.props.newTaskSubmit(task, id);
  },

  renderCards() {
    return this.props.cards.map((card) => (
      <Card key={card.id} card={card} moveCard={this.props.moveCard} />
    ));
  },

  render() {
    const { id, name, moveCard } = this.props;

    return (
      <section className="swimlane">
        <SwimlaneHeader id={id}
                        title={name}
                        moveCard={moveCard} />

        <div className="swimlane__cards">
          { this.renderCards() }
        </div>

        <SwimlaneFooter id={id} onSubmit={ this.handleNewTaskSubmit } />
      </section>
    );
  }
});

export default Swimlane;
