import React from 'react';
import { connect } from 'react-redux';

import UIActions from '../actions/ui';
import TaskDetailsSidebar from '../components/TaskDetailsSidebar';

const mapStateToProps = (state) => {
  const cards = state.entities.cards;
  const currentTaskId = cards.conditions.currentId;
  let comments = []

  if (currentTaskId) {
    const commentsList = cards.records[currentTaskId].comments;

    if (typeof commentsList !== 'undefined') {
      comments = commentsList.map((id) => {
        return state.entities.comments.records[id];
      });
    }
  }

  return {
    card: state.entities.cards.records[currentTaskId] || {},
    visible: state.ui.showTaskDetailsSidebar,
    currentTaskId: currentTaskId,
    comments: comments
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSidebarClose: () => {
      dispatch(UIActions.hideTaskDetailsSidebar());
    }
  }
};

const CurrentTaskDetailsSidebar = (props) => {
  return (
    <div>
      { props.currentTaskId && <TaskDetailsSidebar { ...props } /> }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrentTaskDetailsSidebar);
