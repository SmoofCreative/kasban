import React from 'react';

const handleUpdate = (onUpdate, e) => {
  onUpdate(e.target.value);
};

const Typeahead = ({ onUpdate, searchValue, classname, placeholder }) => {
  return (
    <div>
      <input
        type="text"
        className={ `${classname}__typeahead` }
        placeholder={ placeholder }
        value= { searchValue }
        onChange={ handleUpdate.bind(null, onUpdate) }
      />
    </div>
  );
};

Typeahead.defaultProps = {
  placeholder: 'Search...'
};

Typeahead.propTypes = {
  onUpdate: React.PropTypes.func.isRequired,
  searchValue: React.PropTypes.string.isRequired,
  classname: React.PropTypes.string,
  placeholder: React.PropTypes.string
};

export default Typeahead;
