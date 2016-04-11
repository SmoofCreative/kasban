import { combineReducers } from 'redux'
import update from 'react/lib/update';

const records = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_COMMENT': {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload.comment
        }
      };
    }
    case 'UPDATE_COMMENT': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.comment
        }
      };
    }
    default: {
      return state;
    }
  }
};

const conditions = (state = {}, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

const comments = combineReducers({
  records,
  conditions
});

export default comments;
