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
  const { taskId, sectionId } = params;

  return {
    type: 'TASK_SELECTED',
    payload: {
      taskId: taskId,
      sectionId: sectionId
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
}

export default UIActions;
