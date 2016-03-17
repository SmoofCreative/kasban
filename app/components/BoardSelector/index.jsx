import React from 'react';
import { connect } from 'react-redux';

import UIActions from '../../actions/ui';
import './style';

const BoardSelector = React.createClass({
  handleToggleClick() {
    const { dispatch, ui } = this.props;
    let sidebarActive = ui.showSidebar;
    dispatch(UIActions.setSidebarVisibilty(!sidebarActive));
  },

  render() {
    return(
      <span>
        <button onClick={ this.handleToggleClick } className="board-selector__toggle pure-button">Projects</button>
      </span>
    );
  }
});

const mapStateToProps = (state) => ({
  ui: state.ui
});

export default connect(mapStateToProps)(BoardSelector);
