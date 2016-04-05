import { combineReducers } from 'redux'
import update from 'react/lib/update';

const records = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CARD': {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload.card
        }
      };
    }
    case 'UPDATE_CARD': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.card
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
    case 'UPDATE_CONDITION': {
      return {
        ...state,
        [action.payload.id]: action.payload.value
      }
    }
    default: {
      return state;
    }
  }
}

const cards = combineReducers({
  records,
  conditions
});

export default cards;
