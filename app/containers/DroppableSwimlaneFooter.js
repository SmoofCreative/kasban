import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import SwimlaneFooter from '../components/Swimlane/footer.jsx';

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

const DroppableSwimlaneFooter = (props) => {
  const { connectDropTarget } = props;
  return connectDropTarget(<div><SwimlaneFooter {...props} /></div>) ;
};

DroppableSwimlaneFooter.propTypes = {
  onCardMoved: PropTypes.func.isRequired
};

export default DropTarget('card', cardTarget, collect)(DroppableSwimlaneFooter);
