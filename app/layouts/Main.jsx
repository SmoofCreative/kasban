import React from 'react';
import { connect } from 'react-redux';

import './style';
import Header from '../components/Header';
import CurrentProject from '../containers/CurrentProjectContainer';
import Sidebar from '../containers/SidebarContainer';
import Actions from '../actions';

const Main = React.createClass({
  componentWillMount() {
    (function(d) {
      var config = {
        kitId: 'ctj8mvm',
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,'')+' wf-inactive';},config.scriptTimeout),tk=d.createElement('script'),f=false,s=d.getElementsByTagName('script')[0],a;h.className+=' wf-loading';tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!='complete'&&a!='loaded')return;f=true;clearTimeout(t);

      try{Typekit.load(config)}catch(e){console.log(e)}};s.parentNode.insertBefore(tk,s)
    })(document);
  },

  componentDidMount() {
    this.props.dispatch(Actions.checkAuth());
    this.props.dispatch(Actions.getWorkspaces());
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

      name = project.name;
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
