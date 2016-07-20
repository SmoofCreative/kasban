import { connect } from 'react-redux';

import Swimlane from '../components/Swimlane';

import Actions from '../actions';
import EventActions from '../actions/events';
import UIActions from '../actions/ui';

const mapStateToProps = (state) => {
  return {
    cardEntities: state.entities.cards.records,
    currentProjectId: state.entities.projects.conditions.currentId,
    projectEntities: state.entities.projects.records,
    currentTaskId: state.entities.cards.conditions.currentId,
    collapsed: state.ui.swimlaneCollapsed
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNewTaskSubmit: (task, isSubTasks, sectionId, projectId) => {
      let options = {
        taskDetails: task
      };

      EventActions.addTask();

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
    onTaskUpdated: (task, sectionId, currentProjectId, updateAsana) => {
      const options = {
        taskDetails: task,
        sectionId: sectionId,
        currentProjectId: currentProjectId,
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
      EventActions.selectTask(id);
    },
    onCardMoved: (cardToMove, cardToInsertAfter, projectId) => {
      dispatch(Actions.moveCard(cardToMove, cardToInsertAfter, projectId));
      EventActions.moveTask(cardToMove.id);
    },
    onDeleteTask: (id, sectionId) => {
      const options = {
        taskId: id,
        sectionId: sectionId
      };

      dispatch(Actions.deleteTask(options));
      EventActions.deleteTask(id);
    },
    onSwimlaneToggle: (id, collapsed) => {
      dispatch(UIActions.toggleSwimlane(id, collapsed))
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
    },
    onTaskUpdated: (task, updateAsana) => {
      dispatchProps.onTaskUpdated(task, id, currentProjectId, updateAsana);
    },
    onSwimlaneToggle: (id, collapsed) => {
      dispatchProps.onSwimlaneToggle(id, collapsed);
    }
  };

  return Object.assign({}, ownProps, stateProps, dispatchProps, functions);
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Swimlane);
