import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _flow from 'lodash/flow';

import './style';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.card.id,
      index: props.card.index
    };
  }
};

const cardTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    props.moveCard(item.id, component.props.card.id);
  }
};

const sourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const targetCollect = (connect) => ({
  connectDropTarget: connect.dropTarget()
})

const Card = ({ card }) => ({
  render() {
    const { connectDragSource, connectDropTarget } = this.props;

    return connectDragSource(connectDropTarget(
      <article className="swimcard__card pure-g">
        <div className="swimcard__card-border">

          <div className="pure-u-4-5 swimcard__card-content">
            <p className="swimcard__task">{card.name}</p>
            <time className="swimcard__date">{card.due_at}</time>
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
