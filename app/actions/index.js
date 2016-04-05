import querystringify from 'querystringify';

import { oneHourFromNow } from '../utils';
import AsanaClient from '../utils/AsanaClient';

import Task from './task';
import Project from './project';
import Workspace from './workspace';

const Actions = {};

const storeWorkspace = (dispatch, workspace) => {
  dispatch({ 
    type: 'ADD_WORKSPACE',
    payload: {
      id: workspace.id,
      workspace: workspace
    }
  });
};

const storeProject = (dispatch, workspaceId, project) => {
  dispatch({ 
    type: 'ADD_PROJECT',
    payload: {
      id: project.id,
      project: project,
      workspaceId: workspaceId
    }
  });
};

const storeSection = (dispatch, projectId, section) => {
  dispatch({ 
    type: 'ADD_SECTION',
    payload: {
      id: section.id,
      section: section,
      projectId: projectId
    }
  });
};

const storeCard = (dispatch, sectionId, card) => {
  dispatch({ 
    type: 'ADD_CARD',
    payload: {
      id: card.id,
      card: card,
      sectionId: sectionId
    }
  });
};

const moveSection = (dispatch, sectionId, projectId, index) => {
  dispatch({
    type: 'MOVE_SECTION',
    payload: {
      sectionId: sectionId,
      projectId: projectId,
      index: index
    }
  });
};

Actions.getWorkspaces = () => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_WORKSPACES_AND_PROJECTS' });
    const workspace = Workspace();

    workspace.getWorkspaces(AsanaClient)
    .then((workspaces) => { 
      workspaces.map((ws) => {
        storeWorkspace(dispatch, ws);
        workspace.getProjects(ws.id, AsanaClient)
        .then((projects) => {
          projects.map((project) => {
            storeProject(dispatch, ws.id, project);
          });
        });
      });

      // Return null as otherwise we get a warning about not returning promises
      return null;
    })
    .then(() => {
      dispatch({ type: 'RECEIVED_WORKSPACES_AND_PROJECTS' });
    });
  };
};

const completeCard = (dispatch, taskId) => {
  dispatch({ type: 'COMPLETING_TASK', payload: { taskId: taskId } });

  const task = Task(taskId);
  task.complete(AsanaClient)
  .then(() => { dispatch({ type: 'COMPLETED_TASK_SUCCESS' }); })
  .catch(() => { dispatch({ type: 'COMPLETED_TASK_FAILED' }); });
};

Actions.moveCard = (idToMove, idToInsertAfter, projectId) => {
  return (dispatch) => {
    if (idToInsertAfter === 'completed') {
      completeCard(dispatch, idToMove);
    }

    if (idToMove === idToInsertAfter) {
      dispatch({ type: 'MOVED_TASK_SELF' });
    } else {
      dispatch({
        type: 'MOVING_TASK',
        payload: {
          idToMove: idToMove,
          idToInsertAfter: idToInsertAfter
        }
      });

      let data = {
        projectId: projectId,
        insertAfter: null
      }

      if (idToInsertAfter) {
        if (idToInsertAfter !== 'completed' && idToInsertAfter !== 'uncategorised') {
          data.insertAfter = idToInsertAfter
        }
      }

      const task = Task(idToMove);
      task.move(data, AsanaClient)
      .then(() => { dispatch({ type: 'MOVED_TASK_SUCCESS' }); })
      .catch(() => { dispatch({ type: 'MOVED_TASK_FAILED' }); })
    }
  };
};

Actions.createTask = (params) => {
  return (dispatch) => {
    let { taskDetails, sectionId, projectId, workspaceId } = params;

    dispatch({
      type: 'CREATING_TASK',
      payload: {
        task: taskDetails,
        sectionId: sectionId
      }
    });

    if (sectionId == 'completed') {
      taskDetails.completed = true;
    }

    if (sectionId == 'uncategorised' || sectionId == 'completed') {
      sectionId = null
    }

    taskDetails.memberships = [{
      section: sectionId
    }];

    taskDetails.workspace = workspaceId;

    const task = Task(null);
    task.create(taskDetails, AsanaClient)
    .then(() => { dispatch({ type: 'CREATE_TASK_SUCCESS' }); })
    .catch(() => { dispatch({ type: 'CREATE_TASK_FAILED' }); });
  };
};

