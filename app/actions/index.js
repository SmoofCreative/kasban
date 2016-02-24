const Actions = {};

Actions.getTasks = (params) => {
  return (dispatch) => {
    dispatch({
      type: 'GET_TASKS',
      payload: {
        projectId: 1
      }
    })
  };
};

export default Actions;
