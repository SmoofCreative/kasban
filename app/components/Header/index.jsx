import React from 'react';

import './style';
import Auth from '../Auth';
import BoardSelector from '../BoardSelector';
import { asanaUrl } from '../../utils'

const Header = ({auth, projectName, projectId}) => {

  let headerButton = <Auth />;
  if (auth.isAsanaAuthed) {
    let url = asanaUrl();

    if (projectId !== null) {
      url = url + `0/${projectId}`;
    }

    headerButton = <a className="header__cta cta" href={url} target="_blank">Open asana</a>;
  }

  return (
    <header className="header">
      <div className="pure-u-1-3">
        <div className="header__breadcrumbs">
          <BoardSelector />
          <span className="header__current-project">{projectName}</span>
        </div>
      </div>
      <div className="pure-u-1-3 header__logo__wrapper">
        <img className="header__logo" src="logo.jpg" />
      </div>
      <div className="pure-u-1-3">
        <div className="pull-right">
          {headerButton}
        </div>
      </div>
    </header>
  )
}


export default Header;
