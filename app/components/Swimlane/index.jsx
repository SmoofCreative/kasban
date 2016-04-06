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
      isFullWidth: false
    }
  },

  handleTaskSelected(taskId) {
    let { id, onTaskSelected } = this.props;
    onTaskSelected(taskId, id);
  },
  
  renderCards() {
    const { id, cards, cardEntities, onCardMoved, onTaskUpdated, isStatic } = this.props;

    return cards.map((cardId) => {
      const card = cardEntities[cardId];

      const cardProps = {
        key: card.id,
        card: card,
        onTaskUpdated: onTaskUpdated,
        onCardClick: this.handleTaskSelected,
        sectionId: id
      };

      return isStatic
              ? <Card { ...cardProps } />
              : <DraggableCard { ...cardProps } onCardMoved={onCardMoved} />
    });
  },

  render() {
    const { id, name, completed, memberships, onCardMoved, onTaskUpdated, isStatic, isFullWidth } = this.props;

    const sectionClasses = classNames('swimlane', {
      'swimlane--full-width': isFullWidth
    });

    return (
      <section className={sectionClasses}>
        {
          isStatic
            ? <SwimlaneHeader id={id} title={name} onTaskUpdated={onTaskUpdated} />
            : <DroppableSwimlaneHeader
                id={id}
                title={name}
                completed={completed}
                memberships={memberships}
                onCardMoved={onCardMoved}
                onTaskUpdated={onTaskUpdated} />
        }
        <div className="swimlane__cards">
          { this.renderCards() }
          <SwimlaneFooter id={id} onSubmit={ this.props.onNewTaskSubmit } />
        </div>
      </section>
    );
  }
});

export default Swimlane;
