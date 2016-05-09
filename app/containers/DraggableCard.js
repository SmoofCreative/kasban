import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _flow from 'lodash/flow';

import Card from '../components/Card';

const cardSource = {
  beginDrag(props) {
    return {
      ...props.card,
      sectionId: props.sectionId
    };
  }
};

const cardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();

    const data = {
      ...props.card,
      sectionId: props.sectionId
    };

    props.onCardMoved(item, data);
  }
};

const sourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

const targetCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

const DraggableCard = (props) => {
  const { connectDropTarget, connectDragPreview } = props;
  return connectDragPreview(connectDropTarget(<div><Card {...props} isDraggable={ true } /></div>));
};

DraggableCard.propTypes = {
  card: PropTypes.object.isRequired,
  onCardMoved: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

export default _flow(
  DragSource('card', cardSource, sourceCollect),
  DropTarget('card', cardTarget, targetCollect)
)(DraggableCard);
