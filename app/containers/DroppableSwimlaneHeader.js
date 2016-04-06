import React from 'react';
import { DropTarget } from 'react-dnd';

import SwimlaneHeader from '../components/Swimlane/header.jsx';

const cardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.moveCard(item.id, props.id);
  }
};

const collect = (connect) => ({
  connectDropTarget: connect.dropTarget()
});

const DroppableSwimlaneHeader = (props) => {
  const { connectDropTarget } = props;
  return connectDropTarget(<div><SwimlaneHeader {...props} /></div>) ;
};

export default DropTarget('card', cardTarget, collect)(DroppableSwimlaneHeader);
