import querystringify from 'querystringify';
import uuid from 'uuid';

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

const getTasksForProject = (dispatch, id) => {
  const project = Project(id);
  project.getTasks(AsanaClient)
    .then((tasks) => {
      addSectionsAndCards(dispatch, id, tasks);
    })
    .then(() => {
      dispatch({ type: 'RECEIVED_SECTIONS_AND_TASKS' })
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

const isSection = (item) => {
  return item.name.slice(-1) === ':';
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

const removeCard = (dispatch, cardId, sectionId) => {
  dispatch({
    type: 'REMOVE_CARD',
    payload: {
      sectionId: sectionId,
      id: cardId
    }
  });
};

const completeCard = (dispatch, taskId) => {
  dispatch({ type: 'COMPLETING_CARD', payload: { id: taskId } });

  const task = Task(taskId);
  task.complete(AsanaClient)
    .then(() => { dispatch({ type: 'COMPLETED_CARD_SUCCESS' }); })
    .catch(() => { dispatch({ type: 'COMPLETED_CARD_FAILED' }); });
};

const addSectionsAndCards = (dispatch, projectId, tasks) => {
  // First add our own hardcoded sections

  const presetSections = [{
    id: 'completed',
    name: 'Completed',
    completed: true,

    cards: []
  },
    {
      id: 'uncategorised',
      name: 'Uncategorised:',
      completed: false,
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

Actions.createTask = (params) => {
  return (dispatch) => {
    // Generate a temporary id to use for adding to store
    const cardId = uuid.v4();

    let { taskDetails, sectionId, projectId } = params;

    // Store this so we can differentiate between asana and our own stores
    let asanaSectionId = sectionId;

    taskDetails.id = cardId;

    // Store the card locally
    storeCard(dispatch, sectionId, taskDetails);

    if (sectionId == 'completed') {
      taskDetails.completed = true;
    }

    if (sectionId == 'uncategorised' || sectionId == 'completed') {
      asanaSectionId = null
    }

    taskDetails.projects = [projectId];

    taskDetails.memberships = [{
      section: asanaSectionId,
      project: projectId
    }];

    const task = Task();
    task.create(taskDetails, AsanaClient)
      .then((data) => {
        storeCard(dispatch, sectionId, data);
        removeCard(dispatch, cardId, sectionId);
      })
      .catch(() => { dispatch({ type: 'ADD_CARD_FAILED' }); });
  };
};

Actions.updateTask = (params) => {
  return (dispatch) => {
    let { taskDetails, updateAsana } = params;

    dispatch({
      type: 'UPDATE_CARD',
      payload: {
        id: taskDetails.id,
        card: taskDetails
      }
    });

    if (updateAsana) {
      const task = Task(taskDetails.id);
      task.update(taskDetails, AsanaClient)
        .then(() => { dispatch({ type: 'UPDATING_CARD_SUCCESS' }); })
        .catch(() => { dispatch({ type: 'UPDATING_CARD_FAILED' }); });
    }
  };
};

Actions.moveCard = (cardToMove, cardToInsertAfter, projectId) => {
  return (dispatch) => {
    if (cardToInsertAfter.completed) {
      completeCard(dispatch, cardToMove.id);
    }

    if (cardToMove.id === cardToInsertAfter.id) {
      dispatch({ type: 'MOVED_CARD_SELF' });
    } else {
      dispatch({
        type: 'MOVE_CARD',
        payload: {
          cardToMove: cardToMove,
          cardToInsertAfter: cardToInsertAfter
        }
      });

      let data = {
        projectId: projectId,
        insertAfter: null
      };

      if (cardToInsertAfter) {
        if (!cardToInsertAfter.completed && cardToInsertAfter.id !== 'uncategorised') {
          data.insertAfter = cardToInsertAfter.id
        }
      }
      
      const task = Task(cardToMove.id);
      task.move(data, AsanaClient)
      .then(() => { dispatch({ type: 'MOVED_CARD_SUCCESS' }); })
      .catch(() => { dispatch({ type: 'MOVED_CARD_FAILED' }); })
    }
  };
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
    getTasksForProject(dispatch, projectId);
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
