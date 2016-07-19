import React from 'react';
import classNames from 'classnames';

import './style';
import DraggableCard from '../../containers/DraggableCard';
import Card from '../Card';
import DroppableSwimlaneHeader from '../../containers/DroppableSwimlaneHeader';
import DroppableSwimlaneFooter from '../../containers/DroppableSwimlaneFooter';
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
      hasGutter: true,
      isPlaceholder: false
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
      onDeleteTask,
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
        onDeleteTask: onDeleteTask,
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
      onSwimlaneToggle,
      isStatic,
      isFullWidth,
      fullHeight,
      hasGutter,
      headerPlaceholder,
      isPlaceholder
    } = this.props;

    const sectionClasses = classNames('swimlane', {
      'swimlane--full-width': isFullWidth,
      'swimlane--no-gutter': !hasGutter
    });

    const cardClasses = classNames('swimlane__cards', {
      'swimlane__cards--full-height' : fullHeight
    });

    const headerProps = {
      id: id,
      title: name,
      placeholder: headerPlaceholder,
      onSectionUpdated: onSectionUpdated,
      onSwimlaneToggle: onSwimlaneToggle,
      isPlaceholder: isPlaceholder
    };

    const footerProps = {
      id: id,
      onSubmit: this.handleNewTaskSubmit
    };

    return (
      <section className={sectionClasses}>
        {
          isStatic
            ? <SwimlaneHeader { ...headerProps } />
            : <DroppableSwimlaneHeader
                { ...headerProps }
                completed={completed}
                memberships={memberships}
                onCardMoved={onCardMoved}
                onTaskUpdated={onTaskUpdated}
              />
        }
        <div className={cardClasses}>
          { this.renderCards() }
          {
            isStatic
              ? <SwimlaneFooter { ...footerProps } />
              : <DroppableSwimlaneFooter { ...footerProps } onCardMoved={onCardMoved} />
          }
        </div>
      </section>
    );
  }
});

export default Swimlane;
