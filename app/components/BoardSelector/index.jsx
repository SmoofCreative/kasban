import React from 'react';
import { connect } from 'react-redux';

import Actions from '../../actions';

const BoardSelector = React.createClass({
  handleWorkspaceChange(e) {
    this.props.dispatch(Actions.getProjects(e.target.value));
  },

  renderWorkspaces() {
    return this.props.workspaces.map((workspace) => (
      <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
    ));
  },

  handleProjectChange(e) {
    console.log(e.target.value);
  },

  renderProjects() {
    return this.props.projects.map((project) => (
      <option key={project.id} value={project.id}>{project.name}</option>
    ));
  },

  render() {
    return(
      <div>
        <select onChange={this.handleWorkspaceChange} style={{marginLeft: 50}}>
          <option value="0">Select workspaces...</option>
          { this.renderWorkspaces() }
        </select>

        <select onChange={this.handleProjectChange} style={{marginLeft: 50}}>
          <option value="0">Select project...</option>
          { this.renderProjects() }
        </select>
      </div>
    );
  }
});

export default connect()(BoardSelector);
