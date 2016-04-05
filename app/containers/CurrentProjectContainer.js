import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Actions from '../actions';
import UIActions from '../actions/ui';
import Project from '../components/Project';

const getWorkspace = (id, workspaces) => {
  // Go though each workspace to see if the id matches the given parameters
  return workspaces.filter((workspace) => {
    return workspace.id == id;
  })[0];
};

const getProject = (id, projects) => {
  // Go though each project to see if the id matches the given parameters
  return projects.filter((project) => {
    return project.id == id;
  })[0];
}

const mapStateToProps = (state) => {
  const projects = state.entities.projects;

  let sections = [];

  if (typeof projects.records[projects.conditions.currentId] !== 'undefined') {
    sections = projects.records[projects.conditions.currentId].sections;
  }

  return {
    sections: sections,
    currentWorkspaceId: state.entities.workspaces.conditions.currentId,
    currentProjectId: state.entities.projects.conditions.currentId,
    sectionEntities: state.entities.sections.records,
    cardEntities: state.entities.cards.records,
    currentProjectId: projects.conditions.currentId
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCardMove: (idToMove, idToInsertAfter, projectId) => {
      dispatch(Actions.moveCard(idToMove, idToInsertAfter, projectId));
    },
    onNewTaskSubmit: (task, swimlaneId, projectId, workspaceId) => {
      const options = {
        taskDetails: task,
        sectionId: swimlaneId,
        projectId: projectId,
        workspaceId: workspaceId
      };
      dispatch(Actions.createTask(options));
    },
    onTaskUpdate: (task, updateAsana) => {
      const options = {
        taskDetails: task,
        updateAsana: updateAsana
      };

      dispatch(Actions.updateTask(options));
    },
    onTaskSelected: (taskId, sectionId) => {
      const options = {
        taskId: taskId,
        sectionId: sectionId
      }

      dispatch(UIActions.selectTask(options));
    }
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { currentProjectId, currentWorkspaceId } = stateProps;

  return Object.assign({}, ownProps, stateProps, dispatchProps, {
    onNewTaskSubmit: (task, swimlaneId) => {
      dispatchProps.onNewTaskSubmit(task, swimlaneId, currentProjectId, currentWorkspaceId);
    },
    onCardMove: (idToMove, idToInsertAfter) => {
      dispatchProps.onCardMove(idToMove, idToInsertAfter, currentProjectId);
    }
  });
}

export default _flow(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  DragDropContext(HTML5Backend)
)(Project)

