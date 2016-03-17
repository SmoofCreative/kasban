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

export default UIActions;
