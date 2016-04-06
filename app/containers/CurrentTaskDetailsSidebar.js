import { connect } from 'react-redux';

import UIActions from '../actions/ui';
import TaskDetailsSidebar from '../components/TaskDetailsSidebar';

const mapStateToProps = (state) => {
  const currentTaskId = state.entities.cards.conditions.currentId;
  return {
    card: state.entities.cards.records[currentTaskId] || {},
    visible: state.ui.showTaskDetailsSidebar
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSidebarClose: () => {
      dispatch(UIActions.hideTaskDetailsSidebar());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsSidebar);
