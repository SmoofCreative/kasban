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

const Card = ({ card }) => ({
  render() {
    const { connectDragSource, connectDropTarget } = this.props;

    return connectDragSource(connectDropTarget(
      <article className="swimcard__card pure-g">
        <div className="swimcard__card-border">
          <div className="pure-u-4-5 swimcard__card-content">
            <p className="swimcard__task">{card.name}</p>
            { renderDueDate(card) }
          </div>
        </div>
      </article>
    ));
  }
})

export default _flow(
  DragSource('card', cardSource, sourceCollect),
  DropTarget('card', cardTarget, targetCollect)
)(Card);
