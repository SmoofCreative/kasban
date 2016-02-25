import React from 'react';

import './style';
import Auth from '../Auth';
import BoardSelector from '../BoardSelector';

const Header = ({workspaces, projects}) => (
  <header className="header">
    <div className="pure-u-2-3">
      <img className="header__logo" src="logo.png" />
      <div className="header__breadcrumbs">
        <BoardSelector workspaces={workspaces} projects={projects} />
      </div>
    </div>
    <div className="pure-u-1-3">
      <div className=" pull-right">
      <Auth />
      <button className="header__cta cta">Open asana</button>
      </div>
    </div>
  </header>
)

export default Header;
