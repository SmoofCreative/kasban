import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import SwimlaneHeader from '../components/Swimlane/header.jsx';

const cardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();

    const data = {
      ...props,
      sectionId: props.id
    };

    props.onCardMoved(item, data);
  }
};

const collect = (connect) => ({
  connectDropTarget: connect.dropTarget()
});

const DroppableSwimlaneHeader = (props) => {
  const { connectDropTarget } = props;
  return connectDropTarget(<div><SwimlaneHeader {...props} /></div>) ;
};

DroppableSwimlaneHeader.propTypes = {
  onCardMoved: PropTypes.func.isRequired
};

export default DropTarget('card', cardTarget, collect)(DroppableSwimlaneHeader);
