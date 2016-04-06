import React from 'react';
import classNames from 'classnames';

import './style';
import UserImage from '../UserImage';
import DueDate from '../DueDate';

const Card = React.createClass({
  componentDidMount() {
    this.resizeInput();
  },

  renderDragHandle() {
    return (
      <div className="pure-u-1-24 swimcard__drag-handle">
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

  handleTaskUpdate(updateAsana = false) {
    const { cardNameInput } = this.refs;

    let task = {
      id: this.props.card.id,
      name: cardNameInput.value
    };

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
    }
  },

  handleTaskKeyUp() {
    this.resizeInput();
  },

  handleTaskSelected() {
    const { onCardClick, card } = this.props;
    onCardClick(card.id);
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
    const { card, connectDragSource, canDrop, isOver, isDraggable = false } = this.props;

    const classes = classNames('swimcard__card-border', { active: canDrop && isOver });

    return (
      <article onClick={this.handleTaskSelected} className="swimcard__card pure-g">
        <div className={classes}>

          <div className="pure-u-4-24 swimcard__image">
            <UserImage user={ card.assignee } />
          </div>

          <div className="pure-u-19-24 swimcard__card-content">
            { this.renderInput(card.name) }
            <DueDate card={card} isSmall={true} />
          </div>

          { isDraggable && connectDragSource(this.renderDragHandle()) }
        </div>
      </article>
    );
  }
});

export default Card;
