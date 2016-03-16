import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import CurrentProject from '../containers/CurrentProjectContainer';
import Sidebar from '../components/Sidebar';
import Actions from '../actions';

const Main = React.createClass({
  componentDidMount() {
    this.props.dispatch(Actions.checkAuth());
  },

  render() {

    return (
      <div>
        <CurrentProject />
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  projects: state.boards.projects,
  currentProjectId: state.boards.currentProjectId,
  workspaces: state.boards.workspaces,
  auth: state.auth,
  ui: state.ui
});

export default connect(mapStateToProps)(Main);

// const currentProject = this.props.projects.filter((project) => {
//   return project.id == this.props.currentProjectId;
// })[0];

// <Header auth={this.props.auth} currentProject={currentProject} />
// <Sidebar
//   workspaces={ this.props.workspaces }
//   projects={ this.props.projects }
//   currentProject={ currentProject }
//   visible={ this.props.ui.showSidebar } />
