import React from 'react';

import './style';

const Card = ({card}) => (
  <article className="swimcard__card pure-g">
    <div className="swimcard__card-border">

      <div className="pure-u-4-5 swimcard__card-content">
        <p className="swimcard__task">{card.name}</p>
        <time className="swimcard__date">{card.due_at}</time>
      </div>
    </div>
  </article>
)

export default Card;
