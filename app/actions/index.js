import Asana from 'asana';

const Actions = {};

Actions.getTasks = () => {
  return (dispatch) => {
    dispatch({
      type: 'GET_TASKS',
      payload: {
        projectId: 1
      }
    })
  };
};

Actions.doAuth = () => {
  return () => {

    let client = Asana.Client.create({
      clientId: 93624243720041,
      redirectUri: document.location['href']
    });

    window.aclient = client;

    client.useOauth();

    client.authorize().then(() => {
      // dispatch()
      client.users.me().then(function(me) {
        console.log(me)
      })
    })
  }
}


export default Actions;
