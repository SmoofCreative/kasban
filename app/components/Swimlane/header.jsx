import React, { PropTypes }  from 'react';
import { DropTarget } from 'react-dnd';

const cardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    console.log('swimlaneheadertarget', item);
  }
};

const collect = (connect) => ({
  connectDropTarget: connect.dropTarget()
});

const SwimlaneHeader = React.createClass({
  propTypes: {
    connectDropTarget: PropTypes.func.isRequired
  },

  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <header className="swimlane__header">
        <h3 className="swimlane__header__text">{this.props.title}</h3>
      </header>
    );
  }
});

export default DropTarget('card', cardTarget, collect)(SwimlaneHeader);
