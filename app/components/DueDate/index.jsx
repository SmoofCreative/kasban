import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

import './style';

const dueDateClasses = (card, isSmall) => {
  const { completed, due_on } = card;

  let classes = [];

  if (due_on !== null && typeof due_on !== 'undefined' && !completed) {
    let today = moment().startOf('day');
    let dueDate = moment(due_on).startOf('day');

    classes.push({
      'due_date--today': today.isSame(dueDate),
      'due_date--late': dueDate.isBefore(today)
    });
  }

  classes.push({ 'due_date--small': isSmall });

  return classNames('due_date', classes);
};

const formatDate = ({ completed, due_on }) => {
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
};

const DueDate = ({ card, isSmall = false, showIcon = false }) => {
  if (typeof card === 'undefined' || card === null) {
    return <span></span>;
  }

  return (
    <time className={ dueDateClasses(card, isSmall) }>
      { (showIcon && <i className="fa fa-calendar due_date__icon"></i>) }
      { formatDate(card) }
    </time>
  );
};

export default DueDate;
