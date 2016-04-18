import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './style';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BoardSelector from '../components/BoardSelector';
import Auth from '../components/Auth';
import Loading from '../components/Loading';

import CurrentProject from '../containers/CurrentProjectContainer';
import Sidebar from '../containers/SidebarContainer';
import CurrentTaskDetailsSidebar from '../containers/CurrentTaskDetailsSidebar';

import Actions from '../actions';

const Main = React.createClass({
  componentDidMount() {
    this.props.dispatch(Actions.checkAuth());
  },

  projectName() {
    const { projectEntities, currentProjectId } = this.props;

    if (typeof currentProjectId === 'undefined') {
      return '';
    }

    return projectEntities[currentProjectId].name;
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

    if (typeof this.props.currentProjectId === 'undefined') {
      return this.renderSelectAProject();
    }

    if (this.props.ui.showProjectLoading) {
      return (
        <div className="container">
          <Loading text={`Loading ${this.projectName()}`}/>
        </div>
      );
    }

    return <CurrentProject />
  },

  render() {
    const mainClasses = classNames('main', {
      'main--task-sidebar-open': this.props.ui.showTaskDetailsSidebar
    });

    return (
      <div>
        <Header auth={this.props.auth} projectName={this.projectName()} projectId={this.props.currentProjectId} />
        <main className={ mainClasses }>
          { this.renderContent() }
        </main>
        <CurrentTaskDetailsSidebar />
        <Sidebar
          workspaces={ this.props.workspacesList }
          currentProjectId={ this.props.currentProjectId }
          />
        <Footer />
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    workspacesList: state.workspacesList,
    projectEntities: state.entities.projects.records,
    currentProjectId: state.entities.projects.conditions.currentId,
    auth: state.auth,
    ui: state.ui
  }
};

export default connect(mapStateToProps)(Main);
