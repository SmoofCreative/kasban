import React from 'react';

const SwimlaneFooter = React.createClass({
  getInitialState() {
    return {
      newTaskText: ''
    };
  },

  handleNewTaskBlur(e) {
    this.handleNewTaskSubmit(e);
  },

  handleNewTaskSubmit(e) {
    e.preventDefault();
    let task = { name: this.state.newTaskText };
    this.setState({ newTaskText: '' });

    if (task.name.length) {
      this.props.onSubmit(task);
      // Once submit, refocus the input
      this.refs.newTaskInput.focus();
    }
  },

  handleNewTaskTextChange(e) {
    this.setState({ newTaskText: e.target.value });
  },

  renderInput() {
    return (
      <form onSubmit={ this.handleNewTaskSubmit }>
        <input type="text"
               className="swimlane__add-task"
               onBlur={this.handleNewTaskBlur}
               onChange={ this.handleNewTaskTextChange }
               value={ this.state.newTaskText }
               ref="newTaskInput"
               placeholder="Add task..." />
      </form>
    );
  },

  render() {
    return (
      <footer className="swimlane__footer">
        { this.renderInput() }
      </footer>
    );
  }
});

export default SwimlaneFooter;
