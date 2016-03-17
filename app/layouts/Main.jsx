import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import CurrentProject from '../containers/CurrentProjectContainer';
import Sidebar from '../containers/SidebarContainer';
import Actions from '../actions';

const Main = React.createClass({
  componentDidMount() {
    this.props.dispatch(Actions.checkAuth());
    this.props.dispatch(Actions.getWorkspaces(this.props.currentWorkspaceId, this.props.currentProjectId));
  },

  render() {
    return (
      <div>
        <Header auth={this.props.auth} />
        <CurrentProject />
        <Sidebar
          workspaces={ this.props.workspaces }
          currentProjectId={ this.props.currentProjectId }
          visible={ this.props.ui.showSidebar } />

      </div>
    );
  }
});
const mapStateToProps = (state) => {
  const boards = state.boards;

  return {
    workspaces: boards.workspaces,
    currentProjectId: boards.currentProjectId,
    currentWorkspaceId: boards.currentWorkspaceId,
    auth: state.auth,
    ui: state.ui
  }
};

export default connect(mapStateToProps)(Main);
