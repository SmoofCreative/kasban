import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _flow from 'lodash/flow';
import moment from 'moment';
import classNames from 'classnames';

import './style';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.card.id
    };
  }
};

const cardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.moveCard(item.id, props.card.id);
  }
};

const sourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

const targetCollect = (connect) => ({
  connectDropTarget: connect.dropTarget()
});

const formatDate = (date) => {
  let today = moment().startOf('day');
  let dueDate = moment(date).startOf('day');

  if (date === null) {
    return 'No due date';
  } else if (today.isSame(dueDate)) {
    return 'Today';
  } else {
    return moment(date).format('MMM DD');
  }
};

const dueDateClasses = (date) => {
  let classes = [];

  if (date !== null) {
    let today = moment().startOf('day');
    let dueDate = moment(date).startOf('day');

    classes.push({
      'swimcard__date--today': today.isSame(dueDate),
      'swimcard__date--late': dueDate.isBefore(today)
    });
  }

  return classNames('swimcard__date', classes);
};

const renderDueDate = ({due_on, completed}) => {
  if (completed) return false;

  return (
    <time className={ dueDateClasses(due_on) }>
      { formatDate(due_on) }
    </time>
  );
};

const renderDragHandle = () => {
  return (
    <div className="pure-u-1-8 swimcard__drag-handle">
      <div className="v-wrap">
        <div className="v-content">
          <svg className="swimcard__drag-handle__icon" viewBox="0 0 32 32" title="drag handle">
            <rect x="6" y="2" width="4" height="4"></rect>
            <rect x="14" y="2" width="4" height="4"></rect>
            <rect x="6" y="10" width="4" height="4"></rect>
            <rect x="14" y="10" width="4" height="4"></rect>
            <rect x="6" y="18" width="4" height="4"></rect>
            <rect x="14" y="18" width="4" height="4"></rect>
            <rect x="6" y="26" width="4" height="4"></rect>
            <rect x="14" y="26" width="4" height="4"></rect>
            <rect x="22" y="2" width="4" height="4"></rect>
            <rect x="22" y="10" width="4" height="4"></rect>
            <rect x="22" y="18" width="4" height="4"></rect>
            <rect x="22" y="26" width="4" height="4"></rect>
          </svg>
        </div>
      </div>
    </div>
  );
};

const Card = ({ card }) => ({
  render() {
    const { connectDragSource, connectDropTarget, connectDragPreview } = this.props;

    return connectDragPreview(connectDropTarget(
      <article className="swimcard__card pure-g">
        <div className="swimcard__card-border">
          <div className="pure-u-7-8 swimcard__card-content">
            <p className="swimcard__task">{card.name}</p>
            { renderDueDate(card) }
          </div>
          { connectDragSource(renderDragHandle()) }
        </div>
      </article>
    ));
  }
})

export default _flow(
  DragSource('card', cardSource, sourceCollect),
  DropTarget('card', cardTarget, targetCollect)
)(Card);
