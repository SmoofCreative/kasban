import React from 'react';
import classNames from 'classnames';

import './style';
import UserImage from '../UserImage';
import DueDate from '../DueDate';
import CommentList from '../CommentList';
import Swimlane from '../../containers/SwimlaneContainer';

const renderDisplayName = (user) => {
  let displayName = '';

  if (user !== null && typeof user !== 'undefined') {
    const names = user.name.split(' ');

    // Get the forename
    displayName = names[0];

    // Check they have entered their surname
    if (names.length >= 2) {
      // Get the last index instead of array incase they have a middle name
      displayName += ' ' + names[names.length - 1].split('')[0].toUpperCase();
    }
  } else {
    displayName = 'Unassigned';
  }

  return <span className="task-details-sidebar__user-name">{ displayName }</span>;
};

const TaskDetailsSidebar = ({ card, visible, onSidebarClose, comments }) => {
  const classes = classNames('task-details-sidebar', { active: visible });

  return (
    <div className={ classes }>
      <div className="task-details-sidebar__close">
        <i onClick={ onSidebarClose }
           className="fa fa-times task-details-sidebar__close__icon">
        </i>
      </div>

      <div className="task-details-sidebar__details">
        <UserImage user={ card.assignee } />
        { renderDisplayName(card.assignee) }
        <DueDate card={ card } showIcon={true} />

        <h2 className="task-details-sidebar__title">
          { card.name }
        </h2>

        <p className="task-details-sidebar__description">
          { card.notes }
        </p>

        <div className="task-details-sidebar__sub-tasks">
          <Swimlane
            name="Subtasks"
            id={card.id}
            cards={card.subtasks}
            isFullWidth={true}
            isStatic={true}
            showInteractiveIcons={true}
            isSubTasks={true}
            fullHeight={true}
            hasGutter={false}
          />
        </div>
      </div>
      <div className="task-details-sidebar__comment-list">
          <CommentList comments={comments} />
        </div>
    </div>
  );
};

export default TaskDetailsSidebar;
