import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
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

  renderSelectAProject() {
    return (
      <div className="select-project">
        <div className="container">
          <img className="select-project__image" src="arrow.png" />
          <span className="select-project__text">Select a project to get started</span>
        </div>
      </div>
    );
  },

  renderContent() {
    if (this.props.showProjectLoading) {
      let loadingText = `Loading ${this.projectName()}`;

      return (
        <div className="container">
          <Loading text={loadingText}/>
        </div>
      );
    } else if (this.props.currentProjectId === null) {
      return this.renderSelectAProject();
    } else {
      return <CurrentProject />
    }
  },

  render() {
    return (
      <div>
        <Header auth={this.props.auth} projectName={this.projectName()} projectId={this.props.currentProjectId} />
        <main className="main">
          { this.renderContent() }
        </main>
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
    ui: state.ui,
    showProjectLoading: state.ui.showProjectLoading
  }
};

export default connect(mapStateToProps)(Main);
