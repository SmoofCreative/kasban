import React from 'react';

const SwimlaneHeader = React.createClass({
  handleTextUpdate(updateAsana = false) {
    let section = {
      id: this.props.id,
      name: this.refs.sectionInput.value
    };

    this.props.onSectionUpdated(section, updateAsana);
  },

  handleTextBlur() {
    this.handleTextUpdate(true)
  },

  handleTextChange() {
    this.handleTextUpdate(false)
  },

  handleTaskKeyDown(e) {
    // Check if the enter key has been pressed (without shift to still allow functionality)
    if (e.keyCode === 13 && !e.shiftKey) {
      // If so, stop the new line
      e.preventDefault();

      // Focus the parent element to trigger the input blur event
      e.target.parentElement.focus();
      return false;
    }
  },

  renderInput() {
    return (
      <form className="swimlane__header__update-form" onSubmit={ this.handleTitleUpdate }>
        <input type="text"
               className="swimlane__header__update-input"
               ref="sectionInput"
               onBlur={ this.handleTextBlur }
               onChange={ this.handleTextChange }
               onKeyDown={ this.handleTaskKeyDown }
               value={ this.props.title} />
      </form>
    );
  },

  render() {
    return (
      <header className="swimlane__header">
        { this.renderInput() }
      </header>
    );
  }
});

export default SwimlaneHeader;
