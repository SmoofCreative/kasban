import querystringify from 'querystringify';

import { oneHourFromNow } from '../utils';
import AsanaClient from '../utils/AsanaClient';

import Task from './task';
import Project from './project';
import Workspace from './workspace';

const Actions = {};

Actions.getWorkspaces = () => {
  return (dispatch) => {
    dispatch({ type: 'REQUEST_WORKSPACES_AND_PROJECTS' });

    const workspace = Workspace();

    // Ask for the workspaces
    workspace.getWorkspaces(AsanaClient)
    .then((workspaces) => {
      // For each of the workspaces, get its related projects
      workspaces.map((ws) => {
        workspace.getProjects(ws.id, AsanaClient)
        .then((projects) => {
          dispatch({
            type: 'RECEIVED_WORKSPACES_AND_PROJECTS',
            payload: {
              workspace: { id: ws.id, name: ws.name },
              projects: projects
            }
          });
        })
      });
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
      project: projectId,
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
    let { taskDetails } = params;

    dispatch({ type: 'UPDATING_TASK' });

    const task = Task(taskDetails.id);
    task.update(taskDetails, AsanaClient)
    .then(() => { dispatch({ type: 'UPDATING_TASK_SUCCESS' }); })
    .catch(() => { dispatch({ type: 'UPDATING_TASK_FAILED' }); });
  };
};

function makeSwimlanes(list) {
  let swimlanes = [];

  // First push on the completed swimlane
  swimlanes.unshift({
    id: 'completed',
    name: 'Completed:',
    cards: []
  });

  // If the first task we have in not a section then we have uncategorised tasks
  if (list[0].name.slice(-1) !== ':') {
    swimlanes.unshift({
      id: 'uncategorised',
      name: 'Uncategorised:',
      cards: []
    });
  }

  // Go through the list of tasks
  for (let task of list) {
    // If the task is a new section push it to the front of the array
    if (task.name.slice(-1) === ':') {
      swimlanes.unshift({
        id: task.id,
        name: task.name,
        cards: []
      });

      continue;
    }

    // Completed should be the last lane
    // If task is not completed then add to current swimlane
    let laneIndex = task.completed ? (swimlanes.length - 1) : 0;
    swimlanes[laneIndex].cards.push(task);
  }

  // As we want the uncategorised swimlane first find and splice it to the front
  for (let swimlaneIndex in swimlanes) {
    if (swimlanes[swimlaneIndex].id === 'uncategorised') {
      let uncategorisedSwimlane = swimlanes.splice(swimlaneIndex, 1)[0];
      swimlanes.unshift(uncategorisedSwimlane);
      break;
    }
  }

  return swimlanes;
}

Actions.selectProject = (workspaceId, projectId) => {
  return (dispatch) => {
    // First dispatch the selection incase we can get the sections from the tree already
    dispatch({
      type: 'PROJECT_SELECTED',
      payload: {
        workspaceId: workspaceId,
        projectId: projectId
      }
    });

    const project = Project(projectId);

    project.getTasks(AsanaClient)
    .then((tasks) => {
      dispatch({
        type: 'RECEIVED_SECTIONS_AND_TASKS',
        payload: {
          workspaceId: workspaceId,
          projectId: projectId,
          sections: makeSwimlanes(tasks)
        }
      })
    });
  };
};

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
