import React from 'react';

import './style';

const Card = (props) => (
  <article className="swimlane__card pure-g">
    <div className="swimlane__card-border">
      <div className="pure-u-1-5 text-center">
        <img className="swimlane__user-image" src="https://c2.staticflickr.com/8/7146/6685872171_98eb3d6cb5_z.jpg" />
      </div>
      <div className="pure-u-4-5">
        <p className="swimlane__task">Buy another computer</p>
        <time className="swimlane__date">No due date</time>
      </div>
    </div>
  </article>
)

export default Card;
