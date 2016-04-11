import React from 'react';

import './style';
import Comment from '../Comment';

const CommentList = ({ comments }) => {
  if (typeof comments === 'undefined' || comments.length === 0) {
    return <span></span>;
  }

  const styles = {
    height: `${70 * comments.length}px`
  }

  return (
    <ul className="comment-list" style={styles}>
      {
        comments.map((comment) => {
          return (
            <li className="comment-list__item" key={comment.id}>
              <Comment comment={comment} />
            </li>
          );
        })
      }
    </ul>
  );
};

export default CommentList;
