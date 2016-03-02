import Asana from 'asana';
import qs from 'querystringify';

const Actions = {};

const access_token = localStorage.getItem('access_token')
const AsanaClient = Asana.Client.create({
  clientId: 93624243720041,
  redirectUri: document.location['href']
}).useOauth({
  credentials: access_token
});

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

  swimlanes.unshift({
    id: 0,
    name: 'Completed:',
    cards: []
  });

  if (list[0].name.slice(-1) !== ':') {
    swimlanes.unshift({
      id: 0,
      name: 'Prelisted:',
      cards: []
    });
  }

  for (let item of list) {
    if (item.name.slice(-1) === ':') {
      swimlanes.unshift({
        id: item.id,
        name: item.name,
        cards: []
      });

      continue;
    }

    if (item.completed) {
      // Completed should always be the last lane...
      //  is it defined first in this func?
      swimlanes[swimlanes.length - 1].cards.push(item);
    } else {
      swimlanes[0].cards.push(item);
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
        opt_fields: 'id,name,completed_at,completed,due_at'
      })
      .then((collection) => {
        dispatch({
          type: 'SET_SWIMLANES_AND_INITIAL_TASKS',
          payload: {
            swimlanes: makeSwimlanes(collection.data)
          }
        });
      });
  };
};

Actions.moveCard = (idToMove, idToInsertAfter) => {
  return (dispatch) => {
    // dispatch updating (info notification)
    // update ui with new task order
    // asana call
    //  if success
    //    dispatch update complete (info notifcation)
    //  if error
    //    dispatch update fail (info notifcation)
    //    reload the project data from asana

    dispatch({
      type: 'MOVING_TASK',
      payload: {
        idToMove: idToMove,
        idToInsertAfter: idToInsertAfter
      }
    });


    dispatch({
      type: 'MOVED_TASK'
    });
  };
};

Actions.checkAuth = () => {
  return () => {

    let params = qs.parse(location.hash.slice(1))
    if (typeof params.access_token !== 'undefined') {
      console.log('theres a token')

      localStorage.setItem('access_token', params.access_token)
      localStorage.setItem('token_death', Date.now() + 100)
    }

    // do not touch the date!!
    if ( localStorage.getItem('access_token') !== null && localStorage.getItem('token_death') > Date.now() ) {
      console.log('new token time')

      AsanaClient
        .authorize()
        .then(() => {
          let expires_in = parseInt(AsanaClient.dispatcher.authenticator.credentials.expires_in);
          let expires_at = Date.now() + expires_in;

          localStorage.setItem('token_death', expires_at);
          localStorage.setItem('access_token', AsanaClient.dispatcher.authenticator.credentials.access_token);
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
