const initialState = {
  showSidebar: false,
  showSidebarLoading: false,
  showProjectLoading: false,
  showTaskDetailsSidebar: false,
  showTaskDetailsSidebarLoading: false
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_SIDEBAR_VISIBILITY': {
      return Object.assign({}, state, { showSidebar: action.payload.showSidebar });
    }
    case 'CARD_SELECTED': {
      return Object.assign({}, state, { showTaskDetailsSidebar: true });
    }
    case 'UPDATE_TASK_DETAILS_SIDEBAR_VISIBILITY': {
      return Object.assign({}, state, { showTaskDetailsSidebar: action.payload.showSidebar });
    }
    case 'REQUEST_WORKSPACES_AND_PROJECTS': {
      return Object.assign({}, state, { showSidebarLoading: true });
    }
    case 'RECEIVED_WORKSPACES_AND_PROJECTS': {
      return Object.assign({}, state, { showSidebarLoading: false });
    }
    case 'REQUEST_SECTIONS_AND_TASKS': {
      return Object.assign({}, state, { showProjectLoading: true });
    }
    case 'RECEIVED_SECTIONS_AND_TASKS': {
      return Object.assign({}, state, { showProjectLoading: false });
    }
    default: {
      return state;
    }
  }
}
