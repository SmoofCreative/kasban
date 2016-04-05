import React from 'react';
import classNames from 'classnames';

import './style';

const UserImage = ({ user }) => {
  const defaultClass = 'user-image';

  if (user === null || typeof user === 'undefined') {
    // Show fallback avatar
    const classes = classNames(defaultClass, 'user-image--photo');
    return <img className={ classes } src="avatar.png" />;
  }

  if (user.photo !== null && typeof user.photo !== 'undefined') {
    // We have a user photo to show
    const classes = classNames(defaultClass, 'user-image--photo');
    return (
      <img className={ classes } src={ user.photo.image_36x36 } />
    );
  }

  // If here we have a user with no image so show the user's initials
  if (user.name !== null && typeof user.name !== 'undefined') {
    const names = user.name.split(' ');
    let initials = names[0].split('')[0].toUpperCase();

    // Check they have entered their surname
    if (names.length >= 2) {
      initials += names[1].split('')[0].toUpperCase();
    }

    const classes = classNames(defaultClass, 'user-image--initials');
    return (
      <span className={ classes }>{ initials }</span>
    );
  }

  // Fallback show empty span
  return <span></span>;
};

export default UserImage;
