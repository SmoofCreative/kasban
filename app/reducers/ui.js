const initialState = {
  showSidebar: false
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SIDEBAR_VISIBILITY': {
      return Object.assign({}, state, { showSidebar: action.payload.showSidebar });
    }

    default: {
      return state;
    }
  }
}
