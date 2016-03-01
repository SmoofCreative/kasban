import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _flow from 'lodash/flow';

import './style';

const cardSource = {
  beginDrag(props) {
    console.log('cardSource', props)
    return {
      id: props.card.id,
      index: props.card.index
      // index: props.findCard(props.card.id).index
    };
  },

  // endDrag(props, monitor) {
  //   const { id } = monitor.getItem();
  //   const didDrop = monitor.didDrop();

  //   console.log('endDrag', monitor.getItem())

  //   if (!didDrop) {
  //     // props.moveCard(droppedId, index);
  //     console.log('dropped', droppedId)
  //     // TODO trigger action?
  //   }
  // }
};

const cardTarget = {
  drop(props, monitor, component) {
    console.log('cardTarget', props);

    const item = monitor.getItem();


    // 1. update position in the swimlanes
    //  - swimlane on the card
    // 2. tell asana
    // 3. stop bubbling/propogation

    // TODO perform drop action?
  }
};

const sourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const targetCollect = (connect) => ({
  connectDropTarget: connect.dropTarget()
})

const Card = ({ card }) => ({
  propTypes: {
    connectDropTarget: PropTypes.func.isRequired
  },

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;
    // const {  } = this.props;


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
