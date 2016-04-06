import React from 'react';

const SwimlaneHeader = React.createClass({

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
    const { title } = this.props;

    return (
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

export default SwimlaneHeader;
