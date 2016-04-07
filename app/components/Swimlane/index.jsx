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
      showInteractiveIcons: false,
      isSubTasks: false
    }
  },

  handleNewTaskSubmit(task) {
    const { onNewTaskSubmit, isSubTasks } = this.props;
    onNewTaskSubmit(task, isSubTasks);
  },
  
  renderCards() {
    const { 
      id, 
      cards, 
      cardEntities,
      onCardMoved, 
      onTaskSelected,
      onTaskUpdated, 
      isStatic, 
      showInteractiveIcons 
     } = this.props;

    return cards.map((cardId) => {
      const card = cardEntities[cardId];

      if (typeof card === 'undefined') {
        return false;
      }

      const cardProps = {
        key: card.id,
        card: card,
        onTaskUpdated: onTaskUpdated,
        onCardClick: onTaskSelected,
        sectionId: id,
        showInteractiveIcons: showInteractiveIcons
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
          <SwimlaneFooter id={id} onSubmit={ this.handleNewTaskSubmit } />
        </div>
      </section>
    );
  }
});

export default Swimlane;
