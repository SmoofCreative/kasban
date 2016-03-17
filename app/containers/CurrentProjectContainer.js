import { connect } from 'react-redux';
import _flow from 'lodash/flow';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Actions from '../actions';
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
  const boards = state.boards;

  let currentProject = {};

  const currentWorkspace = getWorkspace(boards.currentWorkspaceId, boards.workspaces);

  if (typeof currentWorkspace !== 'undefined') {
    let project = getProject(boards.currentProjectId, currentWorkspace.projects);

    if (typeof project !== 'undefined') {
      currentProject = project;
    }
  }

  // console.log(currentProject);

  return {
    workspaces: boards.workspaces,
    sections: currentProject.sections || [],
    currentProjectId: boards.currentProjectId,
    currentWorkspaceId: boards.currentWorkspaceId
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
    onTaskUpdate: (task) => {
      const options = { taskDetails: task };
      dispatch(Actions.updateTask(options));
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

