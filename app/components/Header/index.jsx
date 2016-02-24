import React from 'react';

import './style';

const Header = (props) => (
  <header className="header">
    <div className="header__col">
      <img className="header__logo" src="logo.png" />
      <div className="header__breadcrumbs">Workspaces > Smoof > Project name</div>
    </div>
    <div className="header__col header__col--right">
      <button className="header__cta cta">Open asana</button>
    </div>
  </header>
)

export default Header;
