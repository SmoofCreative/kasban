import { connect } from 'react-redux';

import Swimlane from '../components/Swimlane';

import Actions from '../actions';
import UIActions from '../actions/ui';

const mapStateToProps = (state) => {
  return {
    cardEntities: state.entities.cards.records,
    currentProjectId: state.entities.projects.conditions.currentId
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNewTaskSubmit: (task, sectionId, projectId) => {
      const options = {
        taskDetails: task,
        sectionId: sectionId,
        projectId: projectId
      };

      dispatch(Actions.createTask(options));
    },
    onTaskUpdated: (task, updateAsana) => {
      const options = {
        taskDetails: task,
        updateAsana: updateAsana
      };

      dispatch(Actions.updateTask(options));
    },
    onTaskSelected: (id) => {
      const options = {
        id: id
      };

      dispatch(UIActions.selectTask(options));
    },
    onCardMoved: (cardToMove, cardToInsertAfter, projectId) => {
      dispatch(Actions.moveCard(cardToMove, cardToInsertAfter, projectId));      
    }
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { currentProjectId } = stateProps;
  const { id } = ownProps;

  const functions = {
    onNewTaskSubmit: (task) => {
      dispatchProps.onNewTaskSubmit(task, id, currentProjectId);
    },
    onCardMoved: (cardToMove, cardToInsertAfter) => {
      dispatchProps.onCardMoved(cardToMove, cardToInsertAfter, currentProjectId);
    }
  };

  return Object.assign({}, ownProps, stateProps, dispatchProps, functions);
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Swimlane);
