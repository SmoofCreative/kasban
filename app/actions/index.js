import Asana from 'asana';
import querystringify from 'querystringify';

const Actions = {};

const AsanaClient = function() {
  let authCreds = {}
  const access_token = localStorage.getItem('access_token') || false;
  if (access_token) {
    authCreds = {
      credentials: access_token
    }
  }

  return Asana.Client.create({
    clientId: process.env.CLIENT_ID,
    redirectUri: document.location['href']
  }).useOauth(authCreds);
}()

Actions.getWorkspaces = () => {
  return (dispatch) => {
    dispatch({
      type: 'REQUEST_WORKSPACES'
    });

    AsanaClient.users.me().then((data) => {
      dispatch({
        type: 'RECEIVE_WORKSPACES',
        payload: {
          workspaces: data.workspaces
        }
      });
    });
  };
};

Actions.getProjects = (workspaceId) => {
  return (dispatch) => {

    dispatch({
      type: 'REQUEST_PROJECTS'
    });

    AsanaClient
      .projects
      .findByWorkspace(workspaceId, { limit: 100 })
      .then((collection) => {
        dispatch({
          type: 'RECEIVE_PROJECTS',
          payload: {
            projects: collection.data
          }
        });
      });
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

Actions.getTasks = (projectId) => {
  return (dispatch) => {

    dispatch({
      type: 'REQUEST_TASKS'
    });

    AsanaClient
      .tasks
      .findByProject(projectId, {
        limit: 100,
        opt_fields: 'id,name,completed_at,completed,due_at,projects'
      })
      .then((collection) => {
        dispatch({
          type: 'SET_SWIMLANES_AND_INITIAL_TASKS',
          payload: {
            swimlanes: makeSwimlanes(collection.data),
            projectId: projectId
          }
        });
      });
  };
};

const completeCard = (dispatch, taskId) => {
  dispatch({
    type: 'COMPLETING_TASK',
    payload: { taskId: taskId }
  });

  AsanaClient
    .tasks
    .update(taskId, {
      completed: true
    })
    .then(() => {
      dispatch({
        type: 'COMPLETED_TASK_SUCCESS'
      });
    })
    .catch(() => {
      dispatch({
        type: 'COMPLETED_TASK_FAILED'
      });
    });
};

Actions.moveCard = (idToMove, idToInsertAfter, projectId) => {
  return (dispatch) => {
    if (idToInsertAfter === 'completed') {
      completeCard(dispatch, idToMove);
    }

    if (idToMove === idToInsertAfter) {
      dispatch({
        type: 'MOVED_TASK_SELF'
      });
    } else {
      dispatch({
        type: 'MOVING_TASK',
        payload: {
          idToMove: idToMove,
          idToInsertAfter: idToInsertAfter
        }
      });

      let data = {
        project: projectId
      }

      if (idToInsertAfter) {
        // If moved to uncategorised then set to null for top of the list
        if (idToInsertAfter === 'uncategorised') {
          idToInsertAfter = null;
        }
        data.insert_after = idToInsertAfter
      }

      AsanaClient
        .tasks
        .addProject(idToMove, data)
        .then(() => {
          dispatch({
            type: 'MOVED_TASK'
          });
        })
        .catch(() => {
          dispatch({
            type: 'MOVED_TASK_FAILED'
          });
        });
    }
  };
};


function oneHourFromNow () {
  let theFuture = Date.now() + 60*60*1000;
  return theFuture;
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
