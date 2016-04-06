const workspacesList = (state = [], action) => {
  switch (action.type) {
    case 'ADD_WORKSPACE': {
      return [...state, action.payload.id];
    }
    default: {
      return state;
    }
  }
};

export default workspacesList;
