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
    AsanaClient.users.me().then((data) => {
      dispatch({
        type: 'GET_WORKSPACES',
        payload: {
          workspaces: data.workspaces
        }
      });
    });
  };
};

Actions.getProjects = (workspaceId) => {
  return (dispatch) => {
    AsanaClient
      .projects
      .findByWorkspace(workspaceId, { limit: 100 })
      .then((collection) => {
        console.log('dispatch incoming');
        dispatch({
          type: 'GET_PROJECTS',
          payload: {
            projects: collection.data
          }
        });
      });
  };
};

Actions.checkAuth = () => {
  return () => {

    // dispatch -> START_AUTH

    // if there is an auth token in url
    //  set token in storage
    //  add to AsanaClient
    // else if there's a token in storage
    //  get token from storage
    //  add to AsanaClient
    //

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

          // dispatch -> AUTH_SUCCESS
        })

    }

  }
}

Actions.doAuth = () => {
  return () => {
    // dispatch -> START_AUTH
    AsanaClient.authorize();
  }
}


export default Actions;
