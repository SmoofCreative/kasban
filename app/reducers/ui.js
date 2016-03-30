const initialState = {
  showSidebar: false,
  showSidebarLoading: false
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SIDEBAR_VISIBILITY': {
      return Object.assign({}, state, { showSidebar: action.payload.showSidebar });
    }
    case 'REQUEST_WORKSPACES_AND_PROJECTS': {
      return Object.assign({}, state, { showSidebarLoading: true });
    }
    case 'RECEIVED_WORKSPACES_AND_PROJECTS': {
      return Object.assign({}, state, { showSidebarLoading: false });
    }
    default: {
      return state;
    }
  }
}