Actions.updateTask = (params) => {
  return (dispatch) => {
    let { taskDetails, updateAsana } = params;

    dispatch({
      type: 'UPDATING_TASK',
      payload: {
        task: taskDetails
      }
    });

    if (updateAsana) {
      const task = Task(taskDetails.id);
      task.update(taskDetails, AsanaClient)
      .then(() => { dispatch({ type: 'UPDATING_TASK_SUCCESS' }); })
      .catch(() => { dispatch({ type: 'UPDATING_TASK_FAILED' }); });
    }
  };
};

const isSection = (item) => {
  return item.name.slice(-1) === ':';
};

const addSectionsAndTasks = (dispatch, projectId, tasks) => {
  // First add our own hardcoded sections

  const presetSections = [{ 
    id: 'completed', 
    name: 'Completed',
    cards: []
  }, 
  { 
    id: 'uncategorised', 
    name: 'Uncategorised:',
    cards: []
  }];

  presetSections.map((section) => {
    storeSection(dispatch, projectId, section);
  });

  if (tasks.length) {
    for (let item of tasks) {
      if (isSection(item)) {
        storeSection(dispatch, projectId, item);
        continue;
      }

      if (item.completed) {
        storeCard(dispatch, 'completed', item);
        continue;
      } 

      if (item.memberships.length) {
        if (item.memberships[0].section !== null) {          
          storeCard(dispatch, item.memberships[0].section.id, item);
          continue;
        }
      }

      // If here the task is not completed nor in a section
      storeCard(dispatch, 'uncategorised', item);
    }
  }

  // Move the uncategorised column to the front
  moveSection(dispatch, 'uncategorised', projectId, 0)
};

const getTasksForProject = (dispatch, id) => {
  const project = Project(id);
  project.getTasks(AsanaClient)
  .then((tasks) => {
    addSectionsAndTasks(dispatch, id, tasks);
  })
  .then(() => {
    dispatch({ type: 'RECEIVED_SECTIONS_AND_TASKS' })
  });
};

Actions.getInitialTasksForProject = (id) => {
  return (dispatch) => {
    // First dispatch the selection incase we can get the sections from the tree already
    dispatch({
      type: 'REQUEST_SECTIONS_AND_TASKS',
      payload: { id: id }
    });

    getTasksForProject(dispatch, id);
  };
};

Actions.updateTasksForProject = (projectId) => {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_SECTIONS_AND_TASKS' });
    getTasksForProject(dispatch, workspaceId, projectId);
  };
}

Actions.checkAuth = () => {
  return (dispatch) => {

    dispatch({
      type: 'STARTING_ASANA_AUTH'
    });

    // The access_token is returned from Asana in a url hash --> /#access_token=XXXXXX
    // Lop off the # and parse the params
    let params = querystringify.parse(location.hash.slice(1))

    /**
     * Asana redirect_uri action - just set token to local storage and bail.
     */
    if (typeof params.access_token !== 'undefined') {
      localStorage.setItem('access_token', params.access_token);
      localStorage.setItem('token_death', oneHourFromNow());
      document.location = '/';
      return;
    }

    /**
     * Check token age
     * If the token isn't dead yet, we can try using it.
     */
    if ( localStorage.getItem('access_token') &&
         parseInt(localStorage.getItem('token_death')) > Date.now()
        ) {
          // we 'assume' they are authed
          dispatch({
            type: 'ASANA_AUTH_COMPLETE',
            payload: {
              isAsanaAuthed: true
            }
          });

          // FIXME: is there a way to try/catch a dispatch?
          dispatch(Actions.getWorkspaces());

          return;
    }

    /**
     * Update outdated stored token
     * If a token exists and we haven't already bailed, then we need to reauth
     */
    else if ( localStorage.getItem('access_token') ) {
      AsanaClient
        .authorize()
        .then(() => {

          localStorage.setItem('access_token', AsanaClient.dispatcher.authenticator.credentials.access_token);
          localStorage.setItem('token_death', oneHourFromNow());

          dispatch({
            type: 'ASANA_AUTH_COMPLETE',
            payload: {
              isAsanaAuthed: true
            }
          });

          dispatch(Actions.getWorkspaces());

        });

    /**
     * No token
     * Probably haven't clicked the Auth button
     */
    } else {
      dispatch({
        type: 'ASANA_AUTH_COMPLETE',
        payload: {
          isAsanaAuthed: false
        }
      });
    }
  };
};

Actions.doAuth = () => {
  return () => {
    AsanaClient.authorize();
  }
}

export default Actions;
