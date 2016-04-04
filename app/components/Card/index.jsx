import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _flow from 'lodash/flow';
import moment from 'moment';
import classNames from 'classnames';

import './style';
import UserImage from '../UserImage';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.card.id
    };
  }
};

const cardTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    props.moveCard(item.id, props.card.id);
  }
};

const sourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});

const targetCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

const Card = React.createClass({
  componentDidMount() {
    this.resizeInput();
  },

  formatDate({ completed, due_on }) {
    let today = moment().startOf('day');
    let dueDate = moment(due_on).startOf('day');

    if (completed) {
      return 'Completed';
    }

    if (due_on === null || typeof due_on === 'undefined') {
      return 'No due date';
    }

    if (today.isSame(dueDate)) {
      return 'Today';
    }

    return moment(due_on).format('MMM DD');
  },

  dueDateClasses({ completed, due_on }) {
    let classes = [];

    if (due_on !== null && typeof due_on !== 'undefined' && !completed) {
      let today = moment().startOf('day');
      let dueDate = moment(due_on).startOf('day');

      classes.push({
        'swimcard__date--today': today.isSame(dueDate),
        'swimcard__date--late': dueDate.isBefore(today)
      });
    }

    return classNames('swimcard__date', classes);
  },

  renderDueDate(card) {
    return (
      <time className={ this.dueDateClasses(card) }>
        { this.formatDate(card) }
      </time>
    );
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

    // Check if there has been any change
    if (cardNameInput.value.trim() !== cardNameInput.defaultValue.trim()) {
      let task = {
        id: this.props.card.id,
        name: cardNameInput.value.trim()
      };

      this.props.taskUpdate(task, updateAsana);
    }
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

  renderInput() {
    return (
      <form className="swimcard__update-form" tabIndex="-1">
        <textarea type="text"
               ref="cardNameInput"
               className="swimcard__update-input"
               value={ this.props.card.name.trim() }
               rows="1"
               autoFocus
               onBlur={ this.handleTaskUpdateBlur }
               onKeyDown={ this.handleTaskKeyDown }
               onKeyUp={ this.handleTaskKeyUp }
               onChange={ this.handleTextChange } />
      </form>
    );
  },

  render() {
    const {
      card,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      canDrop,
      isOver
    } = this.props;

    const classes = classNames('swimcard__card-border', { active: canDrop && isOver });

    return connectDragPreview(connectDropTarget(
      <article className="swimcard__card pure-g">
        <div className={classes}>

          <div className="pure-u-4-24 swimcard__image">
            <UserImage user={ card.assignee } />
          </div>

          <div className="pure-u-19-24 swimcard__card-content">
            { this.renderInput(card.name) }
            { this.renderDueDate(card) }
          </div>

          { connectDragSource(this.renderDragHandle()) }
        </div>
      </article>
    ));
  }
});

export default _flow(
  DragSource('card', cardSource, sourceCollect),
  DropTarget('card', cardTarget, targetCollect)
)(Card);
