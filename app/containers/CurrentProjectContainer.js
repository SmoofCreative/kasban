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

  const currentWorkspace = getWorkspace(boards.currentWorkspaceId, boards.workspaces);
  const currentProject = getProject(boards.currentProjectId, currentWorkspace.projects);

  return {
    workspaces: boards.workspaces,
    sections: currentProject.sections,
    currentProjectId: boards.currentProjectId,
    currentWorkspaceId: boards.currentWorkspaceId
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCardMove: (idToMove, idToInsertAfter, projectId) => {
      dispatch(Actions.moveCard(idToMove, idToInsertAfter, projectId));
    },
    onNewTaskSubmit: (task, workspaceId, projectId, swimlaneId) => {
      const options = {
        taskDetails: task,
        workspaceId: workspaceId,
        projectId: projectId,
        sectionId: swimlaneId
      };
      dispatch(Actions.createTask(options));
    },
    onTaskUpdate: (task) => {
      const options = { taskDetails: task };
      dispatch(Actions.updateTask(options));
    }
  };
};

export default _flow(
  connect(mapStateToProps, mapDispatchToProps),
  DragDropContext(HTML5Backend)
)(Project)

