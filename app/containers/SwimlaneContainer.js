import { connect } from 'react-redux';

import Swimlane from '../components/Swimlane';

import Actions from '../actions';
import UIActions from '../actions/ui';

const mapStateToProps = (state) => {
  return {
    cardEntities: state.entities.cards.records,
    currentProjectId: state.entities.projects.conditions.currentId,
    projectEntities: state.entities.projects.records,
    currentTaskId: state.entities.cards.conditions.currentId
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNewTaskSubmit: (task, isSubTasks, sectionId, projectId) => {
      let options = {
        taskDetails: task
      };

      if (isSubTasks) {
        dispatch(Actions.createSubTask({
          ...options,
          parentId: sectionId
        }));
      } else {
        dispatch(Actions.createTask({
          ...options,
          sectionId: sectionId,
          projectId: projectId
        }));
      }
    },
    onTaskUpdated: (task, updateAsana) => {
      const options = {
        taskDetails: task,
        updateAsana: updateAsana
      };

      dispatch(Actions.updateTask(options));
    },
    onSectionUpdated: (section, updateAsana, projectId, nextSectionId) => {
      const options = {
        details: section,
        updateAsana: updateAsana,
        projectId: projectId,
        nextSectionId: nextSectionId
      };

      dispatch(Actions.updateSection(options));
    },
    onTaskSelected: (id, projectId) => {
      const options = {
        id: id
      };

      dispatch(UIActions.selectTask(options));
      dispatch(Actions.getTask(id, projectId));
    },
    onCardMoved: (cardToMove, cardToInsertAfter, projectId) => {
      dispatch(Actions.moveCard(cardToMove, cardToInsertAfter, projectId));
    },
    onDeleteTask: (id, sectionId) => {
      const options = {
        taskId: id,
        sectionId: sectionId
      };

      dispatch(Actions.deleteTask(options))
    }
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { currentProjectId, projectEntities } = stateProps;
  const { id } = ownProps;

  const functions = {
    onNewTaskSubmit: (task, isSubTasks) => {
      dispatchProps.onNewTaskSubmit(task, isSubTasks, id, currentProjectId);
    },
    onCardMoved: (cardToMove, cardToInsertAfter) => {
      dispatchProps.onCardMoved(cardToMove, cardToInsertAfter, currentProjectId);
    },
    onTaskSelected: (id) => {
      dispatchProps.onTaskSelected(id, currentProjectId);
    },
    onSectionUpdated: (section, updateAsana) => {
      // Get the id of the next section as this is the previous on asana
      const sections = projectEntities[currentProjectId].sections;
      let nextSectionId = sections[sections.indexOf(section.id) + 1];

      // If the next section is completed the change it to the first section
      nextSectionId = nextSectionId === 'completed' ? sections[0] : nextSectionId;

      dispatchProps.onSectionUpdated(section, updateAsana, currentProjectId, nextSectionId);
    },
    onDeleteTask: (taskId) => {
      dispatchProps.onDeleteTask(taskId, id);
    }
  };

  return Object.assign({}, ownProps, stateProps, dispatchProps, functions);
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Swimlane);
