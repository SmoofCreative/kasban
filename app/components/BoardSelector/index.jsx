import React from 'react';
import { connect } from 'react-redux';

import UIActions from '../../actions/ui';
import './style';

const BoardSelector = React.createClass({
  handleToggleClick() {
    const { dispatch, showSidebar } = this.props;
    let sidebarActive = showSidebar;
    dispatch(UIActions.setSidebarVisibilty(!sidebarActive));
  },

  render() {
    return(
      <span>
        <button onClick={ this.handleToggleClick } className="board-selector__toggle pure-button cta">Projects</button>
      </span>
    );
  }
});

const mapStateToProps = (state) => ({
  showSidebar: state.ui.showSidebar
});

export default connect(mapStateToProps)(BoardSelector);
