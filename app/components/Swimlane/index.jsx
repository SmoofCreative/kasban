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
      isSubTasks: false,
      fullHeight: false,
      hasGutter: true
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
      showInteractiveIcons,
      currentTaskId
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
        showInteractiveIcons: showInteractiveIcons,
        isFocused: currentTaskId === card.id
      };

      return isStatic
              ? <Card { ...cardProps } />
              : <DraggableCard { ...cardProps } onCardMoved={onCardMoved} />
    });
  },

  render() {
    const {
      id,
      name,
      completed,
      memberships,
      onCardMoved,
      onTaskUpdated,
      onSectionUpdated,
      isStatic,
      isFullWidth,
      fullHeight,
      hasGutter
    } = this.props;

    const sectionClasses = classNames('swimlane', {
      'swimlane--full-width': isFullWidth,
      'swimlane--no-gutter': !hasGutter
    });

    const cardClasses = classNames('swimlane__cards', {
      'swimlane__cards--full-height' : fullHeight
    });

    return (
      <section className={sectionClasses}>
        {
          isStatic
            ? <SwimlaneHeader id={id} title={name} onSectionUpdated={onSectionUpdated} />
            : <DroppableSwimlaneHeader
                id={id}
                title={name}
                completed={completed}
                memberships={memberships}
                onCardMoved={onCardMoved}
                onTaskUpdated={onTaskUpdated}
                onSectionUpdated={onSectionUpdated}
              />
        }
        <div className={cardClasses}>
          { this.renderCards() }
          <SwimlaneFooter id={id} onSubmit={ this.handleNewTaskSubmit } />
        </div>
      </section>
    );
  }
});

export default Swimlane;
