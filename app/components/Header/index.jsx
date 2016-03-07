import React from 'react';

import './style';
import Auth from '../Auth';
import BoardSelector from '../BoardSelector';
import { asanaUrl } from '../../utils'

const Header = ({workspaces, projects, auth}) => {

  let headerButton = <Auth />;
  if (auth.isAsanaAuthed) {
    headerButton = <a className="header__cta cta" href={asanaUrl()} target="_blank">Open asana</a>;
  }

  return (
    <header className="header">
      <div className="pure-u-2-3">
        <img className="header__logo" src="logo.png" />
        <div className="header__breadcrumbs">
          <BoardSelector workspaces={workspaces} projects={projects} />
        </div>
      </div>
      <div className="pure-u-1-3">
        <div className=" pull-right">
          {headerButton}
        </div>
      </div>
    </header>
  )
}


export default Header;
