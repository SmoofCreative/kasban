import React, { PropTypes }  from 'react';
import { DropTarget } from 'react-dnd';

const cardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.moveCard(item.id, props.id);
  }
};

const collect = (connect) => ({
  connectDropTarget: connect.dropTarget()
});

const SwimlaneHeader = React.createClass({
  propTypes: {
    connectDropTarget: PropTypes.func.isRequired
  },

  getInitialState() {
    return { isUpdatingTitle: false };
  },

  handleTitleNameClick() {
    // Show the input
    this.setState({ isUpdatingTitle: true });
  },

  handleTitleUpdate(e) {
    e.preventDefault();
    let task = {
      id: this.props.id,
      name: this.refs.sectionInput.value
    };

    // Reset the UI, we'll change the task name in the stores
    this.setState({ isUpdatingTitle: false });
    this.props.taskUpdate(task, true);
  },

  handleTitleUpdateBlur() {
    // Remove the input and reset the name
    this.setState({ isUpdatingTitle: false });
  },

  renderTitle(title) {
    return (
      <h3 className="swimlane__header__text" onClick={ this.handleTitleNameClick }>{title}</h3>
    );
  },

  renderInput() {
    return (
      <form className="swimlane__header__update-form" onSubmit={ this.handleTitleUpdate }>
        <input type="text"
               className="swimlane__header__update-input"
               autoFocus
               ref="sectionInput"
               onBlur={ this.handleTitleUpdateBlur }
               defaultValue={ this.props.title} />
      </form>
    );
  },

  render() {
    const { connectDropTarget, title } = this.props;

    return connectDropTarget(
      <header className="swimlane__header">
        {
          this.state.isUpdatingTitle ?
          this.renderInput() :
          this.renderTitle(title)
        }
      </header>
    );
  }
});

export default DropTarget('card', cardTarget, collect)(SwimlaneHeader);
