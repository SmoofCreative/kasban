import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import Project from '../components/Project';
import Actions from '../actions';

const Main = React.createClass({
  componentDidMount() {
    this.props.dispatch(Actions.checkAuth());
  },

  render() {
    return (
      <div>
        <Header auth={this.props.auth} workspaces={this.props.workspaces} projects={this.props.projects} />

        <Project />
      </div>
    );
  }
});

const mapStateToProps = (state) => ({
  projects: state.boards.projects,
  workspaces: state.boards.workspaces,
  auth: state.auth
});

export default connect(mapStateToProps)(Main);
