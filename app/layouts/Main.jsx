import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BoardSelector from '../components/BoardSelector';
import Auth from '../components/Auth';
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
      <div className="message">
        <div className="container">
          <div className="v-wrap">
            <div className="v-content">
              <div className="message__text">Select a project to get started</div>
              <BoardSelector />
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderAuthenticateMessage() {
    return (
      <div className="message">
        <div className="container">
          <div className="v-wrap">
            <div className="v-content">
              <div className="message__text">Authenticate with Asana to get started</div>
              <Auth />
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderContent() {
    if (!this.props.auth.isAsanaAuthed) {
      return this.renderAuthenticateMessage();
    }

    if (this.props.currentProjectId === null) {
      return this.renderSelectAProject();
    }

    if (this.props.showProjectLoading) {
      return (
        <div className="container">
          <Loading text={`Loading ${this.projectName()}`}/>
        </div>
      );
    }

    return <CurrentProject />
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
