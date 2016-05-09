import { connect } from 'react-redux';

import Actions from '../actions';
import EventActions from '../actions/events';
import UIActions from '../actions/ui';
import Sidebar from '../components/Sidebar';

const mapStateToProps = (state) => {
  return {
    workspaceEntities: state.entities.workspaces.records,
    workspaceConditions: state.entities.workspaces.conditions,
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
      EventActions.selectProject(projectId);
    },
    onBackdropClick: () => {
      dispatch(UIActions.hideSidebar());
    },
    onTypeaheadUpdate: (id, text) => {
      dispatch(Actions.updateTypeaheadCondition(id, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

