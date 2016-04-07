import React from 'react';

const SwimlaneFooter = React.createClass({
  getInitialState() {
    return {
      isAdding: false,
      newTaskText: ''
    };
  },

  handleNewTaskClick() {
    this.setState({ isAdding: true });
  },

  handleNewTaskBlur(e) {
    this.handleNewTaskSubmit(e);
  },

  handleNewTaskSubmit(e) {
    e.preventDefault();
    let task = { name: this.state.newTaskText };
    this.setState({ isAdding: false, newTaskText: '' });

    if (task.name.length) {
      this.props.onSubmit(task);
    }
  },

  handleNewTaskTextChange(e) {
    this.setState({ newTaskText: e.target.value });
  },

  renderText() {
    return (
      <span className="swimlane__placeholder">Add task...</span>
    );
  },

  renderInput() {
    return (
      <form onSubmit={ this.handleNewTaskSubmit }>
        <input type="text"
               className="swimlane__add-task"
               autoFocus
               onBlur={this.handleNewTaskBlur}
               onChange={ this.handleNewTaskTextChange }
               value={ this.state.newTaskText } />
      </form>
    );
  },

  render() {
    return (
      <footer className="swimlane__footer" onClick={ this.handleNewTaskClick }>
        { this.state.isAdding ? this.renderInput() : this.renderText() }
      </footer>
    );
  }
});

export default SwimlaneFooter;
