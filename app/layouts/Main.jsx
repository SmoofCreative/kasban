import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CurrentProject from '../containers/CurrentProjectContainer';
import Sidebar from '../containers/SidebarContainer';
import Actions from '../actions';

const Main = React.createClass({
  componentDidMount() {
    this.props.dispatch(Actions.checkAuth());
  },

  projectName() {
    const { workspaces, currentWorkspaceId, currentProjectId } = this.props;

    let name = '';

    if (currentWorkspaceId !== null && currentProjectId !== null) {
      const workspace = workspaces.filter((ws) => {
        return ws.id == currentWorkspaceId;
      })[0];

      const project = workspace.projects.filter((p) => {
        return p.id == currentProjectId;
      })[0];

      if (typeof project !== 'undefined') {
        name = project.name;
      }
    }

    return name;
  },

  render() {

    return (
      <div>
        <Header auth={this.props.auth} projectName={this.projectName()} />
        <CurrentProject />
        <Sidebar
          workspaces={ this.props.workspaces }
          currentProjectId={ this.props.currentProjectId }
          visible={ this.props.ui.showSidebar }
          currentWorkspaceId={ this.props.currentWorkspaceId} />
        <Footer />
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
