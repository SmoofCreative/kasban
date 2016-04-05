import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _flow from 'lodash/flow';

import Card from '../components/Card';

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

const targetCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

const DraggableCard = (props) => {
  const { connectDropTarget, connectDragPreview } = props;
  return connectDragPreview(connectDropTarget(<div><Card {...props} isDraggable={ true } /></div>))
};

export default _flow(
  DragSource('card', cardSource, sourceCollect),
  DropTarget('card', cardTarget, targetCollect)
)(DraggableCard);
