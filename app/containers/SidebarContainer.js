import { connect } from 'react-redux';

import Actions from '../actions';
import UIActions from '../actions/ui';
import Sidebar from '../components/Sidebar';

const mapStateToProps = (state) => {
  return {
    workspaceEntities: state.entities.workspaces.records,
    projectEntities: state.entities.projects.records,
    showSidebarLoading: state.ui.showSidebarLoading,
    visible: state.ui.showSidebar
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onProjectSelected: (projectId) => {
      dispatch(Actions.getInitialTasksForProject(projectId));
      dispatch(UIActions.hideSidebar());
      dispatch(UIActions.hideTaskDetailsSidebar());
    },
    onBackdropClick: () => {
      dispatch(UIActions.hideSidebar());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

