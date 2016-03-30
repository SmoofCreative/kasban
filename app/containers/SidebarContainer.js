import { connect } from 'react-redux';

import Actions from '../actions';
import UIActions from '../actions/ui';
import Sidebar from '../components/Sidebar';

const mapStateToProps = (state) => {
  return {
    showSidebarLoading: state.ui.showSidebarLoading
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onProjectSelected: (workspaceId, projectId) => {
      dispatch(Actions.getTasksForProject(workspaceId, projectId));
      dispatch(UIActions.hideSidebar());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

