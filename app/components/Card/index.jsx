import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _flow from 'lodash/flow';
import moment from 'moment';
import classNames from 'classnames';

import './style';

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
  getInitialState() {
    return {
      isUpdatingName: false,
      taskName: this.props.card.name
    };
  },

  formatDate(date) {
    let today = moment().startOf('day');
    let dueDate = moment(date).startOf('day');

    if (date === null || typeof date === 'undefined') {
      return 'No due date';
    } else if (today.isSame(dueDate)) {
      return 'Today';
    } else {
      return moment(date).format('MMM DD');
    }
  },

  dueDateClasses(date) {
    let classes = [];

    if (date !== null && typeof date !== 'undefined') {
      let today = moment().startOf('day');
      let dueDate = moment(date).startOf('day');

      classes.push({
        'swimcard__date--today': today.isSame(dueDate),
        'swimcard__date--late': dueDate.isBefore(today)
      });
    }

    return classNames('swimcard__date', classes);
  },

  renderDueDate(card) {
    if (card.completed) return false;

    return (
      <time className={ this.dueDateClasses(card.due_on) }>
        { this.formatDate(card.due_on) }
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

  handleTaskNameClick() {
    // Show the input
    this.setState({ isUpdatingName: true });
  },

  handleTaskUpdate(e) {
    e.preventDefault();
    let task = {
      id: this.props.card.id,
      name: this.state.taskName
    };

    // Reset the UI, we'll change the task name in the stores
    this.setState({ isUpdatingName: false, taskName: '' });
    this.props.taskUpdate(task);
  },

  handleTaskUpdateChange(e) {
    this.setState({ taskName: e.target.value });
  },

  handleTaskUpdateBlur() {
    // Remove the input and reset the name
    this.setState({
      isUpdatingName: false,
      taskName: this.props.card.name
    });
  },

  renderName(name) {
    return (
      <p className="swimcard__task">{name}</p>
    );
  },

  renderInput() {
    return (
      <form className="swimcard__update-form" onSubmit={ this.handleTaskUpdate }>
        <input type="text"
               className="swimcard__update-input"
               autoFocus
               onBlur={ this.handleTaskUpdateBlur }
               onChange={ this.handleTaskUpdateChange }
               value={ this.state.taskName } />
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
          <div className="pure-u-23-24 swimcard__card-content">
            <div onClick={ this.handleTaskNameClick }>
              {
                this.state.isUpdatingName ?
                this.renderInput(card.name) :
                this.renderName(card.name)
              }
            </div>
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
