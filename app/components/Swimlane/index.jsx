import React from 'react';
import classNames from 'classnames';

import './style';
import DraggableCard from '../../containers/DraggableCard';
import Card from '../Card';
import DroppableSwimlaneHeader from '../../containers/DroppableSwimlaneHeader';
import SwimlaneHeader from './header';
import SwimlaneFooter from './footer';


const Swimlane = React.createClass({
  getDefaultProps() {
    return {
      isStatic: false,
      isFullWidth: false,
      isSubTasks: false
    }
  },

  handleNewTaskSubmit(task) {
    // Add the swimlane id
    let { id, newTaskSubmit} = this.props;
    newTaskSubmit(task, id);
  },

  handleTaskSelected(taskId) {
    let { id, onTaskSelected, isSubTasks } = this.props;

    if (!isSubTasks) {
      onTaskSelected(taskId, id);
    }
  },

  renderCards() {
    const { cards, cardEntities, moveCard, taskUpdate, isStatic } = this.props;

    return cards.map((cardId) => {
      const card = cardEntities[cardId];

      const cardProps = {
        key: card.id,
        card: card,
        taskUpdate: taskUpdate,
        onCardClick: this.handleTaskSelected
      };

      return isStatic
              ? <Card { ...cardProps } />
              : <DraggableCard { ...cardProps } moveCard={moveCard} />
    });
  },

  render() {
    const { id, name, moveCard, taskUpdate, isStatic, isFullWidth } = this.props;

    const sectionClasses = classNames('swimlane', {
      'swimlane--full-width': isFullWidth
    });

    return (
      <section className={sectionClasses}>

        {
          isStatic
            ? <SwimlaneHeader id={id} title={name} taskUpdate={taskUpdate} />
            : <DroppableSwimlaneHeader id={id} title={name} moveCard={moveCard} taskUpdate={taskUpdate} />
        }


        <div className="swimlane__cards">
          { this.renderCards() }
          <SwimlaneFooter id={id} onSubmit={ this.handleNewTaskSubmit } />
        </div>
      </section>
    );
  }
});

export default Swimlane;
