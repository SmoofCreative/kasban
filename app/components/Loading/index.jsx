import React from 'react';

import './style';

const Loading = ({text}) => {
  return (
    <div className="v-wrap">
      <div className="v-content">
        <div className="loading">
          <img className="loading__image" src="loading.gif" />
          <p className="loading__text">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
