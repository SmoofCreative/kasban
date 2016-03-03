import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import Project from '../components/Project';
import Actions from '../actions';

const Main = React.createClass({
  componentDidMount() {
    this.props.dispatch(Actions.checkAuth());
    this.props.dispatch(Actions.getWorkspaces());
  },

  render() {
    return (
      <div>
        <Header workspaces={this.props.workspaces} projects={this.props.projects} />

        <Project />
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  projects: state.boards.projects,
  workspaces: state.boards.workspaces
});

export default connect(mapStateToProps)(Main);
