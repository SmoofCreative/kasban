import React from 'react';
import classNames from 'classnames';

import './style';
import UserImage from '../UserImage';
import DueDate from '../DueDate';

const Card = React.createClass({
  componentDidMount() {
    this.resizeInput();
  },

  handleTaskUpdate(updateAsana = false) {
    const { cardNameInput } = this.refs;

    let task = {
      id: this.props.card.id,
      name: cardNameInput.value
    };

    // Nothing changed, then there is no need to tell asana
    if (cardNameInput.value === cardNameInput.defaultValue) {
      updateAsana = false;
    }

    this.props.onTaskUpdated(task, updateAsana);
  },

  handleTaskUpdateBlur() {
    // When the user clicks off the textarea, submit their changes
    this.handleTaskUpdate(true);
  },

  handleTextChange() {
    this.handleTaskUpdate(false)
  },

  resizeInput() {
    const { cardNameInput } = this.refs;
    let height = 'auto';

    // Change the height of the input to match the content
    cardNameInput.style.height = height;
    cardNameInput.style.height = cardNameInput.scrollHeight + 'px';
  },

  handleTaskKeyDown(e) {
    // Check if the enter key has been pressed (without shift to still allow functionality)
    if (e.keyCode === 13 && !e.shiftKey) {
      // If so, stop the new line
      e.preventDefault();

      // Focus the parent element to trigger the input blur event
      e.target.parentElement.focus();
      return false;
    } else if (e.keyCode === 8 || e.keyCode === 46) {
      // If delete or backspace are pressed
      // This function is called before the deletion occurs

      // Check if the card value has any characters if not then delete the card
      const { cardNameInput } = this.refs;
      if (cardNameInput.value.trim().length === 0) {
        // Stop the backspace page navigation
        e.preventDefault();
        this.props.onDeleteTask(this.props.card.id);
      }
    }
  },

  handleTaskKeyUp() {
    this.resizeInput();
  },

  handleTaskSelected() {
    const { onCardClick, card } = this.props;
    onCardClick(card.id);
  },

  renderDragHandle(baseClass) {
    return (
      <div className={ baseClass }>
        <svg className="swimcard__drag-handle__icon" viewBox="0 0 32 32" title="drag handle">
          <rect x="6" y="2" width="4" height="4"></rect>
          <rect x="14" y="2" width="4" height="4"></rect>
          <rect x="6" y="10" width="4" height="4"></rect>
          <rect x="14" y="10" width="4" height="4"></rect>
          <rect x="6" y="18" width="4" height="4"></rect>
          <rect x="14" y="18" width="4" height="4"></rect>
          <rect x="22" y="2" width="4" height="4"></rect>
          <rect x="22" y="10" width="4" height="4"></rect>
          <rect x="22" y="18" width="4" height="4"></rect>
        </svg>
      </div>
    );
  },

  renderInteractiveIcons(baseClass) {
    return (
      <div className={ baseClass }>
        <i className="fa fa-chevron-right swimcard__view-subtask" onClick={this.handleTaskSelected}></i>
      </div>
    )
  },

  renderInteractiveSection(baseClass) {
    const { isDraggable, connectDragSource, showInteractiveIcons } = this.props;

    if (isDraggable) {
      const interactionSectionClasses = classNames(baseClass, {
        'swimcard__drag-handle': isDraggable
      });

      return connectDragSource(this.renderDragHandle(interactionSectionClasses));
    }

    if (showInteractiveIcons) {
      return this.renderInteractiveIcons(baseClass);
    }

    return <span></span>;
  },

  renderInput() {
    return (
      <form className="swimcard__update-form" tabIndex="-1">
        <textarea type="text"
               ref="cardNameInput"
               className="swimcard__update-input"
               value={ this.props.card.name }
               rows="1"
               onBlur={ this.handleTaskUpdateBlur }
               onKeyDown={ this.handleTaskKeyDown }
               onKeyUp={ this.handleTaskKeyUp }
               onChange={ this.handleTextChange } />
      </form>
    );
  },

  render() {
    const { card, canDrop, isOver, showInteractiveIcons, isFocused } = this.props;

    const classes = classNames('swimcard__card-border', {
      'active': canDrop && isOver,
      'swimcard__card-border--focused': isFocused
    });

    return (
      <article onClick={ !showInteractiveIcons && this.handleTaskSelected } className="swimcard__card pure-g">
        <div className={classes}>

          <div className="pure-u-4-24 swimcard__image">
            <UserImage user={ card.assignee } />
          </div>

          <div className="pure-u-19-24 swimcard__card-content">
            { this.renderInput(card.name) }
            <DueDate card={card} isSmall={true} />
          </div>

          { this.renderInteractiveSection('pure-u-1-24') }
        </div>
      </article>
    );
  }
});

export default Card;
