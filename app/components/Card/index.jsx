import React from 'react';

import './style';

const Card = ({card}) => (
  <article className="swimlane__card pure-g">
    <div className="swimlane__card-border">

      <div className="pure-u-4-5">
        <p className="swimlane__task">{card.name}</p>
        <time className="swimlane__date">{card.due_at}</time>
      </div>
    </div>
  </article>
)

export default Card;
