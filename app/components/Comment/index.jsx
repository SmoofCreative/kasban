import React from 'react';
import moment from 'moment';

import './style';
import UserImage from '../UserImage';

const formatDate = (date) => {
  return moment(date).calendar();
}

const Comment = ({ comment }) => {
  return (
    <article className="comment pure-g">
      <div className="pure-u-3-24 comment__image">
        <UserImage user={comment.created_by} />
      </div>

      <div className="pure-u-21-24 comment__content">
        <div className="comment__meta">
          <span className="comment__user-name">{ comment.created_by.name }</span>
          <span className="comment__created-at">{ formatDate(comment.created_at) }</span>
        </div>
        <p className="comment__text">
          { comment.text }
        </p>
      </div>
    </article>
  );
};

export default Comment;
