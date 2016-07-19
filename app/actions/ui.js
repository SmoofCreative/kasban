const UIActions = {};

UIActions.showSidebar = () => {
  return {
    type: 'UPDATE_SIDEBAR_VISIBILITY',
    payload: {
      showSidebar: true
    }
  };
};

UIActions.hideSidebar = () => {
  return {
    type: 'UPDATE_SIDEBAR_VISIBILITY',
    payload: {
      showSidebar: false
    }
  };
};

UIActions.setSidebarVisibilty = (show) => {
  if (show) {
    return UIActions.showSidebar();
  } else {
    return UIActions.hideSidebar();
  }
};

UIActions.selectTask = (params) => {
  return {
    type: 'CARD_SELECTED',
    payload: {
      id: params.id
    }
  };
};

UIActions.hideTaskDetailsSidebar = () => {
  return {
    type: 'UPDATE_TASK_DETAILS_SIDEBAR_VISIBILITY',
    payload: {
      showSidebar: false
    }
  }
};

UIActions.toggleSwimlane = (id) => {
  return {
    type: 'TOGGLE_SWIMLANE',
    payload: {
      id: id
    }
  }
};

export default UIActions;
